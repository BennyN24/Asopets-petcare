
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import PageLoader from "@/components/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
}

export default function ProtectedRoute({ children, requireAuth = true }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  // Show loading while checking auth
  if (isLoading) {
    return <PageLoader />;
  }

  // If route requires auth but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log('Protected route accessed without authentication, redirecting to login');
    setLocation("/");
    return <PageLoader />;
  }

  // If route doesn't require auth but user is authenticated (login/signup pages)
  if (!requireAuth && isAuthenticated) {
    console.log('Auth route accessed while authenticated, redirecting to dashboard');
    setLocation("/dashboard");
    return <PageLoader />;
  }

  return <>{children}</>;
}
