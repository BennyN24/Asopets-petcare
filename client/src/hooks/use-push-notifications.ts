import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';

interface PushNotificationOptions {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  requireInteraction?: boolean;
  silent?: boolean;
  data?: any;
}

interface UsePushNotificationsReturn {
  isSupported: boolean;
  permission: NotificationPermission | null;
  isSubscribed: boolean;
  requestPermission: () => Promise<boolean>;
  sendNotification: (options: PushNotificationOptions) => Promise<boolean>;
  scheduleNotification: (options: PushNotificationOptions, delay: number) => void;
  enableNotifications: () => Promise<boolean>;
  disableNotifications: () => void;
}

export function usePushNotifications(): UsePushNotificationsReturn {
  const [isSupported, setIsSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission | null>(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if notifications are supported
    if (Capacitor.isNativePlatform()) {
      // Mobile platform - use Capacitor
      setIsSupported(true);
      initializeMobileNotifications();
    } else if ('Notification' in window && 'serviceWorker' in navigator) {
      // Web platform - use web notifications
      setIsSupported(true);
      setPermission(Notification.permission);
      setIsSubscribed(Notification.permission === 'granted');
    }
  }, []);

  const initializeMobileNotifications = useCallback(async () => {
    try {
      const pushPermissions = await PushNotifications.checkPermissions();
      const localPermissions = await LocalNotifications.checkPermissions();
      
      setPermission(pushPermissions.receive as NotificationPermission);
      setIsSubscribed(pushPermissions.receive === 'granted' && localPermissions.display === 'granted');
      
      // Add mobile event listeners
      PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        if (notification.notification.data?.type === 'reminder') {
          window.location.href = '/schedule';
        }
      });
      
      LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
        if (notification.notification.extra?.type === 'reminder') {
          window.location.href = '/schedule';
        }
      });
    } catch (error) {
      console.error('Error initializing mobile notifications:', error);
    }
  }, []);

  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      toast({
        title: "Notifications not supported",
        description: "Your device doesn't support push notifications.",
        variant: "destructive",
      });
      return false;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        // Mobile platform
        const pushPermissions = await PushNotifications.requestPermissions();
        const localPermissions = await LocalNotifications.requestPermissions();
        
        await PushNotifications.register();
        
        const granted = pushPermissions.receive === 'granted' && localPermissions.display === 'granted';
        setPermission(pushPermissions.receive as NotificationPermission);
        setIsSubscribed(granted);
        
        if (granted) {
          toast({
            title: "Notifications enabled",
            description: "You'll receive reminders for your pet's schedule.",
          });
        } else {
          toast({
            title: "Notifications blocked",
            description: "Please enable notifications in your device settings.",
            variant: "destructive",
          });
        }
        
        return granted;
      } else {
        // Web platform
        const result = await Notification.requestPermission();
        setPermission(result);
        const granted = result === 'granted';
        setIsSubscribed(granted);

        if (granted) {
          toast({
            title: "Notifications enabled",
            description: "You'll receive reminders for your pet's schedule.",
          });
        } else {
          toast({
            title: "Notifications blocked",
            description: "You can enable them in your browser settings.",
            variant: "destructive",
          });
        }

        return granted;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      toast({
        title: "Permission error",
        description: "Failed to request notification permission.",
        variant: "destructive",
      });
      return false;
    }
  }, [isSupported, toast]);

  const sendNotification = useCallback(async (options: PushNotificationOptions): Promise<boolean> => {
    if (!isSupported || permission !== 'granted') {
      console.log('Notifications not available or not permitted');
      return false;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        // Mobile platform - use local notifications
        await LocalNotifications.schedule({
          notifications: [{
            id: Date.now(),
            title: options.title,
            body: options.body,
            extra: options.data || {},
            schedule: { at: new Date(Date.now() + 1000) }, // Schedule 1 second from now
          }]
        });
      } else {
        // Web platform - use web notifications
        const notification = new Notification(options.title, {
          body: options.body,
          icon: options.icon || '/icon-192x192.png',
          badge: options.badge || '/icon-192x192.png',
          tag: options.tag || 'asopets-reminder',
          requireInteraction: options.requireInteraction || false,
          silent: options.silent || false,
          data: options.data,
        });

        // Handle notification click
        notification.onclick = (event) => {
          event.preventDefault();
          window.focus();
          
          // Navigate to schedule page if data contains reminder info
          if (options.data?.type === 'reminder') {
            window.location.href = '/schedule';
          }
          
          notification.close();
        };

        // Auto-close after 10 seconds unless requireInteraction is true
        if (!options.requireInteraction) {
          setTimeout(() => {
            notification.close();
          }, 10000);
        }
      }

      console.log('Push notification sent:', options.title);
      return true;
    } catch (error) {
      console.error('Error sending notification:', error);
      return false;
    }
  }, [isSupported, permission]);

  const scheduleNotification = useCallback(async (options: PushNotificationOptions, delay: number) => {
    if (!isSupported || permission !== 'granted') {
      console.log('Cannot schedule notification - not supported or not permitted');
      return;
    }

    try {
      if (Capacitor.isNativePlatform()) {
        // Mobile platform - use local notifications with proper scheduling
        const scheduleDate = new Date(Date.now() + delay);
        
        await LocalNotifications.schedule({
          notifications: [{
            id: Date.now(),
            title: options.title,
            body: options.body,
            extra: options.data || {},
            schedule: { at: scheduleDate },
          }]
        });
        
        console.log(`Mobile notification scheduled for ${scheduleDate.toISOString()}:`, options.title);
      } else {
        // Web platform - use setTimeout
        setTimeout(() => {
          sendNotification(options);
        }, delay);
        
        console.log(`Web notification scheduled for ${delay}ms from now:`, options.title);
      }
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  }, [isSupported, permission, sendNotification]);

  const enableNotifications = useCallback(async (): Promise<boolean> => {
    if (permission === 'granted') {
      setIsSubscribed(true);
      return true;
    }

    return await requestPermission();
  }, [permission, requestPermission]);

  const disableNotifications = useCallback(() => {
    setIsSubscribed(false);
    toast({
      title: "Notifications disabled",
      description: "You won't receive push notifications for reminders.",
    });
  }, [toast]);

  return {
    isSupported,
    permission,
    isSubscribed,
    requestPermission,
    sendNotification,
    scheduleNotification,
    enableNotifications,
    disableNotifications,
  };
}

