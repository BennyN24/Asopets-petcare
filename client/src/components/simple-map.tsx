import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Star, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { VetClinic } from "@shared/schema";

interface SimpleMapProps {
  clinics: VetClinic[];
  userLocation: { lat: number; lng: number } | null;
  onClinicSelect?: (clinic: VetClinic) => void;
  className?: string;
}

export default function SimpleMap({ clinics, userLocation, onClinicSelect, className }: SimpleMapProps) {
  const { toast } = useToast();

  const calculateDistance = (clinic: VetClinic): string => {
    if (!userLocation || !clinic.latitude || !clinic.longitude) return '';
    
    const R = 6371; // Earth's radius in km
    const dLat = (parseFloat(clinic.latitude) - userLocation.lat) * Math.PI / 180;
    const dLng = (parseFloat(clinic.longitude) - userLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.lat * Math.PI / 180) * Math.cos(parseFloat(clinic.latitude) * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    return `${distance.toFixed(1)} km`;
  };

  const getDirections = (clinic: VetClinic) => {
    if (!clinic.latitude || !clinic.longitude) {
      toast({
        title: "Location Error",
        description: "GPS coordinates not available for this clinic",
        variant: "destructive",
      });
      return;
    }

    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const openInGoogleMaps = (clinic: VetClinic) => {
    if (!clinic.latitude || !clinic.longitude) {
      toast({
        title: "Location Error",
        description: "GPS coordinates not available for this clinic",
        variant: "destructive",
      });
      return;
    }

    const url = `https://www.google.com/maps/place/${clinic.latitude},${clinic.longitude}`;
    window.open(url, '_blank');
  };

  // Sort clinics by distance if user location is available
  const sortedClinics = React.useMemo(() => {
    if (!userLocation) return clinics;
    
    return [...clinics].sort((a, b) => {
      const distA = calculateDistance(a);
      const distB = calculateDistance(b);
      return parseFloat(distA) - parseFloat(distB);
    });
  }, [clinics, userLocation]);

  return (
    <div className={`${className} space-y-4`}>
      {userLocation && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 text-blue-800">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">
              Your location: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {sortedClinics.map((clinic, index) => (
          <Card key={clinic.id || index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{clinic.name}</h3>
                    {(clinic as any).isGooglePlace && (
                      <Badge variant="secondary" className="text-xs">
                        Google Places
                      </Badge>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{clinic.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      {clinic.averageRating && (
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                          <span>{clinic.averageRating}</span>
                        </div>
                      )}
                      
                      {userLocation && clinic.latitude && clinic.longitude && (
                        <Badge variant="outline" className="text-xs">
                          {calculateDistance(clinic)} away
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => getDirections(clinic)}
                    className="text-xs"
                  >
                    <Navigation className="w-3 h-3 mr-1" />
                    Directions
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => openInGoogleMaps(clinic)}
                    className="text-xs"
                  >
                    <ExternalLink className="w-3 h-3 mr-1" />
                    View on Map
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onClinicSelect?.(clinic)}
                    className="text-xs text-primary"
                  >
                    Details
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {clinics.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <MapPin className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>No veterinary clinics found in your area.</p>
          <p className="text-sm">Try expanding your search radius.</p>
        </div>
      )}
    </div>
  );
}