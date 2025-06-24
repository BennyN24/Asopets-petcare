
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface BiometricCredential {
  id: string;
  rawId: ArrayBuffer;
  type: string;
}

export function useBiometric() {
  const [isSupported, setIsSupported] = useState(
    typeof window !== 'undefined' && 
    window.PublicKeyCredential && 
    typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const checkBiometricSupport = async () => {
    try {
      if (window.PublicKeyCredential) {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setIsSupported(available);
        return available;
      }
      return false;
    } catch (error) {
      console.error('Error checking biometric support:', error);
      return false;
    }
  };

  const registerBiometric = async (userId: string, email: string) => {
    if (!isSupported) {
      toast({
        title: "Biometric not supported",
        description: "Your device doesn't support biometric authentication",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      const userIdBuffer = new TextEncoder().encode(userId);

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: "ASOPETS",
          id: window.location.hostname,
        },
        user: {
          id: userIdBuffer,
          name: email,
          displayName: email,
        },
        pubKeyCredParams: [
          { alg: -7, type: "public-key" },
          { alg: -257, type: "public-key" }
        ],
        authenticatorSelection: {
          authenticatorAttachment: "platform",
          userVerification: "required",
          residentKey: "preferred"
        },
        timeout: 60000,
        attestation: "direct"
      };

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions
      }) as PublicKeyCredential;

      if (credential) {
        // Store credential ID in localStorage for this user
        const credentialId = Array.from(new Uint8Array(credential.rawId))
          .map(b => b.toString(16).padStart(2, '0'))
          .join('');
        
        localStorage.setItem(`biometric_${userId}`, credentialId);
        
        toast({
          title: "Biometric registered",
          description: "You can now use biometric authentication to log in",
          variant: "default",
        });

        return credential;
      }
    } catch (error: any) {
      console.error('Biometric registration error:', error);
      if (error.name === 'NotAllowedError') {
        toast({
          title: "Registration cancelled",
          description: "Biometric registration was cancelled",
          variant: "default",
        });
      } else {
        toast({
          title: "Registration failed",
          description: "Failed to register biometric authentication",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const authenticateWithBiometric = async (email: string) => {
    if (!isSupported) {
      toast({
        title: "Biometric not supported",
        description: "Your device doesn't support biometric authentication",
        variant: "destructive",
      });
      return null;
    }

    setIsLoading(true);
    try {
      const challenge = new Uint8Array(32);
      window.crypto.getRandomValues(challenge);

      // Get stored credentials for this email/device
      const storedCredentials = Object.keys(localStorage)
        .filter(key => key.startsWith('biometric_'))
        .map(key => {
          const credentialId = localStorage.getItem(key);
          if (credentialId) {
            const bytes = credentialId.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || [];
            return new Uint8Array(bytes);
          }
          return null;
        })
        .filter(Boolean) as Uint8Array[];

      if (storedCredentials.length === 0) {
        toast({
          title: "No biometric found",
          description: "No biometric authentication is set up for this account",
          variant: "default",
        });
        return null;
      }

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: storedCredentials.map(id => ({
          id,
          type: "public-key" as const,
          transports: ["internal" as const]
        })),
        userVerification: "required",
        timeout: 60000,
      };

      const assertion = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions
      }) as PublicKeyCredential;

      if (assertion) {
        toast({
          title: "Authentication successful",
          description: "Biometric authentication completed",
          variant: "default",
        });
        return assertion;
      }
    } catch (error: any) {
      console.error('Biometric authentication error:', error);
      if (error.name === 'NotAllowedError') {
        toast({
          title: "Authentication cancelled",
          description: "Biometric authentication was cancelled",
          variant: "default",
        });
      } else if (error.name === 'InvalidStateError') {
        toast({
          title: "Authentication failed",
          description: "Biometric authentication failed. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Authentication error",
          description: "An error occurred during biometric authentication",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const hasBiometricStored = (userId?: string) => {
    if (!userId) return false;
    return localStorage.getItem(`biometric_${userId}`) !== null;
  };

  const removeBiometric = (userId: string) => {
    localStorage.removeItem(`biometric_${userId}`);
    toast({
      title: "Biometric removed",
      description: "Biometric authentication has been disabled",
      variant: "default",
    });
  };

  return {
    isSupported,
    isLoading,
    checkBiometricSupport,
    registerBiometric,
    authenticateWithBiometric,
    hasBiometricStored,
    removeBiometric,
  };
}
