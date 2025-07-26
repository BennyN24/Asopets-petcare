import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MapPin, Phone, Clock, Star, Navigation, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { VetClinic } from "@shared/schema";

interface VetClinicMapProps {
  clinics: VetClinic[];
  userLocation?: { latitude: number; longitude: number };
  onClose: () => void;
}

export default function VetClinicMap({ clinics, userLocation, onClose }: VetClinicMapProps) {
  const [selectedClinic, setSelectedClinic] = useState<VetClinic | null>(null);
  const [nearestClinic, setNearestClinic] = useState<VetClinic | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (userLocation && clinics.length > 0) {
      // Find the nearest clinic
      let closest = clinics[0];
      let minDistance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        parseFloat(closest.latitude || '0'),
        parseFloat(closest.longitude || '0')
      );

      clinics.forEach(clinic => {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          parseFloat(clinic.latitude || '0'),
          parseFloat(clinic.longitude || '0')
        );
        if (distance < minDistance) {
          minDistance = distance;
          closest = clinic;
        }
      });

      setNearestClinic(closest);
    }
  }, [userLocation, clinics]);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const getDirections = (clinic: VetClinic) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const formatDistance = (clinic: VetClinic): string => {
    if (!userLocation) return '';
    const distance = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      parseFloat(clinic.latitude || '0'),
      parseFloat(clinic.longitude || '0')
    );
    return `${distance.toFixed(1)} km away`;
  };

  const getClinicTypeColor = (type: string): string => {
    switch (type.toLowerCase()) {
      case 'emergency': return 'bg-red-100 text-red-800';
      case '24hour': return 'bg-blue-100 text-blue-800';
      case 'specialty': return 'bg-purple-100 text-purple-800';
      case 'general': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-10">
      <div className="bg-white rounded-lg m-4 max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-semibold">Veterinary Clinics Near You</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="flex flex-col lg:flex-row h-[70vh]">
          {/* Map Area - Placeholder for now */}
          <div className="flex-1 bg-gray-100 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <MapPin className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Interactive Map</h3>
                <p className="text-gray-500 mb-4">Map integration coming soon</p>
                <p className="text-sm text-gray-400">
                  For now, use the "Get Directions" button to open in Google Maps
                </p>
              </div>
            </div>
            
            {/* Clinic markers overlay */}
            <div className="absolute top-4 left-4 right-4">
              {nearestClinic && (
                <Card className="bg-white/95 backdrop-blur-sm border-green-200">
                  <CardContent className="p-3">
                    <div className="flex items-center space-x-2">
                      <Badge className="bg-green-100 text-green-800">Nearest</Badge>
                      <span className="font-medium text-sm">{nearestClinic.name}</span>
                      <span className="text-xs text-gray-500">{formatDistance(nearestClinic)}</span>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          
          {/* Clinic List */}
          <div className="w-full lg:w-96 border-l bg-white overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold mb-4">Available Clinics ({clinics.length})</h3>
              
              <div className="space-y-3">
                {clinics.map((clinic) => (
                  <Card 
                    key={clinic.id} 
                    className={`cursor-pointer transition-all ${
                      selectedClinic?.id === clinic.id ? 'ring-2 ring-primary' : 'hover:shadow-md'
                    }`}
                    onClick={() => setSelectedClinic(clinic)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm">{clinic.name}</h4>
                          {nearestClinic?.id === clinic.id && (
                            <Badge className="bg-green-100 text-green-800 text-xs">Nearest</Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${getClinicTypeColor((clinic as any).type || 'general')}`}>
                            {(clinic as any).type || 'General'}
                          </Badge>
                          {userLocation && (
                            <span className="text-xs text-gray-500">{formatDistance(clinic)}</span>
                          )}
                        </div>
                        
                        <div className="flex items-center text-xs text-gray-600">
                          <MapPin className="w-3 h-3 mr-1" />
                          <span className="truncate">{clinic.address}</span>
                        </div>
                        
                        {clinic.phone && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Phone className="w-3 h-3 mr-1" />
                            <span>{clinic.phone}</span>
                          </div>
                        )}
                        
                        {(clinic as any).hours && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>{(clinic as any).hours}</span>
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-gray-600">
                              {clinic.averageRating ? Number(clinic.averageRating).toFixed(1) : 'No ratings'}
                            </span>
                          </div>
                          
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              getDirections(clinic);
                            }}
                            className="text-xs px-2 py-1 h-6"
                          >
                            <Navigation className="w-3 h-3 mr-1" />
                            Directions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Selected Clinic Details */}
        {selectedClinic && (
          <div className="border-t p-4 bg-gray-50">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">{selectedClinic.name}</h3>
              <Button
                size="sm"
                onClick={() => getDirections(selectedClinic)}
                className="bg-primary text-white"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="font-medium text-gray-600">Address</p>
                <p>{selectedClinic.address}</p>
              </div>
              
              {selectedClinic.phone && (
                <div>
                  <p className="font-medium text-gray-600">Phone</p>
                  <p>{selectedClinic.phone}</p>
                </div>
              )}
              
              {(selectedClinic as any).hours && (
                <div>
                  <p className="font-medium text-gray-600">Hours</p>
                  <p>{(selectedClinic as any).hours}</p>
                </div>
              )}
            </div>
            
            {(selectedClinic as any).description && (
              <div className="mt-3">
                <p className="font-medium text-gray-600 mb-1">About</p>
                <p className="text-sm text-gray-700">{(selectedClinic as any).description}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}