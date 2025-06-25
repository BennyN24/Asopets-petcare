
import React from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  PawPrint, 
  Heart, 
  Calendar, 
  Shield, 
  ArrowRight, 
  X,
  Sparkles,
  Gift
} from 'lucide-react';

interface WelcomeOverlayProps {
  onClose: () => void;
  userName?: string;
}

export default function WelcomeOverlay({ onClose, userName }: WelcomeOverlayProps) {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    onClose();
    setLocation('/dashboard');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute right-2 top-2 h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <PawPrint className="w-10 h-10 text-white" />
          </div>
          
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 text-yellow-500" />
            Welcome to ASOPETS!
            <Sparkles className="w-6 h-6 text-yellow-500" />
          </CardTitle>
          
          {userName && (
            <p className="text-blue-600 font-medium">
              Hi {userName}! 👋
            </p>
          )}
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-gray-600 mb-4">
              Your pet's health journey starts here! Let's explore what ASOPETS can do for you.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Heart className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Health Tracking</h3>
                <p className="text-xs text-gray-600">Track vaccines, treatments & more</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Smart Reminders</h3>
                <p className="text-xs text-gray-600">Never miss important appointments</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-white/60 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Secure Records</h3>
                <p className="text-xs text-gray-600">All data safely stored & accessible</p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button onClick={handleGetStarted} className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
              Get Started
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              ✨ You can always access help from the profile menu
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface WelcomeOverlayProps {
  onClose: () => void;
  userName?: string;
}

export default function WelcomeOverlay({ onClose, userName }: WelcomeOverlayProps) {
  const [, setLocation] = useLocation();

  const handleGetStarted = () => {
    onClose();
    setLocation('/add-pet');
  };

  const handleExplore = () => {
    onClose();
    setLocation('/');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-2xl">
        <CardHeader className="text-center pb-4 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4 relative">
            <PawPrint className="w-10 h-10 text-white" />
            <div className="absolute -top-1 -right-1">
              <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            </div>
          </div>
          
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome to ASOPETS!
          </CardTitle>
          
          <p className="text-gray-600 mt-2">
            {userName ? `Hi ${userName}! ` : 'Hello! '}
            You're all set to start managing your pet's health and happiness.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Quick Features Overview */}
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Heart className="w-4 h-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Track Medical Records</p>
                <p className="text-xs text-gray-600">Vaccinations, treatments & more</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Smart Reminders</p>
                <p className="text-xs text-gray-600">Never miss important dates</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-white/70 rounded-lg">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Shield className="w-4 h-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">QR Pet Tags</p>
                <p className="text-xs text-gray-600">Digital pet identification</p>
              </div>
            </div>
          </div>

          {/* Welcome Gift Notice */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Gift className="w-5 h-5 text-yellow-600" />
              <p className="font-medium text-yellow-800">Welcome Gift!</p>
            </div>
            <p className="text-sm text-yellow-700">
              Start with unlimited medical records and reminders. All features are free to get you started!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleGetStarted}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              size="lg"
            >
              Add Your First Pet
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            
            <Button 
              onClick={handleExplore}
              variant="outline"
              className="w-full"
            >
              Explore Dashboard
            </Button>
          </div>

          {/* Tips */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              💡 Tip: Upload photos and documents to keep everything organized in one place
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
