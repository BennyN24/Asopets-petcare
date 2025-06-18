import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff, CloudOff, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { OfflineStorage } from "@/lib/offline-storage";

export default function OfflineSyncIndicator() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [offlineData, setOfflineData] = useState({ hasOfflineData: false, count: 0 });
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Check for offline data on mount and periodically
    const checkOfflineData = () => {
      const indicator = OfflineStorage.getOfflineIndicator();
      setOfflineData(indicator);
    };

    checkOfflineData();
    const interval = setInterval(checkOfflineData, 10000); // Check every 10 seconds

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const handleSync = async () => {
    if (!isOnline) {
      toast({
        title: "No internet connection",
        description: "Please check your internet connection and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsSyncing(true);
    try {
      await OfflineStorage.syncPendingData();
      setOfflineData({ hasOfflineData: false, count: 0 });
      toast({
        title: "Sync completed",
        description: "All offline data has been synchronized.",
      });
    } catch (error) {
      toast({
        title: "Sync failed",
        description: "Some data could not be synchronized. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSyncing(false);
    }
  };

  // Auto-sync when coming back online
  useEffect(() => {
    if (isOnline && offlineData.hasOfflineData && !isSyncing) {
      setTimeout(() => {
        handleSync();
      }, 2000); // Wait 2 seconds after coming online
    }
  }, [isOnline]);

  if (!offlineData.hasOfflineData && isOnline) {
    return null; // Don't show anything when everything is synced and online
  }

  return (
    <Card className={`mb-4 ${!isOnline ? 'border-amber-200 bg-amber-50' : offlineData.hasOfflineData ? 'border-blue-200 bg-blue-50' : ''}`}>
      <CardContent className="p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {isOnline ? (
              <Wifi className="w-5 h-5 text-green-600" />
            ) : (
              <WifiOff className="w-5 h-5 text-amber-600" />
            )}
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">
                  {isOnline ? 'Online' : 'Offline'}
                </span>
                {offlineData.hasOfflineData && (
                  <Badge variant="outline" className="text-xs">
                    {offlineData.count} unsynced
                  </Badge>
                )}
              </div>
              <p className="text-xs text-gray-600">
                {!isOnline 
                  ? 'Working offline - data will sync when online'
                  : offlineData.hasOfflineData 
                    ? 'You have unsynced data'
                    : 'All data synchronized'
                }
              </p>
            </div>
          </div>

          {offlineData.hasOfflineData && isOnline && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleSync}
              disabled={isSyncing}
              className="flex items-center"
            >
              {isSyncing ? (
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {isSyncing ? 'Syncing...' : 'Sync Now'}
            </Button>
          )}

          {!isOnline && (
            <CloudOff className="w-5 h-5 text-amber-600" />
          )}
        </div>
      </CardContent>
    </Card>
  );
}