import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, MapPin, Phone, Mail, Star, Stethoscope, RefreshCw, Map, Navigation } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import GoogleMap from "@/components/google-map";
import SimpleMap from "@/components/simple-map";

import ClinicReviews from "@/components/clinic-reviews";
import type { VetClinic, InsertClinicRating } from "@shared/schema";

const ratingSchema = z.object({
  rating: z.number().min(1).max(5),
  review: z.string().optional(),
});

export default function VetClinicsPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [showMap, setShowMap] = useState(false);
  const [useGoogleMaps, setUseGoogleMaps] = useState(true);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);

  const [selectedClinic, setSelectedClinic] = useState<VetClinic | null>(null);
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [showReviews, setShowReviews] = useState<Record<number, boolean>>({});
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch vet clinics
  const { data: clinics = [], isLoading, refetch } = useQuery<VetClinic[]>({
    queryKey: ["/api/vet-clinics"],
  });

  // Rating form
  const ratingForm = useForm<z.infer<typeof ratingSchema>>({
    resolver: zodResolver(ratingSchema),
    defaultValues: {
      rating: 5,
      review: "",
    },
  });

  // Create rating mutation
  const createRatingMutation = useMutation({
    mutationFn: async (data: InsertClinicRating) => {
      return await apiRequest("POST", "/api/clinic-ratings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vet-clinics"] });
      setShowRatingForm(false);
      ratingForm.reset();
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit rating",
        variant: "destructive",
      });
    },
  });

  // Get user location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.log("Geolocation error:", error);
          // Default to Manila coordinates
          setUserLocation({
            lat: 14.5995,
            lng: 120.9842,
          });
        },
        { enableHighAccuracy: true }
      );
    } else {
      // Default to Manila coordinates
      setUserLocation({
        lat: 14.5995,
        lng: 120.9842,
      });
    }
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleRateClinic = (clinic: VetClinic) => {
    setSelectedClinic(clinic);
    setShowRatingForm(true);
  };

  const onSubmitRating = (data: z.infer<typeof ratingSchema>) => {
    if (!selectedClinic) return;
    
    createRatingMutation.mutate({
      clinicId: selectedClinic.id,
      rating: data.rating,
      review: data.review || null,
    });
  };

  const toggleReviews = (clinicId: number) => {
    setShowReviews(prev => ({
      ...prev,
      [clinicId]: !prev[clinicId]
    }));
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDistance = (clinic: VetClinic) => {
    if (!userLocation || !clinic.latitude || !clinic.longitude) return null;
    
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      clinic.latitude,
      clinic.longitude
    );
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI / 180);
  };

  const getDirections = (clinic: VetClinic) => {
    if (!clinic.latitude || !clinic.longitude) return;
    
    const url = `https://www.google.com/maps/dir/?api=1&destination=${clinic.latitude},${clinic.longitude}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocation("/")}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Vet Clinics</h1>
              <p className="text-sm text-gray-500">{clinics.length} clinics found</p>
            </div>
          </div>
          
          {/* Mobile Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-3"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
            <Button
              variant={showMap ? "default" : "outline"}
              size="sm"
              onClick={() => setShowMap(!showMap)}
              className="px-3"
            >
              <Map className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* Secondary Controls (only show when map is active) */}
        {showMap && (
          <div className="px-4 pb-3 flex gap-2 overflow-x-auto">
            <Button
              variant={useGoogleMaps ? "default" : "outline"}
              size="sm"
              onClick={() => setUseGoogleMaps(!useGoogleMaps)}
              className="flex-shrink-0"
            >
              {useGoogleMaps ? "Simple Map" : "Google Maps"}
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : showMap ? (
          <div className="space-y-4">
            <div className="h-80 md:h-96 rounded-lg overflow-hidden border">
              {useGoogleMaps ? (
                <GoogleMap
                  clinics={clinics}
                  userLocation={userLocation}
                  onClinicSelect={setSelectedClinic}
                  onNearbyPlacesFound={(places) => {
                    console.log("Google Places found:", places.length, "nearby clinics");
                  }}
                  onMapLoaded={setGoogleMapsLoaded}
                  className="h-full"
                />
              ) : (
                <SimpleMap
                  clinics={clinics}
                  userLocation={userLocation}
                  onClinicSelect={setSelectedClinic}
                  className="h-full"
                />
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {clinics.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Stethoscope className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No veterinary clinics found</h3>
                <p className="text-sm">Try expanding your search radius or check back later.</p>
              </div>
            ) : (
              clinics.map((clinic: VetClinic) => (
                <Card key={clinic.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start gap-3">
                      <CardTitle className="text-lg leading-tight">{clinic.name}</CardTitle>
                      <div className="flex flex-col items-end flex-shrink-0">
                        <div className="flex items-center mb-1">
                          {renderStars(Math.round(parseFloat(clinic.averageRating || "0")))}
                          <span className="ml-2 text-sm text-gray-600">
                            {parseFloat(clinic.averageRating || "0").toFixed(1)}
                          </span>
                        </div>
                        {(clinic.totalRatings || 0) > 0 && (
                          <span className="text-xs text-gray-500">
                            {clinic.totalRatings} review{clinic.totalRatings !== 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 break-words">{clinic.address}</p>
                        {formatDistance(clinic) && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {formatDistance(clinic)} away
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    {clinic.phone && (
                      <div className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                        <a href={`tel:${clinic.phone}`} className="text-sm text-blue-600 hover:underline">
                          {clinic.phone}
                        </a>
                      </div>
                    )}
                    
                    {clinic.email && (
                      <div className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-gray-500 flex-shrink-0" />
                        <a href={`mailto:${clinic.email}`} className="text-sm text-blue-600 hover:underline break-all">
                          {clinic.email}
                        </a>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 pt-2">
                      {clinic.latitude && clinic.longitude && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => getDirections(clinic)}
                          className="w-full"
                        >
                          <Navigation className="w-4 h-4 mr-2" />
                          Get Directions
                        </Button>
                      )}
                      
                      <div className="flex gap-2">
                        {(clinic.totalRatings || 0) > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReviews(clinic.id)}
                            className="flex-1"
                          >
                            {showReviews[clinic.id] ? 'Hide Reviews' : 'View Reviews'}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRateClinic(clinic)}
                          className="flex-1"
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Rate Clinic
                        </Button>
                      </div>
                    </div>

                    {/* Reviews Section */}
                    {showReviews[clinic.id] && (
                      <div className="pt-2 border-t">
                        <ClinicReviews clinicId={clinic.id} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Rating Form Dialog */}
      <Dialog open={showRatingForm} onOpenChange={setShowRatingForm}>
        <DialogContent className="mx-4 max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-lg">Rate {selectedClinic?.name}</DialogTitle>
          </DialogHeader>
          
          <Form {...ratingForm}>
            <form onSubmit={ratingForm.handleSubmit(onSubmitRating)} className="space-y-4">
              <FormField
                control={ratingForm.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-5 stars)</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => field.onChange(star)}
                            className="focus:outline-none p-1"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= field.value
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 hover:text-yellow-200"
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {field.value} star{field.value !== 1 ? 's' : ''}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={ratingForm.control}
                name="review"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Review (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Share your experience with this clinic..."
                        {...field}
                        value={field.value || ""}
                        className="min-h-20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRatingForm(false)}
                  disabled={createRatingMutation.isPending}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createRatingMutation.isPending}
                  className="flex-1"
                >
                  {createRatingMutation.isPending ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}