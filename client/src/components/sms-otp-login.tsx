import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Smartphone, MessageCircle, ArrowLeft, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const phoneSchema = z.object({
  phoneNumber: z.string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^\+?[\d\s\-\(\)]+$/, "Invalid phone number format"),
});

const otpSchema = z.object({
  otp: z.string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d{6}$/, "OTP must contain only numbers"),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type OTPFormData = z.infer<typeof otpSchema>;

interface SMSOTPLoginProps {
  onSuccess: () => void;
  onBackToRegular: () => void;
}

export default function SMSOTPLogin({ onSuccess, onBackToRegular }: SMSOTPLoginProps) {
  const [step, setStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const { toast } = useToast();

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
    defaultValues: { phoneNumber: "" },
  });

  const otpForm = useForm<OTPFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: "" },
  });

  const sendOTP = async (data: PhoneFormData) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/send-otp", {
        phoneNumber: data.phoneNumber,
      });
      
      setPhoneNumber(data.phoneNumber);
      setStep("otp");
      setResendCooldown(60);
      
      // Start countdown
      const countdown = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Handle development mode - show OTP to user
      const apiResponse = response as any;
      if (apiResponse.developmentMode && apiResponse.otp) {
        toast({
          title: "OTP Sent (Development Mode)",
          description: `Your verification code is: ${apiResponse.otp}`,
          duration: 10000, // Show for 10 seconds
        });
      } else {
        toast({
          title: "OTP Sent",
          description: `Verification code sent to ${data.phoneNumber}`,
        });
      }
    } catch (error: any) {
      toast({
        title: "Failed to send OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOTP = async (data: OTPFormData) => {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/verify-otp", {
        phoneNumber,
        otp: data.otp,
      });
      
      toast({
        title: "Login successful",
        description: "Welcome to VetBB!",
      });
      
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Invalid OTP",
        description: error.message || "Please check your code and try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendCooldown > 0) return;
    
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/send-otp", {
        phoneNumber,
      });
      
      setResendCooldown(60);
      const countdown = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(countdown);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: "OTP Resent",
        description: "New verification code sent",
      });
    } catch (error: any) {
      toast({
        title: "Failed to resend OTP",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            {step === "phone" ? (
              <Smartphone className="w-8 h-8 text-primary" />
            ) : (
              <MessageCircle className="w-8 h-8 text-primary" />
            )}
          </div>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              {step === "phone" ? "Login with SMS" : "Enter Verification Code"}
            </CardTitle>
            <p className="text-gray-600 mt-2">
              {step === "phone" 
                ? "Enter your phone number to receive a verification code"
                : `We sent a 6-digit code to ${phoneNumber}`
              }
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {step === "phone" ? (
            <Form {...phoneForm}>
              <form onSubmit={phoneForm.handleSubmit(sendOTP)} className="space-y-4">
                <FormField
                  control={phoneForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="+1 (555) 123-4567"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Send Verification Code"}
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(verifyOTP)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="123456"
                          {...field}
                          disabled={isLoading}
                          className="text-center text-xl tracking-widest"
                          maxLength={6}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? "Verifying..." : "Verify & Login"}
                </Button>

                <div className="text-center">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={resendOTP}
                    disabled={resendCooldown > 0 || isLoading}
                    className="text-sm"
                  >
                    {resendCooldown > 0 
                      ? `Resend in ${resendCooldown}s` 
                      : "Resend Code"
                    }
                  </Button>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep("phone")}
                  className="w-full"
                  disabled={isLoading}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Change Phone Number
                </Button>
              </form>
            </Form>
          )}

          <div className="text-center">
            <Button
              variant="ghost"
              onClick={onBackToRegular}
              className="text-sm text-gray-600"
              disabled={isLoading}
            >
              Back to Regular Login
            </Button>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-blue-600 mt-0.5" />
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Secure SMS Authentication</p>
                <p>Your phone number is encrypted and only used for login verification. SMS charges may apply.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}