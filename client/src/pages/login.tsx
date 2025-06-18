import * as React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Mail,
  Lock,
  Heart,
  Smartphone,
  CheckCircle,
  AlertCircle,
  PawPrint,
  Eye,
  EyeOff,
} from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showResendConfirmation, setShowResendConfirmation] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [lastEmailAttempt, setLastEmailAttempt] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    setShowResendConfirmation(false);
    try {
      const response = await apiRequest("POST", "/api/auth/login", data);
      // Force query invalidation to update auth state
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      // Small delay to ensure auth state updates before redirect
      setTimeout(() => {
        setLocation("/");
      }, 100);
    } catch (error: any) {
      if (error.message?.includes("confirm your email")) {
        setShowResendConfirmation(true);
        setLastEmailAttempt(data.email);
        toast({
          title: "Email confirmation required",
          description: "Please confirm your email before logging in. Click 'Resend Confirmation' if you didn't receive the email.",
          variant: "default",
        });
      } else {
        toast({
          title: "Login failed",
          description:
            error.message || "Invalid email or password. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!lastEmailAttempt) return;
    
    setIsResending(true);
    try {
      await apiRequest("POST", "/api/auth/resend-confirmation", { 
        email: lastEmailAttempt 
      });
      toast({
        title: "Confirmation email sent",
        description: "Please check your inbox and spam folder for the confirmation email.",
        variant: "default",
      });
      setShowResendConfirmation(false);
    } catch (error: any) {
      if (error.message?.includes("already confirmed")) {
        toast({
          title: "Email already confirmed",
          description: "Your email is already confirmed. You can log in now.",
          variant: "default",
        });
        setShowResendConfirmation(false);
      } else {
        toast({
          title: "Failed to resend",
          description: error.message || "Failed to resend confirmation email. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo and Title */}
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary rounded-full flex items-center justify-center">
            <PawPrint className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome to ASOPETS
          </h1>
          <p className="text-gray-600">Your pet's health companion</p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            {...field}
                            disabled={isLoading}
                            className="pr-10"
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4 text-gray-400" />
                            ) : (
                              <Eye className="h-4 w-4 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Signing In...
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 mr-2" />
                      Login
                    </>
                  )}
                </Button>
              </form>
            </Form>

            {/* Resend Confirmation Email Section */}
            {showResendConfirmation && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-blue-800 mb-3">
                      Didn't receive the confirmation email? We can send you a new one.
                    </p>
                    <Button
                      onClick={handleResendConfirmation}
                      disabled={isResending}
                      size="sm"
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                    >
                      {isResending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4 mr-2" />
                          Resend Confirmation Email
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 text-center space-y-3">
              <p className="text-sm text-gray-600">
                <button
                  onClick={() => setLocation("/forgot-password")}
                  className="text-primary font-medium hover:underline"
                >
                  Forgot your password?
                </button>
              </p>
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <button
                  onClick={() => setLocation("/signup")}
                  className="text-primary font-medium hover:underline"
                >
                  Sign up here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold text-green-800 flex items-center">
              <Heart className="w-4 h-4 mr-2" />
              What you can do with ASOPETS
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
                <span>
                  Generate QR codes and share your pet medical records
                </span>
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
