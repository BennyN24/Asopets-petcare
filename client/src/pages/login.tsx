import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  Phone, 
  Heart,
  Smartphone,
  Shield,
  CheckCircle,
  ArrowLeft,
  PawPrint
} from "lucide-react";
import SMSOTPLogin from "@/components/sms-otp-login";

export default function Login() {
  const [showSMSOTP, setShowSMSOTP] = useState(false);

  const handleEmailLogin = () => {
    window.location.href = "/api/login";
  };

  const handleSMSSuccess = () => {
    window.location.reload();
  };

  const handleBackToRegular = () => {
    setShowSMSOTP(false);
  };

  if (showSMSOTP) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-4">
          <Button 
            variant="ghost" 
            onClick={handleBackToRegular}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to login options
          </Button>
          <SMSOTPLogin onSuccess={handleSMSSuccess} onBackToRegular={handleBackToRegular} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto shadow-lg">
            <PawPrint className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">VetBB</h1>
            <p className="text-gray-600 mt-2">
              Your comprehensive pet care management platform
            </p>
            <p className="text-sm text-gray-500">
              Track medical records, set reminders, and manage expenses
            </p>
          </div>
        </div>

        {/* Login Options */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Welcome Back</CardTitle>
            <p className="text-center text-sm text-gray-600">
              Choose your preferred login method
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="email" className="w-full">
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

              <TabsContent value="email" className="space-y-4 mt-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">Email Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Sign in securely with your email account through our trusted authentication provider.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Secure OAuth authentication
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      No password required
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Quick and easy access
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={handleEmailLogin} 
                  className="w-full"
                  size="lg"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Continue with Email
                </Button>
              </TabsContent>

              <TabsContent value="sms" className="space-y-4 mt-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900">SMS Authentication</h3>
                  <p className="text-sm text-gray-600">
                    Get instant access with a verification code sent to your phone number.
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Instant verification code
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Works with any phone
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                      Fast and secure
                    </div>
                  </div>
                </div>

                <Button 
                  onClick={() => setShowSMSOTP(true)} 
                  className="w-full"
                  size="lg"
                  variant="outline"
                >
                  <Smartphone className="w-4 h-4 mr-2" />
                  Continue with SMS
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="bg-white/50 backdrop-blur-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-3">What you can do with VetBB:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center">
                <Heart className="w-4 h-4 text-primary mr-2" />
                Manage multiple pet profiles
              </div>
              <div className="flex items-center">
                <Shield className="w-4 h-4 text-primary mr-2" />
                Track medical records and vaccinations
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 text-primary mr-2" />
                Set up medication reminders
              </div>
              <div className="flex items-center">
                <Mail className="w-4 h-4 text-primary mr-2" />
                Monitor expenses and budgets
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Notice */}
        <div className="text-center text-xs text-gray-500">
          <div className="flex items-center justify-center space-x-1">
            <Shield className="w-3 h-3" />
            <span>Your data is protected with enterprise-grade security</span>
          </div>
        </div>
      </div>
    </div>
  );
}