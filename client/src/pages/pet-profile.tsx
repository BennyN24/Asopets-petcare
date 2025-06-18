import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Syringe, PillBottle, Heart as MedicalKit, UserCog, Stethoscope, User, Calendar } from "lucide-react";
import HealthSummaryCard from "@/components/health-summary-card";
import MedicalTimeline from "@/components/medical-timeline";
import QRCodeGenerator from "@/components/qr-code-generator";
import PetEditForm from "@/components/pet-edit-form";
import VetClinics from "@/components/vet-clinics";
import type { Pet, MedicalRecord, Reminder } from "@shared/schema";

export default function PetProfile() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const petId = parseInt(id || "0");
  
  // Get URL parameters to determine initial tab
  const [activeTab, setActiveTab] = useState('overview');
  
  // Handle URL parameters for tab switching
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabParam = urlParams.get('tab');
    if (tabParam && ['overview', 'records', 'qr', 'info'].includes(tabParam)) {
      setActiveTab(tabParam);
      // Clear the URL parameter after setting the tab
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);
  
  // Also check for URL changes (in case user navigates back/forward)
  useEffect(() => {
    const handlePopState = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam && ['overview', 'records', 'qr', 'info'].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const { data: pet, isLoading: petLoading, error: petError } = useQuery<Pet>({
    queryKey: [`/api/pets/${petId}`],
    enabled: !!petId,
  });

  const { data: medicalRecords = [], isLoading: recordsLoading, error: recordsError } = useQuery<MedicalRecord[]>({
    queryKey: [`/api/pets/${petId}/medical-records`],
    enabled: !!petId,
  });



  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: [`/api/pets/${petId}/reminders`],
    enabled: !!petId,
  });

  useEffect(() => {
    if (petError && isUnauthorizedError(petError as Error)) {
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
  }, [petError, toast]);

  if (petLoading) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading pet profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Pet not found</p>
        </div>
      </div>
    );
  }

  const overdueReminders = reminders.filter(r => r.isOverdue);
  const upcomingReminders = reminders.filter(r => !r.isOverdue && !r.isCompleted);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'vaccine': return <Syringe className="w-4 h-4" />;
      case 'deworming': return <PillBottle className="w-4 h-4" />;
      case 'treatment': return <MedicalKit className="w-4 h-4" />;
      case 'surgery': return <UserCog className="w-4 h-4" />;
      case 'checkup': return <Stethoscope className="w-4 h-4" />;
      default: return <Stethoscope className="w-4 h-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button onClick={() => setLocation("/")} className="mr-4">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold">{pet.name}</h2>
              <p className="text-green-100 text-sm">{pet.breed}</p>
            </div>
          </div>
          {pet.imageUrl && (
            <img 
              src={pet.imageUrl} 
              alt={pet.name}
              className="w-12 h-12 rounded-full object-cover"
            />
          )}
        </div>
      </div>

      <div className="p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="records">Records</TabsTrigger>
            <TabsTrigger value="vet-clinics">Vets</TabsTrigger>
            <TabsTrigger value="qr">QR Code</TabsTrigger>
            <TabsTrigger value="info">Pet Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Health Summary */}
            <HealthSummaryCard 
              medicalRecords={medicalRecords} 
              reminders={reminders} 
              petId={petId}
              onRecordsClick={() => setActiveTab('records')}
            />
            
            {/* Quick Actions Menu */}
            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Add New Record</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/vaccine`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Syringe className="text-primary w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Vaccines</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/deworming`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <PillBottle className="text-secondary w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Deworming</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/treatment`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <MedicalKit className="text-accent w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Treatment</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/surgery`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <UserCog className="text-destructive w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Surgery</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/checkup`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Stethoscope className="text-purple-600 w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Check Up</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/lab-test`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Calendar className="text-indigo-600 w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Lab Test</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setLocation(`/pet/${petId}/grooming`)}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <UserCog className="text-pink-600 w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Grooming</p>
                    </div>
                  </button>

                  <button 
                    className="bg-white p-3 rounded-lg border border-gray-200 hover:border-primary hover:shadow-sm transition-all"
                    onClick={() => setActiveTab('vet-clinics')}
                  >
                    <div className="text-center">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Stethoscope className="text-teal-600 w-4 h-4" />
                      </div>
                      <p className="font-medium text-gray-900 text-sm">Vet Clinics</p>
                    </div>
                  </button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="records" className="mt-6">
            <MedicalTimeline petId={petId} medicalRecords={medicalRecords} />
          </TabsContent>
          
          <TabsContent value="vet-clinics" className="mt-6">
            <VetClinics />
          </TabsContent>
          
          <TabsContent value="qr" className="mt-6 space-y-4">
            <QRCodeGenerator 
              pet={pet} 
              medicalRecords={medicalRecords} 
            />
          </TabsContent>
          
          <TabsContent value="info" className="mt-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <User className="w-5 h-5 mr-2 text-primary" />
                    <h3 className="font-semibold text-gray-900">Pet Information</h3>
                  </div>
                  {pet && <PetEditForm pet={pet} />}
                </div>
                
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Name</label>
                      <p className="text-gray-900">{pet.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Category</label>
                      <p className="text-gray-900 capitalize">{pet.category}</p>
                    </div>
                  </div>
                  
                  {pet.breed && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Breed</label>
                      <p className="text-gray-900">{pet.breed}</p>
                    </div>
                  )}
                  
                  {pet.dateOfBirth && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">{formatDate(pet.dateOfBirth)}</p>
                    </div>
                  )}
                  
                  {pet.microchipId && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Microchip ID</label>
                      <p className="text-gray-900 font-mono text-sm">{pet.microchipId}</p>
                    </div>
                  )}
                  
                  {pet.birthmarks && (
                    <div>
                      <label className="text-sm font-medium text-gray-500">Identifying Marks</label>
                      <p className="text-gray-900">{pet.birthmarks}</p>
                    </div>
                  )}
                  
                  {pet.imageUrl && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 mb-2 block">Photo</label>
                      <img 
                        src={pet.imageUrl} 
                        alt={pet.name}
                        className="w-32 h-32 rounded-lg object-cover border"
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
