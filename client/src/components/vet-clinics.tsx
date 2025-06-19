import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertClinicRatingSchema, type VetClinic, type InsertClinicRating } from "@shared/schema";
import { MapPin, Phone, Mail, Star, Plus, Stethoscope, User, Calendar } from "lucide-react";

interface VetClinicsProps {
  onRatingAdded?: (clinicId: number, medicalRecordId?: number) => void;
  medicalRecordId?: number;
}

interface ClinicReviewsProps {
  clinicId: number;
}

function ClinicReviews({ clinicId }: ClinicReviewsProps) {
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["/api/vet-clinics", clinicId, "ratings"],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/vet-clinics/${clinicId}/ratings`);
      return await response.json();
    },
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="mt-4 p-4 border-t">
        <div className="flex justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="mt-4 p-4 border-t text-center text-gray-500">
        <p className="text-sm">No reviews yet. Be the first to share your experience!</p>
      </div>
    );
  }

  return (
    <div className="mt-4 border-t pt-4">
      <h4 className="font-semibold text-gray-900 mb-3">User Reviews</h4>
      <div className="space-y-4 max-h-64 overflow-y-auto">
        {reviews.map((review: any) => (
          <div key={review.id} className="bg-gray-50 p-3 rounded-lg">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center mr-3">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">
                    {review.userName || review.userLastName 
                      ? `${review.userName || ''} ${review.userLastName || ''}`.trim()
                      : 'Anonymous'
                    }
                  </p>
                  <div className="flex items-center">
                    {renderStars(review.rating)}
                    <span className="ml-2 text-xs text-gray-500">
                      {review.rating}/5
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(review.createdAt)}
              </div>
            </div>
            {review.review && (
              <p className="text-sm text-gray-700 ml-11">{review.review}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VetClinics({ onRatingAdded, medicalRecordId }: VetClinicsProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedClinic, setSelectedClinic] = React.useState<VetClinic | null>(null);
  const [showRatingForm, setShowRatingForm] = React.useState(false);
  const [showReviews, setShowReviews] = React.useState<{ [key: number]: boolean }>({});
  const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Get user location
  React.useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Location access denied, will show all clinics
          setUserLocation(null);
        }
      );
    }
  }, []);

  // Fetch vet clinics
  const { data: clinics = [], isLoading } = useQuery({
    queryKey: ["/api/vet-clinics", userLocation?.lat, userLocation?.lng],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (userLocation) {
        params.append("lat", userLocation.lat.toString());
        params.append("lng", userLocation.lng.toString());
        params.append("radius", "25"); // 25km radius
      }
      const response = await apiRequest("GET", `/api/vet-clinics?${params.toString()}`);
      return await response.json() as VetClinic[];
    },
  });



  const ratingForm = useForm<InsertClinicRating>({
    resolver: zodResolver(insertClinicRatingSchema.omit({ userId: true })),
    defaultValues: {
      clinicId: 0,
      rating: 5,
      review: "",
      medicalRecordId: medicalRecordId || undefined,
    },
  });

  const createRatingMutation = useMutation({
    mutationFn: async (data: Omit<InsertClinicRating, 'userId'>) => {
      await apiRequest("POST", "/api/clinic-ratings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vet-clinics"] });
      queryClient.invalidateQueries({ queryKey: [`/api/vet-clinics/${selectedClinic?.id}/ratings`] });
      toast({
        title: "Rating submitted",
        description: "Thank you for your feedback!",
      });
      setShowRatingForm(false);
      setSelectedClinic(null);
      if (onRatingAdded && selectedClinic) {
        onRatingAdded(selectedClinic.id, medicalRecordId);
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleRateClinic = (clinic: VetClinic) => {
    setSelectedClinic(clinic);
    ratingForm.setValue("clinicId", clinic.id);
    setShowRatingForm(true);
  };

  const toggleReviews = (clinicId: number) => {
    setShowReviews(prev => ({
      ...prev,
      [clinicId]: !prev[clinicId]
    }));
  };

  const onSubmitRating = (data: InsertClinicRating) => {
    createRatingMutation.mutate(data);
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
    if (!userLocation || !clinic.latitude || !clinic.longitude) return "";
    
    const distance = calculateDistance(
      userLocation.lat,
      userLocation.lng,
      parseFloat(clinic.latitude),
      parseFloat(clinic.longitude)
    );
    
    return distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`;
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const toRadians = (degrees: number): number => {
    return degrees * (Math.PI/180);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <Stethoscope className="w-4 h-4 mr-2" />
            Find Vet Clinics
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Local Veterinary Clinics</DialogTitle>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex justify-center p-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {clinics.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Stethoscope className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No veterinary clinics found in your area.</p>
                  <p className="text-sm">Try expanding your search radius or check back later.</p>
                </div>
              ) : (
                clinics.map((clinic: VetClinic) => (
                  <Card key={clinic.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-lg">{clinic.name}</CardTitle>
                        <div className="flex flex-col items-end">
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
                        <MapPin className="w-4 h-4 mr-2 mt-0.5 text-gray-500" />
                        <div className="flex-1">
                          <p className="text-sm">{clinic.address}</p>
                          {formatDistance(clinic) && (
                            <Badge variant="secondary" className="mt-1 text-xs">
                              {formatDistance(clinic)} away
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      {clinic.phone && (
                        <div className="flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{clinic.phone}</span>
                        </div>
                      )}
                      
                      {clinic.email && (
                        <div className="flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-gray-500" />
                          <span className="text-sm">{clinic.email}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between pt-2 gap-2">
                        {(clinic.totalRatings || 0) > 0 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleReviews(clinic.id)}
                          >
                            {showReviews[clinic.id] ? 'Hide Reviews' : 'View Reviews'}
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRateClinic(clinic)}
                        >
                          <Star className="w-4 h-4 mr-1" />
                          Rate Clinic
                        </Button>
                      </div>

                      {/* Reviews Section */}
                      {showReviews[clinic.id] && <ClinicReviews clinicId={clinic.id} />}
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Rating Form Dialog */}
      <Dialog open={showRatingForm} onOpenChange={setShowRatingForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rate {selectedClinic?.name}</DialogTitle>
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
                            className="focus:outline-none"
                          >
                            <Star
                              className={`w-6 h-6 ${
                                star <= field.value
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300 hover:text-yellow-200"
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          {field.value} star{field.value !== 1 ? 's' : ''}
                        </span>
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
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowRatingForm(false)}
                  disabled={createRatingMutation.isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createRatingMutation.isPending}
                >
                  {createRatingMutation.isPending ? "Submitting..." : "Submit Rating"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}