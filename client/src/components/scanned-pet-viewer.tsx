import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, User, Phone, Mail, MapPin, Heart, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

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

interface ScannedPetViewerProps {
  data: ScannedPetData;
  onClose: () => void;
}

export default function ScannedPetViewer({ data, onClose }: ScannedPetViewerProps) {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-primary" />
              Pet Profile
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
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

            {/* Scan Information */}
            <div className="border-t pt-3">
              <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                Scan Information
              </h4>
              <div className="text-sm text-gray-600">
                Scanned on {format(new Date(data.scannedAt), 'MMM dd, yyyy \'at\' h:mm a')}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
                  <span className="font-medium text-gray-700">Phone:</span>
                  <a href={`tel:${data.owner.phone}`} className="ml-2 text-blue-600 hover:underline">
                    {data.owner.phone}
                  </a>
                </div>
              )}
              
              {data.owner.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium text-gray-700">Email:</span>
                  <a href={`mailto:${data.owner.email}`} className="ml-2 text-blue-600 hover:underline">
                    {data.owner.email}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Emergency Contact */}
          {(data.owner.emergencyContact || data.owner.emergencyPhone) && (
            <div className="border-t pt-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <h4 className="font-semibold text-red-800 mb-2 flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  Emergency Contact
                </h4>
                {data.owner.emergencyContact && (
                  <p className="text-sm text-red-700 font-medium mb-1">
                    {data.owner.emergencyContact}
                  </p>
                )}
                {data.owner.emergencyPhone && (
                  <a href={`tel:${data.owner.emergencyPhone}`} className="text-red-600 hover:underline font-medium">
                    {data.owner.emergencyPhone}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="border-t pt-4 space-y-2">
            <Button className="w-full" onClick={onClose}>
              Close
            </Button>
            <p className="text-xs text-gray-500 text-center">
              This pet's information was shared via QR code
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}