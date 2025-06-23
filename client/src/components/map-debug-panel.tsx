import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Wifi, WifiOff, AlertCircle, CheckCircle } from "lucide-react";

interface MapDebugPanelProps {
  userLocation: { lat: number; lng: number } | null;
  clinicsCount: number;
  googleMapsLoaded: boolean;
  onLocationRefresh: () => void;
}

export default function MapDebugPanel({
  userLocation,
  clinicsCount,
  googleMapsLoaded,
  onLocationRefresh
}: MapDebugPanelProps) {
  const [apiKeyStatus, setApiKeyStatus] = React.useState<'loading' | 'valid' | 'invalid'>('loading');
  const [networkStatus, setNetworkStatus] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const checkApiKey = async () => {
      try {
        const response = await fetch('/api/google-maps-config');
        const data = await response.json();
        setApiKeyStatus(data.apiKey ? 'valid' : 'invalid');
      } catch (error) {
        setApiKeyStatus('invalid');
      }
    };

    checkApiKey();

    const handleOnline = () => setNetworkStatus(true);
    const handleOffline = () => setNetworkStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm">Map Status</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            {networkStatus ? (
              <Wifi className="w-4 h-4 text-green-600" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-600" />
            )}
            <span>Network</span>
            <Badge variant={networkStatus ? "default" : "destructive"} className="text-xs">
              {networkStatus ? "Online" : "Offline"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {apiKeyStatus === 'valid' ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-600" />
            )}
            <span>API Key</span>
            <Badge 
              variant={apiKeyStatus === 'valid' ? "default" : "destructive"} 
              className="text-xs"
            >
              {apiKeyStatus === 'loading' ? "Checking..." : 
               apiKeyStatus === 'valid' ? "Valid" : "Invalid"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Location</span>
            <Badge variant={userLocation ? "default" : "secondary"} className="text-xs">
              {userLocation ? "Found" : "None"}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            {googleMapsLoaded ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertCircle className="w-4 h-4 text-yellow-600" />
            )}
            <span>Google Maps</span>
            <Badge 
              variant={googleMapsLoaded ? "default" : "secondary"} 
              className="text-xs"
            >
              {googleMapsLoaded ? "Loaded" : "Loading"}
            </Badge>
          </div>
        </div>

        {userLocation && (
          <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
            <strong>Location:</strong> {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            <br />
            <strong>Clinics found:</strong> {clinicsCount}
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onLocationRefresh}
          className="w-full text-xs"
        >
          Refresh Location
        </Button>
      </CardContent>
    </Card>
  );
}