
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Fingerprint, Shield, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react';
import { useBiometric } from '@/hooks/useBiometric';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface BiometricLoginProps {
  onSuccess: (authenticated?: boolean) => void;
  onBackToRegular: () => void;
  email?: string;
}

export default function BiometricLogin({ onSuccess, onBackToRegular, email }: BiometricLoginProps) {
  const [step, setStep] = useState<'check' | 'authenticate' | 'setup' | 'success' | 'error'>('check');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
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
      } else {
        setStep('error');
        setErrorMessage('Biometric authentication is not supported on this device or browser.');
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

    setIsAuthenticating(true);
    setErrorMessage('');

    try {
      const assertion = await authenticateWithBiometric(email);
      if (assertion) {
        // Complete biometric login - authenticate directly with the server
        try {
          const response = await apiRequest("POST", "/api/auth/biometric-login", {
            email,
            biometricData: {
              id: Array.from(new Uint8Array(assertion.rawId))
                .map(b => b.toString(16).padStart(2, '0'))
                .join(''),
              type: assertion.type,
              response: {
                authenticatorData: Array.from(new Uint8Array(assertion.response.authenticatorData)),
                clientDataJSON: Array.from(new Uint8Array(assertion.response.clientDataJSON)),
                signature: Array.from(new Uint8Array(assertion.response.signature))
              }
            }
          });
          
          // Force query invalidation to update auth state
          queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
          
          setStep('success');
          
          setTimeout(() => {
            onSuccess(true);
          }, 1500);
          
        } catch (serverError: any) {
          console.error('Server-side biometric auth failed:', serverError);
          setStep('error');
          setErrorMessage('Biometric authentication failed on server. Please try regular login.');
          
          setTimeout(() => {
            onSuccess(false);
          }, 2000);
        }
      } else {
        setStep('error');
        setErrorMessage('Biometric authentication was cancelled or failed.');
      }
    } catch (error: any) {
      console.error('Biometric authentication failed:', error);
      setStep('error');
      
      if (error.name === 'NotAllowedError') {
        setErrorMessage('Biometric authentication was denied. Please allow biometric access.');
      } else if (error.name === 'NotSupportedError') {
        setErrorMessage('Biometric authentication is not supported on this device.');
      } else if (error.name === 'SecurityError') {
        setErrorMessage('Security error occurred. Please try again.');
      } else {
        setErrorMessage('Biometric authentication failed. Please try again or use regular login.');
      }
    } finally {
      setIsAuthenticating(false);
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
      setErrorMessage('');
      // Generate a temporary user ID for demo purposes
      const tempUserId = `temp_${Date.now()}`;
      const credential = await registerBiometric(tempUserId, email);
      
      if (credential) {
        setStep('authenticate');
        toast({
          title: "Biometric setup complete",
          description: "You can now authenticate using biometrics",
          variant: "default",
        });
      }
    } catch (error: any) {
      console.error('Biometric setup failed:', error);
      setStep('error');
      setErrorMessage('Failed to setup biometric authentication. Please try again.');
    }
  };

  const handleRetry = () => {
    setStep('authenticate');
    setErrorMessage('');
  };

  if (!isSupported && step !== 'error') {
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
        <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center ${
          step === 'success' ? 'bg-green-100' : 
          step === 'error' ? 'bg-red-100' : 
          'bg-primary/10'
        }`}>
          {step === 'success' ? (
            <CheckCircle className="w-8 h-8 text-green-600" />
          ) : step === 'error' ? (
            <AlertCircle className="w-8 h-8 text-red-600" />
          ) : (
            <Fingerprint className="w-8 h-8 text-primary" />
          )}
        </div>
        <div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {step === 'setup' ? 'Setup Biometric Login' : 
             step === 'success' ? 'Login Successful' :
             step === 'error' ? 'Authentication Failed' :
             'Biometric Login'}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {step === 'setup' 
              ? 'Secure your account with fingerprint or face recognition'
              : step === 'success'
              ? 'Welcome back! Redirecting you now...'
              : step === 'error'
              ? errorMessage
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
                disabled={isLoading || isAuthenticating}
                className="w-full"
              >
                {isLoading || isAuthenticating ? (
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

        {step === 'error' && (
          <>
            <div className="text-center space-y-3">
              <Button 
                onClick={handleRetry}
                className="w-full"
              >
                <Fingerprint className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="text-center space-y-3">
              <div className="w-full bg-green-100 text-green-800 p-3 rounded-lg">
                <p className="text-sm font-medium">Authentication successful!</p>
                <p className="text-xs">Taking you to your dashboard...</p>
              </div>
            </div>
          </>
        )}

        {step !== 'success' && (
          <div className="space-y-2">
            <Button 
              onClick={onBackToRegular} 
              variant="outline" 
              className="w-full"
              disabled={isLoading || isAuthenticating}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Email Login
            </Button>
          </div>
        )}

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
