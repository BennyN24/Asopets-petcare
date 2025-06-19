import * as React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  const [, setLocation] = useLocation();
  
  // Debug why 404 is showing
  React.useEffect(() => {
    console.log('NotFound component rendered for path:', window.location.pathname);
    console.log('Document cookies:', document.cookie);
    console.log('Current timestamp:', new Date().toISOString());
  }, []);

  const goHome = () => {
    setLocation("/");
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            Page Not Found
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <h1 className="text-6xl font-bold text-blue-600">404</h1>
            <p className="text-gray-600">
              Sorry, we couldn't find the page you're looking for.
            </p>
            <p className="text-sm text-gray-500">
              The page may have been moved, deleted, or you may have entered an incorrect URL.
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <Button onClick={goHome} className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Go to Dashboard
            </Button>
            
            <Button onClick={goBack} variant="outline" className="w-full">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="pt-4 border-t">
            <p className="text-xs text-gray-500">
              Need help? Contact support from your profile page.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}