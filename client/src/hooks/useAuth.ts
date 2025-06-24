import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

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
        cache: "no-cache", // Prevent cached responses
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

      // Always clear client state regardless of server response
      console.log('[CLIENT-LOGOUT] Clearing client state...');
      queryClient.clear();
      setUser(null);
      setIsAuthenticated(false);

      // Clear any cached data in localStorage
      localStorage.removeItem('auth-user');

      // Force page reload to ensure clean state
      console.log('[CLIENT-LOGOUT] Redirecting to login...');
      window.location.href = "/";

    } catch (error) {
      console.error("Logout error:", error);
      // Even if logout request fails, clear local state
      queryClient.clear();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('auth-user');
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