import * as React from "react";
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
import MedicationReminderManager from "@/components/medication-reminder-manager";
import type { Pet, Reminder, MedicalRecord } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [activeTab, setActiveTab] = React.useState("overview");
  const [showVetClinics, setShowVetClinics] = React.useState(false);
  const [showQRScanner, setShowQRScanner] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);
  const [scannedPetData, setScannedPetData] = React.useState<any>(null);
  const [scannedPets, setScannedPets] = React.useState<any[]>([]);

  // Load scanned pets from localStorage on mount
  React.useEffect(() => {
    const savedScannedPets = localStorage.getItem('asopets-scanned-pets');
    if (savedScannedPets) {
      try {
        setScannedPets(JSON.parse(savedScannedPets));
      } catch (error) {
        console.error('Failed to parse saved scanned pets:', error);
      }
    }
  }, []);

  // Save scanned pets to localStorage whenever it changes
  React.useEffect(() => {
    localStorage.setItem('asopets-scanned-pets', JSON.stringify(scannedPets));
  }, [scannedPets]);

  // Redirect to login if not authenticated
  React.useEffect(() => {
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
    queryFn: async () => {
      const response = await fetch("/api/pets?includePhotos=false&limit=20");
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
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
    <div className="mobile-container mobile-safe">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Welcome back!</h1>
            <p className="text-white/80 text-sm">
              Managing {pets.length} pet{pets.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowNotifications(true)}
              className="relative text-[#333333]"
            >
              <Bell className="w-4 h-4" />
              {totalNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {totalNotifications > 9 ? '9+' : totalNotifications}
                </span>
              )}
            </Button>
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
              {/* QR Scanner Card */}
              <div
                className="bg-blue-50 p-4 rounded-xl border-2 border-dashed border-blue-300 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                onClick={() => setShowQRScanner(true)}
              >
                <QrCode className="text-blue-400 text-2xl mb-2" />
                <p className="text-blue-500 text-sm font-medium">Scan Pet QR</p>
              </div>
            </div>

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

            {/* Other Pets Section - Scanned QR Codes */}
            {scannedPets.length > 0 && (
              <>
                <div className="flex items-center justify-between mt-8">
                  <h2 className="text-lg font-semibold text-gray-900">Other Pets</h2>
                  <span className="text-sm text-gray-500">{scannedPets.length} scanned</span>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {scannedPets.map((pet, index) => (
                    <Card 
                      key={pet.petId || index} 
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => {
                        console.log("Opening scanned pet viewer for:", pet);
                        setScannedPetData(pet);
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-lg">🐾</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium text-gray-900">{pet.petName || pet.name}</h3>
                            <p className="text-sm text-gray-600">{pet.breed}</p>
                            {pet.owner && (
                              <p className="text-xs text-gray-500 mt-1">
                                Owner: {pet.owner.name}
                              </p>
                            )}
                            <p className="text-xs text-gray-400 mt-1">
                              Scanned: {pet.scannedAt ? new Date(pet.scannedAt).toLocaleDateString() : 'Unknown date'}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {/* Quick Actions - moved below Other Pets */}
            <QuickActions onFindClinics={() => setShowVetClinics(true)} />
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
            console.log("QR Scanner - Raw scanned data:", data);
            setShowQRScanner(false);
            
            if (data && data.type === "pet_profile" && data.petId) {
              // Add to scanned pets list if not already present
              const exists = scannedPets.some(pet => pet.petId === data.petId);
              if (!exists) {
                const scannedPet = {
                  ...data,
                  scannedAt: new Date().toISOString()
                };
                console.log("Adding new scanned pet:", scannedPet);
                setScannedPets(prev => {
                  const updated = [...prev, scannedPet];
                  console.log("Updated scanned pets list:", updated);
                  return updated;
                });
                toast({
                  title: "Pet Profile Scanned",
                  description: `Added ${data.name || data.petName || 'pet'} to Other Pets section`,
                });
              } else {
                toast({
                  title: "Pet Already Scanned",
                  description: `${data.name || data.petName || 'Pet'} is already in your Other Pets list`,
                });
              }
            } else {
              console.error("Invalid QR data received:", data);
              toast({
                title: "Invalid QR Code",
                description: "This QR code is not a valid pet profile",
                variant: "destructive",
              });
            }
          }}
        />
      )}

      {scannedPetData && (
        <ScannedPetViewer 
          data={scannedPetData}
          onClose={() => setScannedPetData(null)}
          onDelete={(petData) => {
            // Remove from localStorage
            const savedPets = JSON.parse(localStorage.getItem('asopets_scanned_pets') || '[]');
            const updatedPets = savedPets.filter((p: any) => 
              !(p.petId === petData.petId && p.scannedAt === petData.scannedAt)
            );
            localStorage.setItem('asopets_scanned_pets', JSON.stringify(updatedPets));
            
            // Update state
            setScannedPets(updatedPets);
            setScannedPetData(null);
          }}
        />
      )}

      <MedicationReminderManager 
        showDropdown={showNotifications}
        onDropdownClose={() => setShowNotifications(false)}
      />

      {/* Delete Pet Confirmation Dialog */}
      <AlertDialog open={!!petToDelete} onOpenChange={() => setPetToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Pet Profile</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {petToDelete?.name}'s profile? This will permanently remove:
              <ul className="mt-2 list-disc list-inside space-y-1">
                <li>Pet profile and information</li>
                <li>All medical records</li>
                <li>All reminders and notifications</li>
                <li>All photos and attachments</li>
              </ul>
              <p className="mt-2 font-medium text-red-600">This action cannot be undone.</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (petToDelete) {
                  deletePetMutation.mutate(petToDelete.id);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletePetMutation.isPending}
            >
              {deletePetMutation.isPending ? 'Deleting...' : 'Delete Pet'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNavigation activeTab="home" />
    </div>
  );
}
