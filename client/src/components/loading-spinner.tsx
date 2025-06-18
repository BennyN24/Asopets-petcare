import * as React from "react";
import { cn } from "@/lib/utils";
import { PawPrint } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = "md", className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-8 h-8"
  };

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-2", className)}>
      <div className="relative">
        <div className={cn(
          "animate-spin rounded-full border-2 border-gray-200 border-t-blue-600",
          sizeClasses[size]
        )} />
        <PawPrint className={cn(
          "absolute inset-0 m-auto text-blue-600/20",
          size === "sm" ? "w-2 h-2" : size === "md" ? "w-3 h-3" : "w-4 h-4"
        )} />
      </div>
      {text && (
        <p className={cn(
          "text-gray-600 font-medium",
          size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base"
        )}>
          {text}
        </p>
      )}
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading ASOPETS..." />
    </div>
  );
}

export function ButtonLoader() {
  return (
    <div className="flex items-center space-x-2">
      <div className="w-4 h-4 animate-spin rounded-full border-2 border-gray-200 border-t-white" />
      <span>Loading...</span>
    </div>
  );
}