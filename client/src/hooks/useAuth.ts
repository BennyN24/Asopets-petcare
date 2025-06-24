import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";

export function useAuth() {
  const [isInitialized, setIsInitialized] = useState(false);

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!isLoading && !isInitialized) {
      setIsInitialized(true);
    }
  }, [isLoading, isInitialized]);

  const isAuthenticated = !!user && !error;

  const logout = async () => {
    console.log('[CLIENT-LOGOUT] Starting logout process...');
    
    try {
      // Call logout endpoint
      await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    
    // Always clear client state and redirect
    console.log('[CLIENT-LOGOUT] Clearing client state and redirecting...');
    
    // Clear React Query cache
    queryClient.clear();
    
    // Clear localStorage
    localStorage.clear();
    
    // Force immediate redirect to login
    window.location.replace("/");
  };

  return {
    user: user || null,
    isLoading: !isInitialized,
    isAuthenticated,
    error,
    logout,
  };
}