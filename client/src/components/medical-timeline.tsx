import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Syringe, 
  PillBottle, 
  Heart as MedicalKit, 
  UserCog, 
  Stethoscope,
  MapPin,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Trash2
} from "lucide-react";
import { format, isValid } from "date-fns";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MedicalRecord } from "@shared/schema";

interface MedicalTimelineProps {
  petId: number;
  medicalRecords: MedicalRecord[];
}

export default function MedicalTimeline({ petId, medicalRecords }: MedicalTimelineProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: number) => {
      await apiRequest("DELETE", `/api/pets/${petId}/medical-records/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets", petId, "medical-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pets", petId, "reminders"] });
      toast({
        title: "Record deleted",
        description: "Medical record has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getActivityIcon = (type: string) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case 'vaccine': return <Syringe {...iconProps} />;
      case 'deworming': return <PillBottle {...iconProps} />;
      case 'treatment': return <MedicalKit {...iconProps} />;
      case 'surgery': return <UserCog {...iconProps} />;
      case 'checkup': return <Stethoscope {...iconProps} />;
      case 'lab-test': return <FileText {...iconProps} />;
      default: return <Stethoscope {...iconProps} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccine': return 'bg-green-100 text-green-800 border-green-200';
      case 'deworming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'treatment': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'surgery': return 'bg-red-100 text-red-800 border-red-200';
      case 'checkup': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'lab-test': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
  };

  const formatType = (type: string) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown';
  };

  const handleDeleteRecord = (recordId: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteRecordMutation.mutate(recordId);
    }
  };

  if (medicalRecords.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-gray-900 mb-2">No Medical Records</h3>
          <p className="text-gray-500 text-sm">
            Start tracking your pet's health by adding their first medical record.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Sort records by date (newest first)
  const sortedRecords = [...medicalRecords].sort(
    (a, b) => new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime()
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Medical History</h3>
        <span className="text-sm text-gray-500">{medicalRecords.length} records</span>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {sortedRecords.map((record, index) => (
            <div key={record.id} className="relative">
              {/* Timeline dot */}
              <div className={`absolute left-4 w-4 h-4 rounded-full border-2 border-white ${
                index === 0 ? 'bg-primary' : 'bg-gray-300'
              } shadow-sm`}></div>
              
              {/* Record card */}
              <Card className="ml-12 hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`activity-icon ${record.type}`}>
                          {getActivityIcon(record.type)}
                        </div>
                        <Badge variant="outline" className={getTypeColor(record.type)}>
                          {formatType(record.type)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(record.dateAdministered)}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-1">{record.title}</h4>
                      
                      {record.description && (
                        <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                      )}

                      <div className="grid grid-cols-1 gap-2 text-xs text-gray-500">
                        {record.veterinarian && (
                          <div className="flex items-center">
                            <Stethoscope className="w-3 h-3 mr-1" />
                            <span>Dr. {record.veterinarian}</span>
                          </div>
                        )}
                        
                        {record.clinic && (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{record.clinic}</span>
                          </div>
                        )}
                        
                        {record.cost && (
                          <div className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            <span>${record.cost}</span>
                          </div>
                        )}
                        
                        {record.batchNumber && (
                          <div className="flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            <span>Batch: {record.batchNumber}</span>
                          </div>
                        )}
                      </div>

                      {record.nextDueDate && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          <span className="text-amber-800">
                            Next due: {formatDate(record.nextDueDate)}
                          </span>
                        </div>
                      )}

                      {record.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <p className="text-gray-600">{record.notes}</p>
                        </div>
                      )}

                      {record.imageUrl && (
                        <div className="mt-2">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            <span>Attached document</span>
                          </div>
                          <img 
                            src={record.imageUrl} 
                            alt="Medical record"
                            className="max-w-32 h-auto rounded border"
                          />
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-destructive"
                      onClick={() => handleDeleteRecord(record.id, record.title)}
                      disabled={deleteRecordMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}