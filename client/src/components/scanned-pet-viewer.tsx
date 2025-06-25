import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, User, Phone, Mail, MapPin, Heart, Calendar, AlertTriangle, FileText, Activity, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { QrCode } from "lucide-react";
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ScannedPetData {
  type: string;
  petId: string;
  ownerId?: string;
  name?: string;
  petName?: string;
  category?: string;
  breed?: string;
  dateOfBirth?: string;
  age?: number;
  imageUrl?: string;
  microchipId?: string;
  birthmarks?: string;
  medicalRecordCount?: number;
  lastUpdated?: string;
  owner?: {
    name?: string;
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
  onTransfer?: (petData: ScannedPetData) => void;
}

export default function ScannedPetViewer({ data, onClose, onDelete, onTransfer }: ScannedPetViewerProps) {
  const categoryColors = {
    dog: "bg-blue-100 text-blue-800",
    cat: "bg-purple-100 text-purple-800", 
    bird: "bg-yellow-100 text-yellow-800",
    rabbit: "bg-pink-100 text-pink-800",
    horse: "bg-green-100 text-green-800",
    exotic: "bg-orange-100 text-orange-800",
    other: "bg-gray-100 text-gray-800"
  };

  // Fetch complete pet profile with owner information
  const { data: petProfile, isLoading: loadingProfile } = useQuery({
    queryKey: [`/api/pets/public/${data.petId}`],
    queryFn: async () => {
      const response = await fetch(`/api/pets/public/${data.petId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch pet profile');
      }
      return response.json();
    },
    enabled: !!data.petId && data.type === 'pet_profile',
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Use fetched profile data if available, otherwise fall back to scanned data
  const currentData = petProfile?.pet || petProfile || data.pet || data;
  const petName = currentData.petName || currentData.name || 'Unknown Pet';
  const petCategory = currentData.category || 'other';
  
  console.log('=== ScannedPetViewer Debug ===');
  console.log('Raw data:', data);
  console.log('Pet profile from API:', petProfile);
  console.log('Current data being used:', currentData);
  console.log('Pet name:', petName);
  console.log('Pet category:', petCategory);
  console.log('Has onTransfer prop:', !!onTransfer);
  console.log('==============================');

  // Fetch medical records for the scanned pet
  const { data: medicalRecords, isLoading: loadingRecords } = useQuery({
    queryKey: [`/api/pets/public/${data.petId}/medical-records`],
    queryFn: async () => {
      const response = await fetch(`/api/pets/public/${data.petId}/medical-records`);
      if (!response.ok) {
        throw new Error('Failed to fetch medical records');
      }
      return response.json();
    },
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

  if (loadingProfile) {
    return (
      <Dialog open={true} onOpenChange={onClose}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Loading Pet Profile...</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center p-2 z-50 overflow-y-auto">
      <Card className="w-full max-w-2xl min-h-fit my-4 mx-2">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center text-lg">
              <QrCode className="w-5 h-5 mr-2" />
              Pet Profile
            </CardTitle>
            <div className="flex items-center space-x-2">
              {onTransfer && (
                <Button 
                  variant="default" 
                  size="sm" 
                  onClick={() => onTransfer(data)}
                  className="touch-manipulation bg-blue-600 hover:bg-blue-700 text-white"
                  style={{ fontSize: '16px' }}
                >
                  <Heart className="w-4 h-4 mr-1" />
                  Add to My Pets
                </Button>
              )}
              {onDelete && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onDelete(data)}
                  className="touch-manipulation"
                  style={{ fontSize: '16px' }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="touch-manipulation"
                style={{ fontSize: '16px' }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            {currentData.imageUrl ? (
              <img
                src={currentData.imageUrl}
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
            
            {/* Debug info */}
            <div className="mt-2 text-xs text-gray-500 border p-2 rounded">
              <div>Data type: {data.type}</div>
              <div>Pet ID: {data.petId}</div>
              <div>Has owner: {!!currentData.owner}</div>
              <div>Has breed: {!!currentData.breed}</div>
            </div>
          </div>

          {/* Pet Details */}
          <div className="space-y-3">
            <div className="border-t pt-3">
              <h4 className="font-medium text-gray-900 mb-2">Pet Information</h4>
              <div className="space-y-2 text-sm">
                {currentData.breed && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Breed:</span>
                    <span className="font-medium">{currentData.breed}</span>
                  </div>
                )}
                {currentData.age && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{currentData.age} months</span>
                  </div>
                )}
                {currentData.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Born:</span>
                    <span className="font-medium">
                      {format(new Date(currentData.dateOfBirth), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                {currentData.microchipId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Microchip:</span>
                    <span className="font-medium font-mono text-xs">{currentData.microchipId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Medical Records:</span>
                  <span className="font-medium">{medicalRecords?.length || currentData.medicalRecordCount || 0}</span>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            {currentData.owner && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <User className="w-4 h-4 mr-1" />
                  Owner Information
                </h4>
                <div className="space-y-2 text-sm">
                  {currentData.owner.name && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{currentData.owner.name}</span>
                    </div>
                  )}
                  {currentData.owner.phone && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone:</span>
                      <a href={`tel:${currentData.owner.phone}`} className="font-medium text-blue-600 hover:underline flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {currentData.owner.phone}
                      </a>
                    </div>
                  )}
                  {currentData.owner.email && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Email:</span>
                      <a href={`mailto:${currentData.owner.email}`} className="font-medium text-blue-600 hover:underline flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {currentData.owner.email}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Emergency Contact */}
            {(currentData.owner?.emergencyContact || currentData.owner?.emergencyPhone) && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
                  Emergency Contact
                </h4>
                <div className="space-y-2 text-sm">
                  {currentData.owner.emergencyContact && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{currentData.owner.emergencyContact}</span>
                    </div>
                  )}
                  {currentData.owner.emergencyPhone && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone:</span>
                      <a href={`tel:${currentData.owner.emergencyPhone}`} className="font-medium text-red-600 hover:underline flex items-center">
                        <Phone className="w-3 h-3 mr-1" />
                        {currentData.owner.emergencyPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Additional Information */}
            {currentData.birthmarks && (
              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-900 mb-2">Additional Information</h4>
                <div className="text-sm">
                  <span className="text-gray-600 block">Birthmarks/Notes:</span>
                  <span className="font-medium">{currentData.birthmarks}</span>
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
                {(loadingRecords || loadingProfile) ? (
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