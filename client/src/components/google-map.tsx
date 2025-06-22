import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Navigation, Phone, Star, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { VetClinic } from "@shared/schema";
import { GooglePlacesService, type PlaceResult } from "@/utils/google-places";

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

interface GoogleMapProps {
  clinics: VetClinic[];
  userLocation: { lat: number; lng: number } | null;
  onClinicSelect?: (clinic: VetClinic) => void;
  onNearbyPlacesFound?: (places: PlaceResult[]) => void;
  onMapLoaded?: (loaded: boolean) => void;
  className?: string;
}

export default function GoogleMap({ clinics, userLocation, onClinicSelect, onNearbyPlacesFound, onMapLoaded, className }: GoogleMapProps) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const [map, setMap] = React.useState<any>(null);
  const [selectedClinic, setSelectedClinic] = React.useState<VetClinic | null>(null);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const { toast } = useToast();

  // Load Google Maps API
  React.useEffect(() => {
    if (window.google) {
      console.log("Google Maps already loaded");
      setIsLoaded(true);
      return;
    }

    // Fetch API key from server endpoint
    const loadGoogleMaps = async () => {
      try {
        console.log("Fetching Google Maps configuration...");
        const response = await fetch('/api/google-maps-config');
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Google Maps config response:", data);
        
        if (!data.apiKey) {
          console.error("Google Maps API key not available from server");
          toast({
            title: "Configuration Error", 
            description: "Google Maps API key not configured. Using fallback map view.",
            variant: "destructive",
          });
          return;
        }

        console.log("Loading Google Maps with API key:", data.apiKey.substring(0, 10) + "...");
        
        // Check if script already exists
        const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
        if (existingScript) {
          console.log("Google Maps script already exists, removing...");
          existingScript.remove();
        }
        
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${data.apiKey}&libraries=places&callback=initMap`;
        script.async = true;
        script.defer = true;
        
        // Global callback for Google Maps
        window.initMap = () => {
          console.log("Google Maps initialized via callback");
          setIsLoaded(true);
          onMapLoaded?.(true);
        };
        
        script.onerror = (error) => {
          console.error("Failed to load Google Maps API:", error);
          toast({
            title: "Map Loading Error",
            description: "Failed to load Google Maps. Check API key and quotas.",
            variant: "destructive",
          });
        };
        
        // Set a timeout for loading
        const loadTimeout = setTimeout(() => {
          if (!window.google) {
            console.warn("Google Maps loading timeout");
            toast({
              title: "Map Loading Timeout",
              description: "Google Maps is taking too long to load. Try refreshing.",
              variant: "destructive",
            });
          }
        }, 10000);
        
        script.onload = () => {
          clearTimeout(loadTimeout);
          if (window.google) {
            console.log("Google Maps script loaded successfully");
            // The callback will handle setting isLoaded
          }
        };
        
        document.head.appendChild(script);
        console.log("Google Maps script added to document");
        
      } catch (error) {
        console.error("Error fetching Google Maps config:", error);
        toast({
          title: "Configuration Error",
          description: "Unable to load Google Maps. Using fallback view.",
          variant: "destructive",
        });
      }
    };

    loadGoogleMaps();
  }, [toast]);

  // Initialize map
  React.useEffect(() => {
    if (!isLoaded || !mapRef.current || !userLocation) {
      console.log("Map initialization skipped:", { isLoaded, hasMapRef: !!mapRef.current, userLocation });
      return;
    }

    console.log("Initializing Google Map at location:", userLocation);

    try {
      const mapInstance = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 13,
        styles: [
          {
            featureType: "poi.medical",
            elementType: "geometry",
            stylers: [{ color: "#ff6b6b" }]
          }
        ]
      });

      setMap(mapInstance);
      console.log("Map instance created successfully");

      // Initialize Google Places service
      const placesService = GooglePlacesService.getInstance();
      placesService.initialize(mapInstance);

      // Search for nearby vet clinics using Google Places
      if (onNearbyPlacesFound) {
        placesService.searchNearbyVetClinics(userLocation, 25000)
          .then(places => {
            console.log("Found nearby vet clinics from Google Places:", places);
            onNearbyPlacesFound(places);
          })
          .catch(error => {
            console.log("Google Places search error:", error);
          });
      }

      // Add user location marker
      const userMarker = new window.google.maps.Marker({
        position: userLocation,
        map: mapInstance,
        title: "Your Location",
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#ffffff" stroke-width="2"/>
              <circle cx="12" cy="12" r="3" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(24, 24),
        }
      });

      console.log("User location marker added");
    } catch (error) {
      console.error("Error initializing Google Map:", error);
      toast({
        title: "Map Error",
        description: "Failed to initialize map. Please try again.",
        variant: "destructive",
      });
    }
  }, [isLoaded, userLocation, onNearbyPlacesFound, toast]);

  // Add clinic markers
  React.useEffect(() => {
    if (!map || !clinics.length) {
      console.log("Clinic markers skipped:", { hasMap: !!map, clinicsCount: clinics.length });
      return;
    }

    console.log("Adding clinic markers for", clinics.length, "clinics");

    const bounds = new window.google.maps.LatLngBounds();
    if (userLocation) {
      bounds.extend(userLocation);
    }

    let validClinicCount = 0;

    clinics.forEach((clinic, index) => {
      if (!clinic.latitude || !clinic.longitude) {
        console.log(`Clinic ${index} missing coordinates:`, clinic.name);
        return;
      }

      const position = {
        lat: parseFloat(clinic.latitude),
        lng: parseFloat(clinic.longitude)
      };

      console.log(`Adding marker for ${clinic.name} at:`, position);

      const marker = new window.google.maps.Marker({
        position,
        map,
        title: clinic.name,
        icon: {
          url: "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(`
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#ef4444" stroke="#ffffff" stroke-width="1"/>
              <circle cx="12" cy="9" r="2.5" fill="#ffffff"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(32, 32),
        }
      });

      bounds.extend(position);
      validClinicCount++;

      marker.addListener('click', () => {
        console.log("Clinic marker clicked:", clinic.name);
        setSelectedClinic(clinic);
        onClinicSelect?.(clinic);
      });
    });

    if (validClinicCount > 0) {
      console.log("Fitting bounds for", validClinicCount, "valid clinics");
      map.fitBounds(bounds);
      const zoom = map.getZoom();
      if (zoom > 15) map.setZoom(15);
    }
  }, [map, clinics, userLocation, onClinicSelect]);

  const getDirections = (clinic: VetClinic) => {
    if (!userLocation || !clinic.latitude || !clinic.longitude) {
      toast({
        title: "Location Error",
        description: "Cannot get directions without location data.",
        variant: "destructive",
      });
      return;
    }

    const url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${clinic.latitude},${clinic.longitude}`;
    window.open(url, '_blank');
  };

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

  if (!isLoaded) {
    return (
      <div className={`${className} flex items-center justify-center bg-gray-100 rounded-lg`}>
        <div className="text-center p-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Google Maps...</p>
          <p className="text-xs text-gray-500 mt-2">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapRef} className="w-full h-full rounded-lg" />
      
      {selectedClinic && (
        <Card className="absolute bottom-4 left-4 right-4 z-10 shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">{selectedClinic.name}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedClinic(null)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{selectedClinic.address}</span>
                  </div>
                  
                  {selectedClinic.phone && (
                    <div className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      <a href={`tel:${selectedClinic.phone}`} className="hover:text-primary">
                        {selectedClinic.phone}
                      </a>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{selectedClinic.averageRating || 'No rating'}</span>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {calculateDistance(selectedClinic)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => getDirections(selectedClinic)}
                size="sm"
                className="ml-2"
              >
                <Navigation className="w-4 h-4 mr-1" />
                Directions
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}