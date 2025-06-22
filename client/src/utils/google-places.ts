// Google Places utility functions
export interface PlaceResult {
  name: string;
  address: string;
  phone?: string;
  rating?: number;
  latitude: string;
  longitude: string;
  placeId: string;
  openingHours?: string[];
}

export class GooglePlacesService {
  private static instance: GooglePlacesService;
  private service: any = null;

  private constructor() {}

  static getInstance(): GooglePlacesService {
    if (!GooglePlacesService.instance) {
      GooglePlacesService.instance = new GooglePlacesService();
    }
    return GooglePlacesService.instance;
  }

  initialize(map: any): void {
    if (window.google && map) {
      this.service = new window.google.maps.places.PlacesService(map);
    }
  }

  async searchNearbyVetClinics(
    location: { lat: number; lng: number },
    radiusMeters: number = 25000
  ): Promise<PlaceResult[]> {
    return new Promise((resolve, reject) => {
      if (!this.service) {
        reject(new Error("Places service not initialized"));
        return;
      }

      const request = {
        location: new window.google.maps.LatLng(location.lat, location.lng),
        radius: radiusMeters,
        type: 'veterinary_care',
        keyword: 'veterinary clinic animal hospital'
      };

      this.service.nearbySearch(request, (results: any[], status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          const places: PlaceResult[] = results.map(place => ({
            name: place.name,
            address: place.vicinity || place.formatted_address || '',
            phone: place.formatted_phone_number,
            rating: place.rating,
            latitude: place.geometry.location.lat().toString(),
            longitude: place.geometry.location.lng().toString(),
            placeId: place.place_id,
            openingHours: place.opening_hours?.weekday_text
          }));
          resolve(places);
        } else {
          reject(new Error(`Places search failed: ${status}`));
        }
      });
    });
  }

  async getPlaceDetails(placeId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!this.service) {
        reject(new Error("Places service not initialized"));
        return;
      }

      const request = {
        placeId: placeId,
        fields: ['name', 'formatted_address', 'formatted_phone_number', 'rating', 'opening_hours', 'website', 'geometry']
      };

      this.service.getDetails(request, (place: any, status: any) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          resolve(place);
        } else {
          reject(new Error(`Place details failed: ${status}`));
        }
      });
    });
  }
}