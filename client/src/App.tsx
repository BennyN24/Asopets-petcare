import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import MedicationReminderManager from "@/components/medication-reminder-manager";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
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

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Login} />
          <Route path="/landing" component={Landing} />
        </>
      ) : (
        <>
          <Route path="/" component={Dashboard} />
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
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <MedicationReminderManager />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
