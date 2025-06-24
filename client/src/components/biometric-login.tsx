
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Shield, ArrowLeft } from 'lucide-react';
import { useBiometric } from '@/hooks/useBiometric';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface BiometricLoginProps {
  onSuccess: () => void;
  onBackToRegular: () => void;
  email?: string;
}

export default function BiometricLogin({ onSuccess, onBackToRegular, email }: BiometricLoginProps) {
  const [step, setStep] = useState<'check' | 'authenticate' | 'setup'>('check');
  const { 
    isSupported, 
    isLoading, 
    checkBiometricSupport, 
    authenticateWithBiometric, 
    registerBiometric 
  } = useBiometric();
  const { toast } = useToast();

  useEffect(() => {
    const initBiometric = async () => {
      const supported = await checkBiometricSupport();
      if (supported) {
        // Check if user has existing biometric setup
        const hasExistingBiometric = Object.keys(localStorage)
          .some(key => key.startsWith('biometric_'));
        
        if (hasExistingBiometric) {
          setStep('authenticate');
        } else {
          setStep('setup');
        }
      }
    };
    
    initBiometric();
  }, [checkBiometricSupport]);

  const handleBiometricAuth = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email first",
        variant: "destructive",
      });
      return;
    }

    try {
      const assertion = await authenticateWithBiometric(email);
      if (assertion) {
        // Simulate biometric login success - in real app you'd verify with server
        // For now, we'll proceed with regular email/password flow but show success
        toast({
          title: "Biometric verified",
          description: "Please complete login with your password",
          variant: "default",
        });
        onSuccess();
      }
    } catch (error) {
      console.error('Biometric authentication failed:', error);
    }
  };

  const handleSetupBiometric = async () => {
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Generate a temporary user ID for demo purposes
      const tempUserId = `temp_${Date.now()}`;
      const credential = await registerBiometric(tempUserId, email);
      
      if (credential) {
        setStep('authenticate');
      }
    } catch (error) {
      console.error('Biometric setup failed:', error);
    }
  };

  if (!isSupported) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-gray-400" />
          </div>
          <CardTitle>Biometric Not Available</CardTitle>
          <p className="text-gray-600 text-sm">
            Your device doesn't support biometric authentication or it's not enabled.
          </p>
        </CardHeader>
        <CardContent>
          <Button onClick={onBackToRegular} variant="outline" className="w-full">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Regular Login
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
          <Fingerprint className="w-8 h-8 text-primary" />
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {step === 'setup' ? 'Setup Biometric Login' : 'Biometric Login'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {step === 'setup' 
              ? 'Secure your account with fingerprint or face recognition'
              : 'Use your fingerprint or face to login securely'
            }
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {step === 'setup' && (
          <>
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                Set up biometric authentication for faster and more secure login.
              </p>
              <Button 
                onClick={handleSetupBiometric}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Setting up...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4 mr-2" />
                    Setup Biometric
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {step === 'authenticate' && (
          <>
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                {email ? `Login as ${email}` : 'Authenticate with your biometric'}
              </p>
              <Button 
                onClick={handleBiometricAuth}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Authenticating...
                  </>
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4 mr-2" />
                    Authenticate
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Button 
            onClick={onBackToRegular} 
            variant="outline" 
            className="w-full"
            disabled={isLoading}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Email Login
          </Button>
        </div>

        {/* Security Notice */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Secure Biometric Authentication</p>
              <p>
                Your biometric data stays on your device and is never transmitted to our servers.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
