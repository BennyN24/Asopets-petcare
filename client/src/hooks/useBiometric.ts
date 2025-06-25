import React, { useState, useEffect } from 'react';

export interface BiometricSupport {
  isAvailable: boolean;
  supportedMethods: string[];
}

export function useBiometric() {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkBiometricSupport();
  }, []);

  const checkBiometricSupport = async () => {
    try {
      // Check if WebAuthn is supported
      if (typeof window !== 'undefined' && window.PublicKeyCredential) {
        setIsSupported(true);

        // Check if user has enrolled credentials
        const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setIsEnrolled(available);
      }
    } catch (err) {
      console.error('Biometric check failed:', err);
      setError('Biometric authentication not available');
    }
  };

  const authenticate = async (): Promise<boolean> => {
    if (!isSupported) {
      throw new Error('Biometric authentication not supported');
    }

    try {
      // For demo purposes, we'll simulate biometric auth
      // In production, this would use WebAuthn APIs

      return new Promise((resolve) => {
        setTimeout(() => {
          const success = Math.random() > 0.1; // 90% success rate for demo
          resolve(success);
        }, 2000);
      });
    } catch (err) {
      console.error('Biometric authentication failed:', err);
      throw err;
    }
  };

  return {
    isSupported,
    isEnrolled,
    error,
    authenticate,
    checkBiometricSupport
  };
}