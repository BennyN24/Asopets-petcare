import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, User, Phone, Mail, MapPin, Heart, Calendar, AlertTriangle, FileText, Activity, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface ScannedPetData {
  type: string;
  petId: number | string;
  ownerId?: string;
  name?: string;
  petName?: string;
  category?: string;
  breed?: string;
  age?: number;
  dateOfBirth?: string;
  imageUrl?: string;
  microchipId?: string;
  birthmarks?: string;
  medicalRecordCount?: number;
  lastUpdated?: string;
  owner?: {
    name: string;
    phone?: string;
    email?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  scannedAt: string;
}

interface MedicalRecord {
  id: number;
  type: string;
  date: string;
  veterinarian?: string;
  clinic?: string;
  cost?: number;
  notes?: string;
  nextDueDate?: string;
}

interface ScannedPetViewerProps {
  data: ScannedPetData;
  onClose: () => void;
  onDelete?: (petData: ScannedPetData) => void;
}

export default function ScannedPetViewer({ data, onClose, onDelete }: ScannedPetViewerProps) {
  const categoryColors = {
    dog: "bg-blue-100 text-blue-800",
    cat: "bg-purple-100 text-purple-800", 
    bird: "bg-yellow-100 text-yellow-800",
    rabbit: "bg-pink-100 text-pink-800",
    horse: "bg-green-100 text-green-800",
    exotic: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800"
  };

  const petName = data.name || data.petName || 'Unknown Pet';
  const petCategory = data.category || 'other';

  // Fetch medical records for the scanned pet
  const { data: medicalRecords, isLoading: loadingRecords } = useQuery({
    queryKey: ['/api/pets', data.petId, 'medical-records'],
    enabled: !!data.petId && data.type === 'pet_profile',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const recordTypeColors = {
    vaccine: "bg-green-100 text-green-800",
    deworming: "bg-blue-100 text-blue-800",
    treatment: "bg-orange-100 text-orange-800",
    surgery: "bg-red-100 text-red-800",
    checkup: "bg-purple-100 text-purple-800",
    "lab-test": "bg-yellow-100 text-yellow-800",
    grooming: "bg-pink-100 text-pink-800"
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center">
                <Heart className="w-5 h-5 mr-2 text-primary" />
                Pet Profile
              </CardTitle>
              {data.owner && (
                <p className="text-sm text-gray-600 mt-1">
                  Owner: {data.owner.name}
                </p>
              )}
            </div>
            <div className="flex space-x-1">
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(data)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {data.imageUrl ? (
              <img
                src={data.imageUrl}
                alt={petName}
                className="w-20 h-20 rounded-full mx-auto object-cover"
              />
            ) : (
              <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center">
                <span className="text-2xl">🐾</span>
              </div>
            )}
            <h3 className="text-lg font-semibold mt-3">{petName}</h3>
            <Badge 
              className={`mt-1 ${categoryColors[petCategory as keyof typeof categoryColors] || categoryColors.other}`}
            >
              {petCategory}
            </Badge>
          </div>

          {/* Pet Details */}
          <div className="space-y-3">
            <div className="border-t pt-3">
              <h4 className="font-medium text-gray-900 mb-2">Pet Information</h4>
              <div className="space-y-2 text-sm">
                {data.breed && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Breed:</span>
                    <span className="font-medium">{data.breed}</span>
                  </div>
                )}
                {data.age && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{data.age} months</span>
                  </div>
                )}
                {data.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Born:</span>
                    <span className="font-medium">
                      {format(new Date(data.dateOfBirth), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                {data.microchipId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Microchip:</span>
                    <span className="font-medium font-mono text-xs">{data.microchipId}</span>
                  </div>
                )}
                {data.medicalRecordCount !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Medical Records:</span>
                    <span className="font-medium">{data.medicalRecordCount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Information */}
            {data.owner && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Owner Information
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{data.owner.name}</span>
                  </div>
                  {data.owner.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone:</span>
                      <a href={`tel:${data.owner.phone}`} className="font-medium text-blue-600 hover:underline flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {data.owner.phone}
                      </a>
                    </div>
                  )}
                  {data.owner.email && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email:</span>
                      <a href={`mailto:${data.owner.email}`} className="font-medium text-blue-600 hover:underline flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {data.owner.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {data.owner && (data.owner.emergencyContact || data.owner.emergencyPhone) && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
                  Emergency Contact
                </h4>
                <div className="space-y-2 text-sm">
                  {data.owner.emergencyContact && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{data.owner.emergencyContact}</span>
                    </div>
                  )}
                  {data.owner.emergencyPhone && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone:</span>
                      <a href={`tel:${data.owner.emergencyPhone}`} className="font-medium text-red-600 hover:underline flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {data.owner.emergencyPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Information */}
            {data.birthmarks && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                <div className="text-sm">
                  <span className="text-gray-600 block">Birthmarks/Notes:</span>
                  <span className="font-medium">{data.birthmarks}</span>
                </div>
              </div>
            )}

            {/* Medical Records */}
            {data.type === 'pet_profile' && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <FileText className="w-4 h-4 mr-1" />
                  Recent Medical Records
                </h4>
                {loadingRecords ? (
                  <div className="text-sm text-gray-500">Loading medical records...</div>
                ) : medicalRecords && medicalRecords.length > 0 ? (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {medicalRecords.slice(0, 5).map((record: MedicalRecord) => (
                      <div key={record.id} className="bg-gray-50 p-2 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge 
                              variant="outline" 
                              className={`text-xs ${recordTypeColors[record.type as keyof typeof recordTypeColors] || 'bg-gray-100 text-gray-800'}`}
                            >
                              {record.type}
                            </Badge>
                            <span className="text-xs text-gray-600">
                              {record.date ? format(new Date(record.date), 'MMM dd, yyyy') : 'No date'}
                            </span>
                          </div>
                        </div>
                        {record.veterinarian && (
                          <div className="text-xs text-gray-500 mt-1">
                            Dr. {record.veterinarian}
                          </div>
                        )}
                        {record.clinic && (
                          <div className="text-xs text-gray-500">
                            {record.clinic}
                          </div>
                        )}
                      </div>
                    ))}
                    {medicalRecords.length > 5 && (
                      <div className="text-xs text-gray-500 text-center pt-1">
                        +{medicalRecords.length - 5} more records
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">No medical records found</div>
                )}
              </div>
            )}

            {/* Scan Information */}
            <div className="border-t pt-3">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Scan Information
              </h4>
              <div className="text-sm text-gray-600">
                Scanned on {data.scannedAt ? format(new Date(data.scannedAt), 'MMM dd, yyyy \'at\' h:mm a') : 'Unknown date'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}