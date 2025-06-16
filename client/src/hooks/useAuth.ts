import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Consider user authenticated if we have user data and no 401 error
  const isAuthenticated = !!user && !error;

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
  };
}
