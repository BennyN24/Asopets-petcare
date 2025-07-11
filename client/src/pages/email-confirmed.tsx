import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertCircle, ArrowLeft, Mail } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function EmailConfirmed() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const confirmEmail = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid confirmation link. No token provided.');
        return;
      }

      try {
        const response = await fetch(`/api/auth/confirm-email?token=${encodeURIComponent(token)}`);
        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage(data.message);
          toast({
            title: "Email Confirmed",
            description: "Your email has been successfully confirmed!",
          });
        } else {
          setStatus('error');
          setMessage(data.message || 'Email confirmation failed');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Network error. Please try again.');
      }
    };

    confirmEmail();
  }, [toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setLocation("/login")}
            className="absolute top-4 left-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Button>
          
          <div className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4">
            {status === 'loading' && (
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            )}
            {status === 'success' && (
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            )}
            {status === 'error' && (
              <div className="bg-red-100 rounded-full p-3">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            )}
          </div>
          
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Confirming Email...'}
            {status === 'success' && 'Email Confirmed!'}
            {status === 'error' && 'Confirmation Failed'}
          </CardTitle>
          
          <p className="text-gray-600">
            {status === 'loading' && 'Please wait while we confirm your email address.'}
            {status === 'success' && 'Your email has been successfully verified.'}
            {status === 'error' && 'There was a problem confirming your email.'}
          </p>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {message && (
            <Alert variant={status === 'error' ? 'destructive' : 'default'}>
              <Mail className="h-4 w-4" />
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === 'success' && (
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation("/")} 
                className="w-full"
              >
                Continue to Login
              </Button>
              <p className="text-sm text-gray-600 text-center">
                You can now log in to your ASOPETS account and start managing your pet's health records.
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation("/login")} 
                variant="outline"
                className="w-full"
              >
                Back to Login
              </Button>
              <p className="text-sm text-gray-600 text-center">
                If you continue to have issues, please contact support or try requesting a new confirmation email.
              </p>
            </div>
          )}

          {status === 'loading' && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                This should only take a moment...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}