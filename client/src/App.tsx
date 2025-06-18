import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
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
import Schedule from "@/pages/schedule";
import Expenses from "@/pages/expenses";
import Profile from "@/pages/profile";
import AddPet from "@/pages/add-pet";
import PetProfile from "@/pages/pet-profile";
import VaccineForm from "@/pages/vaccine-form";
import DewormingForm from "@/pages/deworming-form";
import TreatmentForm from "@/pages/treatment-form";
import SurgeryForm from "@/pages/surgery-form";
import CheckupForm from "@/pages/checkup-form";
import LabTestForm from "@/pages/lab-test-form";
import GroomingForm from "@/pages/grooming-form";
import PrivacyPolicy from "@/pages/privacy-policy";
import TermsOfService from "@/pages/terms-of-service";
import Welcome from "@/pages/welcome";
import ResetPassword from "@/pages/reset-password";
import ForgotPassword from "@/pages/forgot-password";
import EmailConfirmed from "@/pages/email-confirmed";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

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
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
        </>
      ) : (
        <>
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
          <Route path="/privacy-policy" component={PrivacyPolicy} />
          <Route path="/terms-of-service" component={TermsOfService} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <OfflineIndicator />
        <Toaster />
        <Router />
        <MedicationReminderManager />
      </ErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
