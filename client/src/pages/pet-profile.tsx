import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Syringe, PillBottle, Heart as MedicalKit, UserCog, Stethoscope } from "lucide-react";
import type { Pet, MedicalRecord, Reminder } from "@shared/schema";

export default function PetProfile() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const petId = parseInt(id || "0");

  const { data: pet, isLoading: petLoading, error: petError } = useQuery<Pet>({
    queryKey: ["/api/pets", petId],
    enabled: !!petId,
  });

  const { data: medicalRecords = [] } = useQuery<MedicalRecord[]>({
    queryKey: ["/api/pets", petId, "medical-records"],
    enabled: !!petId,
  });

  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: ["/api/pets", petId, "reminders"],
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

      <div className="p-4 space-y-6">
        {/* Quick Actions Menu */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            onClick={() => setLocation(`/pet/${petId}/vaccine`)}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Syringe className="text-primary w-5 h-5" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">Vaccines</p>
            </div>
          </button>

          <button 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            onClick={() => setLocation(`/pet/${petId}/deworming`)}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <PillBottle className="text-secondary w-5 h-5" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">Deworming</p>
            </div>
          </button>

          <button 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            onClick={() => setLocation(`/pet/${petId}/treatment`)}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <MedicalKit className="text-accent w-5 h-5" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">Treatment</p>
            </div>
          </button>

          <button 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            onClick={() => setLocation(`/pet/${petId}/surgery`)}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <UserCog className="text-destructive w-5 h-5" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">Surgery</p>
            </div>
          </button>

          <button 
            className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow col-span-2"
            onClick={() => setLocation(`/pet/${petId}/checkup`)}
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                <Stethoscope className="text-purple-600 w-5 h-5" />
              </div>
              <p className="font-semibold text-gray-900 text-sm">Check Up</p>
            </div>
          </button>
        </div>

        {/* Recent Activities */}
        <Card>
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-900 mb-4">Recent Activities</h3>
            {medicalRecords.length > 0 ? (
              <div className="space-y-4">
                {medicalRecords.slice(0, 5).map((record) => (
                  <div key={record.id} className="flex items-start space-x-3">
                    <div className={`activity-icon ${record.type}`}>
                      {getActivityIcon(record.type)}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{record.title}</p>
                      <p className="text-xs text-gray-500">
                        Completed on {formatDate(record.dateAdministered)}
                      </p>
                      {record.nextDueDate && (
                        <p className="text-xs text-accent font-medium">
                          Next due: {formatDate(record.nextDueDate)}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No medical records yet. Add your first record using the buttons above.</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Reminders */}
        {(overdueReminders.length > 0 || upcomingReminders.length > 0) && (
          <Card className={overdueReminders.length > 0 ? "border-destructive bg-red-50" : "border-amber-200 bg-amber-50"}>
            <CardContent className="p-4">
              <div className="flex items-center mb-3">
                <MedicalKit className={`${overdueReminders.length > 0 ? 'text-destructive' : 'text-accent'} mr-2 w-5 h-5`} />
                <h3 className="font-semibold text-gray-900">
                  {overdueReminders.length > 0 ? 'Overdue Reminders' : 'Upcoming Reminders'}
                </h3>
              </div>
              <div className="space-y-2">
                {overdueReminders.map((reminder) => (
                  <div key={reminder.id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{reminder.title}</span>
                    <span className="status-badge overdue">Overdue</span>
                  </div>
                ))}
                {upcomingReminders.slice(0, 3).map((reminder) => (
                  <div key={reminder.id} className="flex justify-between items-center">
                    <span className="text-sm text-gray-700">{reminder.title}</span>
                    <span className="status-badge due-soon">Due Soon</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
