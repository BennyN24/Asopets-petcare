import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PawPrint, Heart, Calendar, DollarSign, MapPin, ArrowRight, CheckCircle } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Medical Records",
    description: "Track vaccinations, treatments, and health history for all your pets"
  },
  {
    icon: Calendar,
    title: "Smart Reminders",
    description: "Never miss important medical appointments or medication schedules"
  },
  {
    icon: DollarSign,
    title: "Expense Tracking",
    description: "Monitor pet care costs and set budgets for different categories"
  },
  {
    icon: MapPin,
    title: "Find Vet Clinics",
    description: "Discover nearby veterinary clinics and read reviews from other pet owners"
  }
];

export default function Welcome() {
  const [currentStep, setCurrentStep] = useState(0);
  const [, setLocation] = useLocation();

  const steps = [
    {
      title: "Welcome to ASOPETS",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center">
            <PawPrint className="w-10 h-10 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Pet's Health Companion</h2>
            <p className="text-gray-600">
              Comprehensive pet care management made simple. Track medical records, 
              schedule reminders, and keep your furry friends healthy and happy.
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Key Features",
      content: (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-center text-gray-900 mb-6">Everything you need for pet care</h2>
          <div className="grid grid-cols-1 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Get Started",
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">You're all set!</h2>
            <p className="text-gray-600 mb-6">
              Start by adding your first pet to begin tracking their health and care.
            </p>
            <Button 
              onClick={() => setLocation("/add-pet")} 
              className="w-full"
              size="lg"
            >
              Add Your First Pet
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleSkip = () => {
    setLocation("/");
  };

  const currentStepData = steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-lg">{currentStepData.title}</CardTitle>
            <div className="flex space-x-2 justify-center mt-4">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStepData.content}
            
            {currentStep < steps.length - 1 && (
              <div className="flex space-x-3">
                <Button 
                  variant="outline" 
                  onClick={handleSkip}
                  className="flex-1"
                >
                  Skip
                </Button>
                <Button 
                  onClick={handleNext}
                  className="flex-1"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}