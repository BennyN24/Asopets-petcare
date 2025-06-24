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
    try {
      console.log('[CLIENT-LOGOUT] Starting logout process...');

      const response = await fetch("/api/logout", {
        method: "GET",
        credentials: "include",
        cache: "no-cache",
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });

      console.log('[CLIENT-LOGOUT] Logout response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[CLIENT-LOGOUT] Logout response:', data);
      } else {
        console.error("Logout failed:", response.status, await response.text());
      }

    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Always clear client state and redirect, regardless of server response
      console.log('[CLIENT-LOGOUT] Clearing client state...');
      
      // Clear React Query cache
      queryClient.clear();
      
      // Clear any cached data in localStorage
      localStorage.removeItem('auth-user');
      
      // Force page reload to ensure clean state and proper redirect
      console.log('[CLIENT-LOGOUT] Redirecting to login...');
      window.location.href = "/";
    }
  };

  return {
    user: user || null,
    isLoading: !isInitialized,
    isAuthenticated,
    error,
    logout,
  };
}