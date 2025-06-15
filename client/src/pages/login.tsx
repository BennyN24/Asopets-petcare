import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Phone, 
  Heart,
  Smartphone,
  Shield,
  CheckCircle,
  AlertCircle,
  PawPrint
} from "lucide-react";
import SMSOTPLogin from "@/components/sms-otp-login";

export default function Login() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Check for error parameters in URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      switch (errorParam) {
        case 'auth_failed':
          setError('Authentication failed. Please try again.');
          break;
        case 'callback_failed':
          setError('Login callback failed. Please try again.');
          break;
        case 'callback_error':
          setError('Authentication error occurred. Please try again.');
          break;
        default:
          setError('An error occurred during login. Please try again.');
      }
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleEmailLogin = async () => {
    setLoading(true);
    setError("");
    try {
      window.location.href = "/api/login";
    } catch (err) {
      setError("Failed to initiate login. Please try again.");
      setLoading(false);
    }
  };

  const handleSMSSuccess = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <PawPrint className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome to VetBB</h1>
          <p className="text-gray-600">Your pet's health companion</p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Login Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="email" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email" className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>Email</span>
                </TabsTrigger>
                <TabsTrigger value="sms" className="flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>SMS</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Shield className="w-4 h-4" />
                    <span>Secure authentication via Replit</span>
                  </div>
                  <Button 
                    onClick={handleEmailLogin}
                    disabled={loading}
                    className="w-full flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Connecting...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4" />
                        <span>Continue with Email</span>
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="sms" className="space-y-4">
                <SMSOTPLogin 
                  onSuccess={handleSMSSuccess} 
                  onBackToRegular={() => {}} 
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-green-800 flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              What you can do with VetBB
            </h3>
            <div className="space-y-2 text-sm text-green-700">
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                <span>Track medical records and vaccinations</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                <span>Set medication reminders</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                <span>Monitor expenses and health insights</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-3 h-3 mr-2 flex-shrink-0" />
                <span>Generate QR codes for emergency contacts</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>By signing in, you agree to our terms of service</p>
          <p>Your pet data is securely encrypted and protected</p>
        </div>
      </div>
    </div>
  );
}