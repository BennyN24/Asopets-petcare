import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Heart, Shield, Calendar, Bell } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="mobile-container bg-gray-50">
      <div className="p-6 min-h-screen flex flex-col justify-center">
        {/* Logo and Title */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="text-white text-2xl" fill="currentColor" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">VetBB</h1>
          <p className="text-gray-600">Pet Care Solutions</p>
        </div>

        {/* Features */}
        <div className="space-y-4 mb-8">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="text-primary w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Medical Records</h3>
                  <p className="text-sm text-gray-600">Track vaccinations, treatments, and health history</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="text-secondary w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Appointment Scheduling</h3>
                  <p className="text-sm text-gray-600">Never miss important vet visits and checkups</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                  <Bell className="text-accent w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Smart Reminders</h3>
                  <p className="text-sm text-gray-600">Get notified for vaccines, deworming, and treatments</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Login Button */}
        <Button 
          onClick={handleLogin}
          className="w-full bg-primary text-white py-3 text-lg font-semibold hover:bg-green-600"
          size="lg"
        >
          Get Started
        </Button>

        <p className="text-center text-sm text-gray-500 mt-4">
          Secure login powered by Replit
        </p>
      </div>
    </div>
  );
}