// Utility functions for pet-specific notifications
export const createReminderNotification = (
  petName: string,
  reminderTitle: string,
  reminderType: string,
  dueDate: string
): PushNotificationOptions => {
  const petEmoji = {
    dog: '🐕',
    cat: '🐱',
    rabbit: '🐰',
    bird: '🐦',
    horse: '🐴',
    exotic: '🦎',
    other: '🐾'
  };

  const typeEmoji = {
    vaccine: '💉',
    deworming: '💊',
    treatment: '🏥',
    surgery: '⚕️',
    checkup: '🩺',
    grooming: '✂️'
  };

  return {
    title: `${petEmoji[petName as keyof typeof petEmoji] || '🐾'} ${petName} Reminder`,
    body: `${typeEmoji[reminderType as keyof typeof typeEmoji] || '📅'} ${reminderTitle} is due ${dueDate}`,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: `reminder-${petName}-${reminderType}`,
    requireInteraction: true,
    data: {
      type: 'reminder',
      petName,
      reminderTitle,
      reminderType,
      dueDate
    }
  };
};

export const createOverdueNotification = (
  petName: string,
  reminderTitle: string,
  reminderType: string,
  daysOverdue: number
): PushNotificationOptions => {
  return {
    title: `⚠️ ${petName} - Overdue Reminder`,
    body: `${reminderTitle} is ${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`,
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    tag: `overdue-${petName}-${reminderType}`,
    requireInteraction: true,
    data: {
      type: 'overdue',
      petName,
      reminderTitle,
      reminderType,
      daysOverdue
    }
  };
};