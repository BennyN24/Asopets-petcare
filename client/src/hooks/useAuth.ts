import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const [localAuth, setLocalAuth] = useState<{ user: any; isAuthenticated: boolean }>({
    user: null,
    isAuthenticated: false,
  });

  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
  });

  useEffect(() => {
    if (user && !error) {
      setLocalAuth({ user, isAuthenticated: true });
    } else if (error || user === null) {
      setLocalAuth({ user: null, isAuthenticated: false });
    }
  }, [user, error]);

  return {
    user: localAuth.user,
    isLoading,
    isAuthenticated: localAuth.isAuthenticated,
  };
}