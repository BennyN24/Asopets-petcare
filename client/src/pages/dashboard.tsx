import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Plus, Calendar, Syringe, BarChart3, MapPin, QrCode } from "lucide-react";
import { PageLoader } from "@/components/loading-spinner";
import PetCard from "@/components/pet-card";
import DashboardInsights from "@/components/dashboard-insights";
import OfflineSyncIndicator from "@/components/offline-sync-indicator";
import BottomNavigation from "@/components/bottom-navigation";
import QuickActions from "@/components/quick-actions";
import VetClinics from "@/components/vet-clinics";
import QRScanner from "@/components/qr-scanner";
import ScannedPetViewer from "@/components/scanned-pet-viewer";
import type { Pet, Reminder, MedicalRecord } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");
  const [showVetClinics, setShowVetClinics] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedPetData, setScannedPetData] = useState<any>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: pets = [], isLoading: petsLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
    enabled: !!user,
  });

  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders"],
    enabled: !!user,
  });

  const { data: overdueReminders = [] } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders/overdue"],
    enabled: !!user,
  });

  // Fetch all medical records for insights
  const allMedicalRecordsQueries = useQuery({
    queryKey: ["/api/medical-records/all"],
    queryFn: async () => {
      const allRecords: MedicalRecord[] = [];
      for (const pet of pets) {
        const response = await fetch(`/api/pets/${pet.id}/medical-records`);
        if (response.ok) {
          const records = await response.json();
          allRecords.push(...records);
        }
      }
      return allRecords;
    },
    enabled: !!user && pets.length > 0,
  });

  const allMedicalRecords = allMedicalRecordsQueries.data || [];

  if (isLoading || petsLoading) {
    return <PageLoader />;
  }

  const totalNotifications = overdueReminders.length;

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Welcome back!</h1>
            <p className="text-green-100 text-sm">
              Managing {pets.length} pet{pets.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button 
              className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              onClick={() => setShowQRScanner(true)}
            >
              <QrCode className="w-5 h-5" />
            </button>
            <button className="relative" onClick={() => setLocation("/schedule")}>
              <Bell className="w-6 h-6" />
              {totalNotifications > 0 && (
                <span className="notification-badge warning">
                  {totalNotifications}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="p-4 pb-20">
        {/* Offline Sync Indicator */}
        <OfflineSyncIndicator />

        <Tabs defaultValue="pets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pets">My Pets</TabsTrigger>
            <TabsTrigger value="insights">Health Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="pets" className="space-y-6 mt-6">
            <div className="flex items-center">
              <h2 className="text-lg font-semibold text-gray-900">Your Pets</h2>
            </div>
            {/* Pet Grid */}
            <div className="grid grid-cols-2 gap-4">
              {pets.map((pet) => (
                <PetCard
                  key={pet.id}
                  pet={pet}
                  reminders={reminders.filter((r) => r.petId === pet.id)}
                />
              ))}
              {/* Add Pet Card */}

              <div
                className="bg-gray-50 p-4 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                onClick={() => setLocation("/add-pet")}
              >
                <Plus className="text-gray-400 text-2xl mb-2" />
                <p className="text-gray-500 text-sm font-medium">Add Pet</p>
              </div>
            </div>
            {/* Quick Actions */}
            <QuickActions onFindClinics={() => setShowVetClinics(true)} />

            {/* Overdue Reminders Alert */}
            {overdueReminders.length > 0 && (
              <Card className="border-destructive bg-red-50">
                <CardContent className="p-4">
                  <div className="flex items-center mb-3">
                    <Bell className="text-destructive mr-2 w-5 h-5" />
                    <h3 className="font-semibold text-gray-900">
                      Overdue Reminders
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {overdueReminders.slice(0, 3).map((reminder) => (
                      <div
                        key={reminder.id}
                        className="flex justify-between items-center"
                      >
                        <span className="text-sm text-gray-700">
                          {reminder.title}
                        </span>
                        <span className="status-badge overdue">Overdue</span>
                      </div>
                    ))}
                    {overdueReminders.length > 3 && (
                      <p className="text-xs text-gray-500">
                        +{overdueReminders.length - 3} more overdue items
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <DashboardInsights
              pets={pets}
              allMedicalRecords={allMedicalRecords}
              reminders={reminders}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Find Vet Clinics Modal */}
      {showVetClinics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-10">
          <div className="bg-white rounded-lg m-4 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-4 border-b flex items-center justify-between">
              <h2 className="text-lg font-semibold">Find Vet Clinics</h2>
              <button
                onClick={() => setShowVetClinics(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <div className="p-4">
              <VetClinics />
            </div>
          </div>
        </div>
      )}

      {showQRScanner && (
        <QRScanner 
          onClose={() => setShowQRScanner(false)}
          onScanSuccess={(data) => {
            setShowQRScanner(false);
            if (data.type === "pet_profile") {
              setScannedPetData(data);
              toast({
                title: "Pet Profile Scanned",
                description: `Found ${data.name} - ${data.breed}`,
              });
            }
          }}
        />
      )}

      {scannedPetData && (
        <ScannedPetViewer 
          data={scannedPetData}
          onClose={() => setScannedPetData(null)}
        />
      )}

      <BottomNavigation activeTab="home" />
    </div>
  );
}
