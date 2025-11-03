import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { drizzle as drizzlePostgres } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import ws from "ws";
import * as schema from "@shared/schema";
import { env } from "./config";

// Determine if we're using Neon or Supabase based on the DATABASE_URL
const isNeon = env.DATABASE_URL.includes('neon.tech');
const isSupabase = env.DATABASE_URL.includes('supabase.co');

let db: ReturnType<typeof drizzle> | ReturnType<typeof drizzlePostgres>;

if (isNeon) {
  // Neon configuration
  neonConfig.webSocketConstructor = ws;
  const pool = new Pool({ connectionString: env.DATABASE_URL });
  db = drizzle({ client: pool, schema });
} else if (isSupabase) {
  // Supabase configuration
  const client = postgres(env.DATABASE_URL);
  db = drizzlePostgres(client, { schema });
} else {
  // Default PostgreSQL configuration
  const client = postgres(env.DATABASE_URL);
  db = drizzlePostgres(client, { schema });
}

export { db };