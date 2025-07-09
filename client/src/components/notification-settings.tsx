import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Bell, 
  BellOff, 
  Check, 
  X, 
  AlertTriangle, 
  Settings,
  Smartphone,
  Clock
} from 'lucide-react';
import { usePushNotifications } from '@/hooks/use-push-notifications';
import { useToast } from '@/hooks/use-toast';

interface NotificationSettingsProps {
  onClose?: () => void;
}

export default function NotificationSettings({ onClose }: NotificationSettingsProps) {
  const { 
    isSupported, 
    permission, 
    isSubscribed, 
    enableNotifications, 
    disableNotifications 
  } = usePushNotifications();
  const { toast } = useToast();
  const [isEnabling, setIsEnabling] = useState(false);

  const handleEnableNotifications = async () => {
    setIsEnabling(true);
    try {
      const success = await enableNotifications();
      if (success) {
        toast({
          title: "Notifications enabled",
          description: "You'll receive push notifications for pet reminders.",
        });
      }
    } catch (error) {
      toast({
        title: "Failed to enable notifications",
        description: "Please check your browser settings and try again.",
        variant: "destructive",
      });
    } finally {
      setIsEnabling(false);
    }
  };

  const handleDisableNotifications = () => {
    disableNotifications();
  };

  const getPermissionStatus = () => {
    if (!isSupported) {
      return {
        icon: <X className="w-4 h-4" />,
        text: "Not Supported",
        color: "bg-gray-100 text-gray-800"
      };
    }

    switch (permission) {
      case 'granted':
        return {
          icon: <Check className="w-4 h-4" />,
          text: "Enabled",
          color: "bg-green-100 text-green-800"
        };
      case 'denied':
        return {
          icon: <X className="w-4 h-4" />,
          text: "Blocked",
          color: "bg-red-100 text-red-800"
        };
      case 'default':
        return {
          icon: <AlertTriangle className="w-4 h-4" />,
          text: "Not Set",
          color: "bg-yellow-100 text-yellow-800"
        };
      default:
        return {
          icon: <Settings className="w-4 h-4" />,
          text: "Unknown",
          color: "bg-gray-100 text-gray-800"
        };
    }
  };

  const status = getPermissionStatus();

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Push Notifications
          </CardTitle>
          {onClose && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Status */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge className={status.color}>
              {status.icon}
              <span className="ml-1">{status.text}</span>
            </Badge>
          </div>

          {isSupported && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Push Notifications</span>
              <Switch
                checked={isSubscribed}
                onCheckedChange={(checked) => {
                  if (checked) {
                    handleEnableNotifications();
                  } else {
                    handleDisableNotifications();
                  }
                }}
                disabled={isEnabling || permission === 'denied'}
              />
            </div>
          )}
        </div>

        {/* Information Cards */}
        <div className="space-y-3">
          {!isSupported && (
            <Alert>
              <Smartphone className="h-4 w-4" />
              <AlertDescription>
                Push notifications are not supported in your current browser. 
                Try using Chrome, Firefox, or Safari for the best experience.
              </AlertDescription>
            </Alert>
          )}

          {isSupported && permission === 'denied' && (
            <Alert variant="destructive">
              <BellOff className="h-4 w-4" />
              <AlertDescription>
                Notifications are blocked. To enable them, click the bell icon in your 
                browser's address bar or check your browser settings.
              </AlertDescription>
            </Alert>
          )}

          {isSupported && isSubscribed && (
            <Alert>
              <Clock className="h-4 w-4" />
              <AlertDescription>
                You'll receive notifications for:
                <ul className="mt-2 text-xs space-y-1">
                  <li>• Overdue reminders (daily)</li>
                  <li>• Reminders due today (morning)</li>
                  <li>• Reminders due tomorrow (8 AM)</li>
                  <li>• Urgent reminders (1 hour before)</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          {isSupported && permission === 'default' && (
            <Button 
              onClick={handleEnableNotifications}
              disabled={isEnabling}
              className="w-full"
            >
              {isEnabling ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Enabling...
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Enable Push Notifications
                </>
              )}
            </Button>
          )}

          {isSupported && permission === 'denied' && (
            <Button 
              variant="outline"
              onClick={() => {
                toast({
                  title: "Manual Enable Required",
                  description: "Please enable notifications in your browser settings, then refresh the page.",
                });
              }}
              className="w-full"
            >
              <Settings className="w-4 h-4 mr-2" />
              Open Browser Settings
            </Button>
          )}

          {isSupported && isSubscribed && (
            <Button 
              variant="outline"
              onClick={handleDisableNotifications}
              className="w-full"
            >
              <BellOff className="w-4 h-4 mr-2" />
              Disable Notifications
            </Button>
          )}
        </div>

        {/* Test Notification Button */}
        {isSupported && isSubscribed && (
          <div className="pt-4 border-t">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => {
                // Send a test notification
                if ('Notification' in window && Notification.permission === 'granted') {
                  new Notification('🐾 ASOPETS Test', {
                    body: 'Push notifications are working correctly!',
                    icon: '/icon-192x192.png',
                    tag: 'test-notification'
                  });
                }
              }}
              className="w-full text-xs"
            >
              Send Test Notification
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}