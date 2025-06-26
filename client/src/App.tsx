import React, { useEffect } from "react";
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

// Pages
import Landing from "@/pages/landing";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Dashboard from "@/pages/dashboard";
import AddPet from "@/pages/add-pet";
import PetProfile from "@/pages/pet-profile";
import VaccineForm from "@/pages/vaccine-form";
import DewormingForm from "@/pages/deworming-form";
import TreatmentForm from "@/pages/treatment-form";
import SurgeryForm from "@/pages/surgery-form";
import CheckupForm from "@/pages/checkup-form";
import LabTestForm from "@/pages/lab-test-form";
import GroomingForm from "@/pages/grooming-form";
import Schedule from "@/pages/schedule";
import Expenses from "@/pages/expenses";
import Profile from "@/pages/profile";
import NotFound from "@/pages/not-found";
import Welcome from "@/pages/welcome";
import EmailConfirmed from "@/pages/email-confirmed";
import ResetPassword from "@/pages/reset-password";
import ForgotPassword from "@/pages/forgot-password";
import FAQ from "@/pages/faq";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import QRScannerPage from "@/pages/qr-scanner";
import VetClinicsPage from "@/pages/vet-clinics";
import Premium from "@/pages/premium";
import SharedPetProfile from "@/pages/shared-pet-profile";

// Mobile debugging
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

console.log("📱 Mobile detection:", { isMobile, isIOS, userAgent: navigator.userAgent });

function Router() {
  const { isAuthenticated, isLoading, user, error } = useAuth();
  const [, setLocation] = useLocation();

  // Debug authentication state
  console.log('Router state:', { isAuthenticated, isLoading, hasUser: !!user, error });

  // Handle authentication-based redirects - always call useEffect
  useEffect(() => {
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
    <Switch>
      {/* Public routes - always available without authentication */}
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/terms" component={TermsOfService} />
      <Route path="/privacy-policy" component={PrivacyPolicy} />
      <Route path="/terms-of-service" component={TermsOfService} />
      <Route path="/faq" component={FAQ} />
      <Route path="/share/pet/:id" component={SharedPetProfile} />

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
  useEffect(() => {
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