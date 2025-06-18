import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    enabled: true,
  });

  // Consider user authenticated if we have user data and no error
  const isAuthenticated = !!user && !error;

  return {
    user: user || null,
    isLoading,
    isAuthenticated,
    error,
  };
}
