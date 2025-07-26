import { useState, useEffect } from "react";

export interface BiometricCredential {
  id: string;
  type: string;
  publicKey: ArrayBuffer;
}

export function useBiometric() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      if (typeof window === "undefined") return;

      // Check if WebAuthn is supported
      const webAuthnSupported =
        window.PublicKeyCredential &&
        typeof window.PublicKeyCredential.create === "function";

      if (webAuthnSupported) {
        setIsSupported(true);

        // Check if platform authenticator is available
        const available =
          await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setIsEnrolled(available);
      } else {
        setIsSupported(false);
        setError("WebAuthn not supported on this device");
      }
    } catch (err) {
      console.error("Biometric support check failed:", err);
      setError("Unable to check biometric support");
      setIsSupported(false);
    }
  };

  const registerBiometric = async (
    userId: string,
    email: string,
  ): Promise<BiometricCredential | null> => {
    if (!isSupported) {
      throw new Error("Biometric authentication not supported");
    }

    setIsLoading(true);
    setError(null);

    try {
      const credential = (await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "ASOPETS",
            id: window.location.hostname,
          },
          user: {
            id: new TextEncoder().encode(userId),
            name: email,
            displayName: email,
          },
          pubKeyCredParams: [
            { alg: -7, type: "public-key" },
            { alg: -257, type: "public-key" },
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
            requireResidentKey: false,
          },
          timeout: 60000,
          attestation: "direct",
        },
      })) as PublicKeyCredential;

      if (credential) {
        setIsEnrolled(true);
        return {
          id: credential.id,
          type: credential.type,
          publicKey:
            (
              credential.response as AuthenticatorAttestationResponse
            ).getPublicKey() || new ArrayBuffer(0),
        };
      }
      return null;
    } catch (err: any) {
      console.error("Biometric registration failed:", err);
      if (err.name === "NotAllowedError") {
        setError("Biometric registration was cancelled or not allowed");
      } else if (err.name === "NotSupportedError") {
        setError("Biometric authentication not supported");
      } else {
        setError("Failed to register biometric authentication");
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = async (credentialId?: string): Promise<boolean> => {
    if (!isSupported) {
      throw new Error("Biometric authentication not supported");
    }

    setIsLoading(true);
    setError(null);

    try {
      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: new Uint8Array(32),
          allowCredentials: credentialId
            ? [
                {
                  id: new TextEncoder().encode(credentialId),
                  type: "public-key",
                },
              ]
            : [],
          userVerification: "required",
          timeout: 60000,
        },
      });

      return !!credential;
    } catch (err: any) {
      console.error("Biometric authentication failed:", err);
      if (err.name === "NotAllowedError") {
        setError("Biometric authentication was cancelled");
      } else {
        setError("Biometric authentication failed");
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isSupported,
    isEnrolled,
    isLoading,
    error,
    authenticate,
    registerBiometric,
    checkBiometricSupport,
  };
}
