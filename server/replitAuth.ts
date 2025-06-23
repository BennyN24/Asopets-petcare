import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

if (!process.env.REPLIT_DOMAINS) {
  throw new Error("Environment variable REPLIT_DOMAINS not provided");
}

const getOidcConfig = memoize(
  async () => {
    try {
      console.log('[AUTH] Initializing OIDC configuration');
      console.log('[AUTH] REPL_ID:', process.env.REPL_ID ? 'exists' : 'missing');
      console.log('[AUTH] REPLIT_DOMAINS:', process.env.REPLIT_DOMAINS ? 'exists' : 'missing');
      
      const issuerUrl = process.env.ISSUER_URL ?? "https://replit.com/oidc";
      console.log('[AUTH] Using issuer URL:', issuerUrl);
      
      const config = await client.discovery(
        new URL(issuerUrl),
        process.env.REPL_ID!
      );
      
      console.log('[AUTH] OIDC configuration loaded successfully');
      return config;
    } catch (error) {
      console.error('[AUTH] Failed to load OIDC configuration:', error);
      throw error;
    }
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl / 1000, // Convert to seconds for pg-simple
    tableName: "sessions",
  });
  return session({
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    name: 'vetbb.sid',
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'lax',
      maxAge: sessionTtl,
    },
  });
}

function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(
  claims: any,
) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  let config;
  try {
    config = await getOidcConfig();
  } catch (error) {
    console.error('[AUTH] Failed to initialize OIDC config, auth routes will not work:', error);
    // Continue setup without OIDC to prevent server crash
    return;
  }

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    try {
      console.log('[AUTH] Verifying tokens for user:', tokens.claims()?.sub);
      const user = {};
      updateUserSession(user, tokens);
      await upsertUser(tokens.claims());
      console.log('[AUTH] User verified successfully:', tokens.claims()?.sub);
      verified(null, user);
    } catch (error) {
      console.error('[AUTH] Verification error:', error);
      verified(error, null);
    }
  };

  // Configure domains based on environment
  const baseDomains = process.env.REPLIT_DOMAINS!.split(",");
  const domains = process.env.NODE_ENV === 'development' 
    ? baseDomains.concat(['localhost', '127.0.0.1'])
    : baseDomains;
  console.log('[AUTH] Registering strategies for domains:', domains);
  
  for (const domain of domains) {
    const isLocal = domain === 'localhost' || domain === '127.0.0.1';
    const protocol = isLocal ? 'http' : 'https';
    const port = isLocal ? ':5000' : '';
    const callbackURL = `${protocol}://${domain}${port}/api/callback`;
    
    const strategy = new Strategy(
      {
        name: `replitauth:${domain}`,
        config,
        scope: "openid email profile offline_access",
        callbackURL: callbackURL,
      },
      verify,
    );
    passport.use(strategy);
    console.log(`[AUTH] Registered strategy for domain: ${domain} with callback: ${callbackURL}`);
  }

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  // Replit Auth login endpoint - only enabled if OIDC is configured
  app.get("/api/replit-login", (req, res, next) => {
    if (!config) {
      console.log('[AUTH] OIDC not configured, redirecting to login page');
      return res.redirect("/login?error=replit_auth_not_configured");
    }
    
    console.log(`[AUTH] Replit login attempt for hostname: ${req.hostname}`);
    
    // Check if strategy exists for this hostname
    const strategyName = `replitauth:${req.hostname}`;
    if (!passport._strategy(strategyName)) {
      console.log(`[AUTH] No strategy found for ${req.hostname}, using first available strategy`);
      const firstDomain = domains[0];
      return passport.authenticate(`replitauth:${firstDomain}`, {
        scope: ["openid", "email", "profile", "offline_access"],
        failureRedirect: "/login?error=auth_failed",
      })(req, res, next);
    }
    
    passport.authenticate(strategyName, {
      scope: ["openid", "email", "profile", "offline_access"],
      failureRedirect: "/login?error=auth_failed",
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    if (!config) {
      console.log('[AUTH] OIDC not configured for callback');
      return res.redirect("/login?error=auth_not_configured");
    }
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[AUTH] Callback received for hostname: ${req.hostname}`);
      console.log(`[AUTH] Callback query params:`, req.query);
      console.log(`[AUTH] Session ID:`, req.sessionID);
    }
    
    passport.authenticate(`replitauth:${req.hostname}`, (err: any, user: any, info: any) => {
      if (err) {
        console.error("[AUTH] Callback authentication error:", err);
        return res.redirect("/login?error=callback_error");
      }
      
      if (!user) {
        console.error("[AUTH] No user returned from authentication:", info);
        return res.redirect("/login?error=callback_failed");
      }
      
      req.logIn(user, (loginErr: any) => {
        if (loginErr) {
          console.error("[AUTH] Login error:", loginErr);
          return res.redirect("/login?error=login_failed");
        }
        
        console.log("[AUTH] User successfully logged in:", user.claims?.sub);
        return res.redirect("/");
      });
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    if (!config) {
      req.logout(() => {
        res.redirect("/login");
      });
      return;
    }
    
    req.logout(() => {
      res.redirect(
        client.buildEndSessionUrl(config, {
          client_id: process.env.REPL_ID!,
          post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
        }).href
      );
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUTH] Checking authentication for:', req.url);
    console.log('[AUTH] Session ID:', req.sessionID);
    console.log('[AUTH] Is authenticated:', req.isAuthenticated());
  }
  
  const user = req.user as any;
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUTH] User object:', user ? 'exists' : 'null');
  }

  if (!req.isAuthenticated()) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] User not authenticated');
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!user) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] No user object in session');
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!user.expires_at) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] No expiration time in user session');
    }
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (process.env.NODE_ENV === 'development') {
    console.log('[AUTH] Token expires at:', user.expires_at, 'Current time:', now);
  }
  
  if (now <= user.expires_at) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] Token still valid');
    }
    return next();
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[AUTH] Token expired, attempting refresh');
  }
  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] No refresh token available');
    }
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    if (process.env.NODE_ENV === 'development') {
      console.log('[AUTH] Token refreshed successfully');
    }
    return next();
  } catch (error) {
    console.error('[AUTH] Token refresh failed:', error);
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
