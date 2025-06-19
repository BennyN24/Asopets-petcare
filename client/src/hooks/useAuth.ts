import { useQuery } from "@tanstack/react-query";
import * as React from "react";

export function useAuth() {
  const [authState, setAuthState] = React.useState<{
    isAuthenticated: boolean;
    user: any;
    isLoading: boolean;
  }>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  React.useEffect(() => {
    const isAuthenticated = !!user && !error;
    setAuthState({
      isAuthenticated,
      user,
      isLoading,
    });
    
    // Debug authentication state
    console.log('useAuth update:', { 
      user: !!user, 
      isLoading, 
      error: error?.message, 
      isAuthenticated,
      errorDetails: error 
    });
  }, [user, isLoading, error]);

  return authState;
}
