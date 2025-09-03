import * as React from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { useAuth } from "@/hooks/useAuth";
import { useWelcome } from "@/hooks/useWelcome";
import LoadingSpinner from "@/components/loading-spinner";
import ProtectedRoute from "@/components/protected-route";
import { OfflineIndicator } from "@/components/offline-indicator";
import WelcomeOverlay from "@/components/welcome-overlay";
import { ErrorBoundary } from "@/components/error-boundary";

// Lazy load pages for better performance
const Landing = React.lazy(() => import("@/pages/landing"));
const Login = React.lazy(() => import("@/pages/login"));
const Signup = React.lazy(() => import("@/pages/signup"));
const Dashboard = React.lazy(() => import("@/pages/dashboard"));
const AddPet = React.lazy(() => import("@/pages/add-pet"));
const PetProfile = React.lazy(() => import("@/pages/pet-profile"));
const VaccineForm = React.lazy(() => import("@/pages/vaccine-form"));
const DewormingForm = React.lazy(() => import("@/pages/deworming-form"));
const TreatmentForm = React.lazy(() => import("@/pages/treatment-form"));
const SurgeryForm = React.lazy(() => import("@/pages/surgery-form"));
const CheckupForm = React.lazy(() => import("@/pages/checkup-form"));
const LabTestForm = React.lazy(() => import("@/pages/lab-test-form"));
const GroomingForm = React.lazy(() => import("@/pages/grooming-form"));
const Schedule = React.lazy(() => import("@/pages/schedule"));
const Expenses = React.lazy(() => import("@/pages/expenses"));
const Profile = React.lazy(() => import("@/pages/profile"));
const NotFound = React.lazy(() => import("@/pages/not-found"));
const Welcome = React.lazy(() => import("@/pages/welcome"));
const EmailConfirmed = React.lazy(() => import("@/pages/email-confirmed"));
const ResetPassword = React.lazy(() => import("@/pages/reset-password"));
const ForgotPassword = React.lazy(() => import("@/pages/forgot-password"));
const FAQ = React.lazy(() => import("@/pages/faq"));
const PrivacyPolicy = React.lazy(() => import("@/pages/privacy-policy"));
const TermsOfService = React.lazy(() => import("@/pages/terms-of-service"));
const QRScannerPage = React.lazy(() => import("@/pages/qr-scanner"));
const VetClinicsPage = React.lazy(() => import("@/pages/vet-clinics"));
const Premium = React.lazy(() => import("@/pages/premium"));
const SharedPetProfile = React.lazy(() => import("@/pages/shared-pet-profile"));
const BulkAddPets = React.lazy(() => import("@/pages/bulk-add-pets"));

// Mobile debugging
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

console.log("📱 Mobile detection:", { isMobile, isIOS, userAgent: navigator.userAgent });

function PublicShareRouter() {
  console.log('Rendering public share route without authentication');
  return (
    <div className="min-h-screen">
      <React.Suspense fallback={<LoadingSpinner />}>
        <Switch>
          <Route path="/share/pet/:id" component={SharedPetProfile} />
          <Route component={NotFound} />
        </Switch>
      </React.Suspense>
    </div>
  );
}

function Router() {
  const [location, setLocation] = useLocation();
  
  // Always call useAuth hook to maintain consistent hook order
  const { isAuthenticated, isLoading, user, error } = useAuth();
  
  const isPublicShareRoute = location.startsWith('/share/pet/');
  
  // Render public routes immediately without any authentication
  if (isPublicShareRoute) {
    return <PublicShareRouter />;
  }

  // Debug authentication state
  console.log('Router state:', { isAuthenticated, isLoading, hasUser: !!user, error, location });

  // Handle authentication-based redirects
  React.useEffect(() => {
    if (isLoading) return; // Don't redirect while loading

    const currentPath = window.location.pathname;

    if (!isAuthenticated && !["/", "/signup", "/forgot-password", "/reset-password", "/email-confirmed", "/landing"].includes(currentPath)) {
      console.log('Unauthenticated user accessing protected route, redirecting to login');
      setLocation("/");
      return;
    }

    if (isAuthenticated && ["/", "/signup", "/forgot-password", "/reset-password", "/landing"].includes(currentPath)) {
      console.log('Authenticated user accessing auth routes, redirecting to dashboard');
      setLocation("/dashboard");
      return;
    }
  }, [isAuthenticated, isLoading, setLocation]);

  // Show loading while authentication is being determined
  if (isLoading) {
    console.log('Showing loader - authentication in progress');
    return <LoadingSpinner />;
  }

  // Handle authentication errors
  if (error && !isAuthenticated) {
    console.log('Authentication error, showing login:', error);
  }

  console.log('Rendering routes with auth state:', { isAuthenticated, isLoading });

  return (
    <React.Suspense fallback={<LoadingSpinner />}>
      <Switch>
        {/* Public routes - always available without authentication */}
        <Route path="/privacy" component={PrivacyPolicy} />
        <Route path="/terms" component={TermsOfService} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/faq" component={FAQ} />

        {/* Authenticated routes */}
        {isAuthenticated ? (
          <>
            <Route path="/" component={Dashboard} />
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/welcome" component={Welcome} />
            <Route path="/schedule" component={Schedule} />
            <Route path="/expenses" component={Expenses} />
            <Route path="/profile" component={Profile} />
            <Route path="/add-pet" component={AddPet} />
            <Route path="/bulk-add-pets" component={BulkAddPets} />
            <Route path="/pet/:id" component={PetProfile} />
            <Route path="/pet/:id/vaccine" component={VaccineForm} />
            <Route path="/pet/:id/deworming" component={DewormingForm} />
            <Route path="/pet/:id/treatment" component={TreatmentForm} />
            <Route path="/pet/:id/surgery" component={SurgeryForm} />
            <Route path="/pet/:id/checkup" component={CheckupForm} />
            <Route path="/pet/:id/lab-test" component={LabTestForm} />
            <Route path="/pet/:id/grooming" component={GroomingForm} />
            <Route path="/vet-clinics" component={VetClinicsPage} />
            <Route path="/qr-scanner" component={QRScannerPage} />
            {/* Catch-all route for 404 when authenticated */}
            <Route component={NotFound} />
          </>
        ) : (
          <>
            {/* Unauthenticated routes */}
            <Route path="/" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/forgot-password" component={ForgotPassword} />
            <Route path="/reset-password" component={ResetPassword} />
            <Route path="/email-confirmed" component={EmailConfirmed} />
            <Route path="/landing" component={Landing} />
            {/* Catch-all route for 404 when unauthenticated */}
            <Route component={NotFound} />
          </>
        )}
      </Switch>
    </React.Suspense>
  );
}

function AppContent() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const { showWelcome, markWelcomeSeen } = useWelcome();

  return (
    <>
      <OfflineIndicator />
      <Toaster />
      <Router />

      {/* Welcome Overlay for New Users */}
      {showWelcome && (
        <WelcomeOverlay 
          onClose={markWelcomeSeen}
          userName={(user as any)?.firstName || (user as any)?.displayName}
        />
      )}
    </>
  );
}

function App() {
  // Ensure React is available to child components
  React.useEffect(() => {
    if (!(window as any).React) {
      (window as any).React = React;
    }
  }, []);

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;