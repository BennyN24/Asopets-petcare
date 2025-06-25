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
      const response = await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        console.error("Logout failed:", response.status);
      }
    } catch (error) {
      console.error("Logout API error:", error);
    }
    
    // Always clear client state and redirect
    console.log('[CLIENT-LOGOUT] Clearing client state and redirecting...');
    
    // Clear React Query cache
    queryClient.clear();
    
    // Clear localStorage and sessionStorage
    localStorage.clear();
    sessionStorage.clear();
    
    // Invalidate auth query to force re-authentication
    queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
    
    // Small delay to ensure state is cleared, then redirect
    setTimeout(() => {
      console.log('[CLIENT-LOGOUT] Redirecting to login page...');
      window.location.replace("/");
    }, 100);
  };

  return {
    user: user || null,
    isLoading: !isInitialized,
    isAuthenticated,
    error,
    logout,
  };
}