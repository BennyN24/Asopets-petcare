
import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Check, Crown, Zap, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionPlan {
  id: number;
  name: string;
  price: string;
  storageLimit: number | null;
  features: Record<string, any>;
}

interface UserSubscription {
  id: number;
  status: string;
  plan: SubscriptionPlan;
  storageUsed: number;
}

interface StorageUsage {
  used: number;
  limit: number;
  percentage: number;
  unlimited: boolean;
}

export default function Premium() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: plans = [] } = useQuery<SubscriptionPlan[]>({
    queryKey: ["subscription-plans"],
    queryFn: async () => {
      const response = await fetch("/api/subscription-plans");
      if (!response.ok) throw new Error("Failed to fetch plans");
      return response.json();
    },
  });

  const { data: currentSubscription } = useQuery<UserSubscription | null>({
    queryKey: ["my-subscription"],
    queryFn: async () => {
      const response = await fetch("/api/my-subscription");
      if (!response.ok) return null;
      return response.json();
    },
    enabled: !!user,
  });

  const { data: storageUsage } = useQuery<StorageUsage>({
    queryKey: ["storage-usage"],
    queryFn: async () => {
      const response = await fetch("/api/storage-usage");
      if (!response.ok) throw new Error("Failed to fetch storage usage");
      return response.json();
    },
    enabled: !!user,
  });

  const subscribeMutation = useMutation({
    mutationFn: async (planId: number) => {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      if (!response.ok) throw new Error("Failed to subscribe");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your subscription has been activated.",
      });
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      queryClient.invalidateQueries({ queryKey: ["storage-usage"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to process subscription. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatStorage = (mb: number | null) => {
    if (mb === null) return "Unlimited";
    if (mb >= 1024) return `${(mb / 1024).toFixed(1)} GB`;
    return `${mb} MB`;
  };

  const getPlanIcon = (planName: string) => {
    if (planName.includes("Unlimited")) return <Crown className="w-5 h-5" />;
    if (planName.includes("Premium")) return <Zap className="w-5 h-5" />;
    return <Shield className="w-5 h-5" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-gray-600">
          Upgrade to Premium for more storage and advanced features
        </p>
      </div>

      {/* Current Storage Usage */}
      {storageUsage && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Storage Usage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Used: {formatStorage(storageUsage.used)}</span>
                <span>
                  Limit: {formatStorage(storageUsage.limit)}
                </span>
              </div>
              <Progress value={storageUsage.percentage} className="h-2" />
              {storageUsage.percentage > 80 && (
                <p className="text-amber-600 text-sm">
                  You're running low on storage. Consider upgrading your plan.
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subscription Plans */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrentPlan = currentSubscription?.plan.id === plan.id;
          const isPremium = plan.name.includes("Premium");

          return (
            <Card
              key={plan.id}
              className={`relative ${
                isPremium ? "border-blue-500 shadow-lg" : ""
              } ${isCurrentPlan ? "ring-2 ring-green-500" : ""}`}
            >
              {isPremium && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">Popular</Badge>
                </div>
              )}

              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  {getPlanIcon(plan.name)}
                </div>
                <CardTitle className="text-xl">{plan.name}</CardTitle>
                <div className="text-2xl font-bold">
                  ${plan.price}
                  {plan.price !== "0.00" && (
                    <span className="text-sm font-normal text-gray-500">
                      /month
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">
                      {formatStorage(plan.storageLimit)} storage
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">
                      {plan.features.pets} pets
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-sm">QR codes & reminders</span>
                  </div>
                  {plan.features.prioritySupport && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Priority support</span>
                    </div>
                  )}
                  {plan.features.advancedAnalytics && (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Advanced analytics</span>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  variant={isCurrentPlan ? "outline" : "default"}
                  disabled={isCurrentPlan || subscribeMutation.isPending}
                  onClick={() => subscribeMutation.mutate(plan.id)}
                >
                  {isCurrentPlan
                    ? "Current Plan"
                    : subscribeMutation.isPending
                    ? "Processing..."
                    : plan.price === "0.00"
                    ? "Get Started"
                    : "Upgrade Now"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Features Comparison */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-center mb-8">
          Why Choose Premium?
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="text-center">
              <Crown className="w-8 h-8 mx-auto text-yellow-500 mb-2" />
              <CardTitle>More Storage</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Store more photos, documents, and medical records for all your pets
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Zap className="w-8 h-8 mx-auto text-blue-500 mb-2" />
              <CardTitle>Priority Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Get faster response times and dedicated support for any issues
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="text-center">
              <Shield className="w-8 h-8 mx-auto text-green-500 mb-2" />
              <CardTitle>Advanced Features</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 text-center">
                Access to analytics, insights, and upcoming premium features
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
