import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, User, Phone, Mail, MapPin, Heart, Calendar, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

interface ScannedPetData {
  type: string;
  pet: {
    id: number;
    name: string;
    category: string;
    breed?: string;
    age?: number;
    dateOfBirth?: string;
    imageUrl?: string;
    microchipId?: string;
    medicalConditions?: string;
    allergies?: string;
  };
  owner: {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" />
              Pet Profile
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Pet Info */}
          <div className="text-center space-y-2">
            {data.pet.imageUrl && (
              <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-200">
                <img 
                  src={data.pet.imageUrl} 
                  alt={data.pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-800">{data.pet.name}</h3>
            <div className="flex justify-center space-x-2">
              <Badge className={categoryColors[data.pet.category as keyof typeof categoryColors]}>
                {data.pet.category.charAt(0).toUpperCase() + data.pet.category.slice(1)}
              </Badge>
              {data.pet.breed && (
                <Badge variant="outline">{data.pet.breed}</Badge>
              )}
            </div>
            {data.pet.age && (
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {Math.floor(data.pet.age / 12)} years {data.pet.age % 12} months
              </div>
            )}
            {data.pet.dateOfBirth && (
              <div className="text-sm text-gray-500">
                Born: {format(new Date(data.pet.dateOfBirth), "MMM dd, yyyy")}
              </div>
            )}
          </div>

          {/* Medical Information */}
          {(data.pet.medicalConditions || data.pet.allergies || data.pet.microchipId) && (
            <div className="border-t pt-4 space-y-3">
              <h4 className="font-semibold text-gray-700 flex items-center">
                <Heart className="w-4 h-4 mr-2 text-red-500" />
                Medical Information
              </h4>
              
              {data.pet.microchipId && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Microchip ID:</span>
                  <span className="ml-2 text-gray-900 font-mono">{data.pet.microchipId}</span>
                </div>
              )}
              
              {data.pet.medicalConditions && (
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">Medical Conditions</span>
                  </div>
                  <p className="text-sm text-yellow-700">{data.pet.medicalConditions}</p>
                </div>
              )}
              
              {data.pet.allergies && (
                <div className="bg-red-50 p-3 rounded-lg">
                  <div className="flex items-center mb-1">
                    <AlertTriangle className="w-4 h-4 text-red-600 mr-2" />
                    <span className="font-medium text-red-800">Allergies</span>
                  </div>
                  <p className="text-sm text-red-700 font-medium">{data.pet.allergies}</p>
                </div>
              )}
            </div>
          )}

          {/* Owner Info */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Owner Information
            </h4>
            
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-900">{data.owner.name}</span>
              </div>
              
              {data.owner.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
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