import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, User, Phone, Mail, MapPin, Heart, Calendar } from "lucide-react";

interface ScannedPetData {
  type: string;
  petId: string;
  name: string;
  category: string;
  breed: string;
  age?: number;
  owner: string;
  contact?: string;
  email?: string;
  address?: string;
  medicalNotes?: string;
  emergencyContact?: string;
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
            <h3 className="text-xl font-bold text-gray-800">{data.name}</h3>
            <div className="flex justify-center space-x-2">
              <Badge className={categoryColors[data.category as keyof typeof categoryColors]}>
                {data.category.charAt(0).toUpperCase() + data.category.slice(1)}
              </Badge>
              {data.breed && (
                <Badge variant="outline">{data.breed}</Badge>
              )}
            </div>
            {data.age && (
              <div className="flex items-center justify-center text-sm text-gray-600">
                <Calendar className="w-4 h-4 mr-1" />
                {Math.floor(data.age / 12)} years {data.age % 12} months
              </div>
            )}
          </div>

          {/* Owner Info */}
          <div className="border-t pt-4 space-y-3">
            <h4 className="font-semibold text-gray-700 flex items-center">
              <User className="w-4 h-4 mr-2" />
              Owner Information
            </h4>
            
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <span className="font-medium min-w-16">Name:</span>
                <span className="text-gray-600">{data.owner}</span>
              </div>
              
              {data.contact && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-green-600" />
                  <span className="font-medium min-w-16">Phone:</span>
                  <a href={`tel:${data.contact}`} className="text-blue-600 hover:underline">
                    {data.contact}
                  </a>
                </div>
              )}
              
              {data.email && (
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-blue-600" />
                  <span className="font-medium min-w-16">Email:</span>
                  <a href={`mailto:${data.email}`} className="text-blue-600 hover:underline">
                    {data.email}
                  </a>
                </div>
              )}
              
              {data.address && (
                <div className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 mt-0.5 text-red-600" />
                  <span className="font-medium min-w-16">Address:</span>
                  <span className="text-gray-600 text-xs">{data.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Medical Notes */}
          {data.medicalNotes && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Medical Notes</h4>
              <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg">
                {data.medicalNotes}
              </p>
            </div>
          )}

          {/* Emergency Contact */}
          {data.emergencyContact && (
            <div className="border-t pt-4">
              <h4 className="font-semibold text-gray-700 mb-2">Emergency Contact</h4>
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2 text-red-600" />
                <a href={`tel:${data.emergencyContact}`} className="text-red-600 hover:underline font-medium">
                  {data.emergencyContact}
                </a>
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