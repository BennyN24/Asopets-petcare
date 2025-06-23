import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, User } from "lucide-react";
import { format } from "date-fns";
import type { ClinicRating } from "@shared/schema";

interface ClinicReviewsProps {
  clinicId: number;
}

export default function ClinicReviews({ clinicId }: ClinicReviewsProps) {
  const { data: reviews = [], isLoading } = useQuery<ClinicRating[]>({
    queryKey: [`/api/clinics/${clinicId}/ratings`],
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-200 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500">
        <p className="text-sm">No reviews yet</p>
        <p className="text-xs">Be the first to rate this clinic!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="font-medium text-gray-900 text-sm">Reviews</h4>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {reviews.map((review) => (
          <Card key={review.id} className="border-gray-200">
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">
                    Anonymous User
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(review.rating)}
                </div>
              </div>
              
              {review.review && (
                <p className="text-sm text-gray-600 mb-2">{review.review}</p>
              )}
              
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-xs">
                  {review.rating} star{review.rating !== 1 ? 's' : ''}
                </Badge>
                <span className="text-xs text-gray-400">
                  {format(new Date(review.createdAt), 'MMM d, yyyy')}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}