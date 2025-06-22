// Server-side Google Places API integration
import { Request, Response } from 'express';

interface GooglePlaceResult {
  name: string;
  vicinity: string;
  rating?: number;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  formatted_phone_number?: string;
}

export async function searchNearbyVetClinics(
  lat: number,
  lng: number,
  radius: number = 25000
): Promise<any[]> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    console.log("Google Places API key not available, returning empty results");
    return [];
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=veterinary_care&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.results) {
      return data.results.map((place: GooglePlaceResult) => ({
        name: place.name,
        address: place.vicinity,
        latitude: place.geometry.location.lat.toString(),
        longitude: place.geometry.location.lng.toString(),
        phone: place.formatted_phone_number || '',
        averageRating: place.rating?.toString() || '',
        totalRatings: 0,
        type: 'general',
        isGooglePlace: true,
        placeId: place.place_id
      }));
    } else {
      console.log("Google Places API error:", data.status, data.error_message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching from Google Places API:", error);
    return [];
  }
}

export async function getPlaceDetails(placeId: string): Promise<any> {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    return null;
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,formatted_address,formatted_phone_number,rating,opening_hours&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK' && data.result) {
      return data.result;
    } else {
      console.log("Google Places Details API error:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Error fetching place details:", error);
    return null;
  }
}