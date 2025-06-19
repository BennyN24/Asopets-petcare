import * as React from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";

import { useAuth } from "@/hooks/useAuth";
import { ErrorBoundary } from "@/components/error-boundary";
import { PageLoader } from "@/components/loading-spinner";
import { OfflineIndicator } from "@/components/offline-indicator";
import MedicationReminderManager from "@/components/medication-reminder-manager";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Landing from "@/pages/landing";
import Dashboard from "@/pages/dashboard";
import Welcome from "@/pages/welcome";
import ResetPassword from "@/pages/reset-password";
import ForgotPassword from "@/pages/forgot-password";
import EmailConfirmed from "@/pages/email-confirmed";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";

// Lazy load authenticated pages to improve initial load time
const Schedule = React.lazy(() => import("@/pages/schedule"));
const Expenses = React.lazy(() => import("@/pages/expenses"));
const Profile = React.lazy(() => import("@/pages/profile"));
const AddPet = React.lazy(() => import("@/pages/add-pet"));
const PetProfile = React.lazy(() => import("@/pages/pet-profile"));
const VaccineForm = React.lazy(() => import("@/pages/vaccine-form"));
const DewormingForm = React.lazy(() => import("@/pages/deworming-form"));
const TreatmentForm = React.lazy(() => import("@/pages/treatment-form"));
const SurgeryForm = React.lazy(() => import("@/pages/surgery-form"));
const CheckupForm = React.lazy(() => import("@/pages/checkup-form"));
const LabTestForm = React.lazy(() => import("@/pages/lab-test-form"));
const GroomingForm = React.lazy(() => import("@/pages/grooming-form"));

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Debug authentication state
  console.log('Router state:', { isAuthenticated, isLoading });
  console.log('Current location:', window.location.pathname);

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <Switch>
      {!isAuthenticated ? (
        <>
          <Route path="/" component={Login} />
          <Route path="/signup" component={Signup} />
          <Route path="/forgot-password" component={ForgotPassword} />
          <Route path="/reset-password" component={ResetPassword} />
          <Route path="/email-confirmed" component={EmailConfirmed} />
          <Route path="/landing" component={Landing} />
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/terms" component={TermsOfService} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
        </>
      ) : (
        <React.Suspense fallback={<PageLoader />}>
          <Route path="/" component={Dashboard} />
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
          <Route path="/privacy" component={PrivacyPolicy} />
          <Route path="/terms" component={TermsOfService} />
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
        </React.Suspense>
      )}
      <Route component={NotFound} />
    </Switch>
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
        <OfflineIndicator />
        <Toaster />
        <Router />
        <MedicationReminderManager />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
