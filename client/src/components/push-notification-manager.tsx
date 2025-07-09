import { useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePushNotifications, createReminderNotification, createOverdueNotification } from '@/hooks/use-push-notifications';
import { useAuth } from '@/hooks/useAuth';
import { differenceInDays, isToday, isTomorrow, parseISO } from 'date-fns';
import type { Reminder, Pet } from '@shared/schema';

interface PushNotificationManagerProps {
  enabled?: boolean;
}

export default function PushNotificationManager({ enabled = true }: PushNotificationManagerProps) {
  const { isAuthenticated } = useAuth();
  const { 
    isSupported, 
    isSubscribed, 
    sendNotification, 
    scheduleNotification 
  } = usePushNotifications();

  // Get reminders
  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders"],
    enabled: isAuthenticated && enabled,
    refetchInterval: 60000, // Check every minute
  });

  // Get pets
  const { data: pets = [] } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
    enabled: isAuthenticated && enabled,
  });

  const processReminders = useCallback(() => {
    if (!enabled || !isSupported || !isSubscribed || !reminders.length || !pets.length) {
      return;
    }

    console.log('Processing reminders for notifications:', reminders.length);

    reminders.forEach((reminder) => {
      if (reminder.isCompleted) return;

      const pet = pets.find(p => p.id === reminder.petId);
      if (!pet) return;

      const dueDate = parseISO(reminder.dueDate);
      const today = new Date();
      const daysDiff = differenceInDays(dueDate, today);

      // Send immediate notification for overdue reminders
      if (daysDiff < 0) {
        const daysOverdue = Math.abs(daysDiff);
        const notification = createOverdueNotification(
          pet.name,
          reminder.title,
          reminder.type,
          daysOverdue
        );

        // Only send overdue notifications once per day to avoid spam
        const lastNotified = localStorage.getItem(`overdue-${reminder.id}`);
        const lastNotifiedDate = lastNotified ? new Date(lastNotified) : null;
        
        if (!lastNotifiedDate || !isToday(lastNotifiedDate)) {
          sendNotification(notification);
          localStorage.setItem(`overdue-${reminder.id}`, today.toISOString());
        }
      }

      // Send notification for reminders due today
      else if (isToday(dueDate)) {
        const notification = createReminderNotification(
          pet.name,
          reminder.title,
          reminder.type,
          'today'
        );

        // Only send "due today" notification once
        const todayNotified = localStorage.getItem(`today-${reminder.id}`);
        if (!todayNotified) {
          sendNotification(notification);
          localStorage.setItem(`today-${reminder.id}`, today.toISOString());
        }
      }

      // Schedule notification for reminders due tomorrow
      else if (isTomorrow(dueDate)) {
        const notification = createReminderNotification(
          pet.name,
          reminder.title,
          reminder.type,
          'tomorrow'
        );

        // Schedule for 8 AM tomorrow (or immediately if past 8 AM)
        const tomorrow8AM = new Date();
        tomorrow8AM.setDate(tomorrow8AM.getDate() + 1);
        tomorrow8AM.setHours(8, 0, 0, 0);
        
        const delayMs = tomorrow8AM.getTime() - today.getTime();
        
        // Only schedule if not already scheduled
        const tomorrowScheduled = localStorage.getItem(`tomorrow-${reminder.id}`);
        if (!tomorrowScheduled && delayMs > 0) {
          scheduleNotification(notification, delayMs);
          localStorage.setItem(`tomorrow-${reminder.id}`, today.toISOString());
        }
      }

      // Schedule notification 1 hour before due time for same-day reminders
      else if (daysDiff === 0) {
        const oneHourBefore = new Date(dueDate.getTime() - (60 * 60 * 1000));
        const delayMs = oneHourBefore.getTime() - today.getTime();
        
        if (delayMs > 0 && delayMs <= 24 * 60 * 60 * 1000) { // Within 24 hours
          const notification = createReminderNotification(
            pet.name,
            reminder.title,
            reminder.type,
            'in 1 hour'
          );

          const hourScheduled = localStorage.getItem(`hour-${reminder.id}`);
          if (!hourScheduled) {
            scheduleNotification(notification, delayMs);
            localStorage.setItem(`hour-${reminder.id}`, today.toISOString());
          }
        }
      }
    });
  }, [enabled, isSupported, isSubscribed, reminders, pets, sendNotification, scheduleNotification]);

  // Process reminders when data changes
  useEffect(() => {
    processReminders();
  }, [processReminders]);

  // Clean up old localStorage entries (older than 7 days)
  useEffect(() => {
    const cleanupOldEntries = () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('overdue-') || key.startsWith('today-') || 
            key.startsWith('tomorrow-') || key.startsWith('hour-')) {
          const value = localStorage.getItem(key);
          if (value) {
            const storedDate = new Date(value);
            if (storedDate < sevenDaysAgo) {
              localStorage.removeItem(key);
            }
          }
        }
      });
    };

    cleanupOldEntries();
    // Run cleanup daily
    const interval = setInterval(cleanupOldEntries, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Log status for debugging
  useEffect(() => {
    if (enabled && isAuthenticated) {
      console.log('Push Notification Manager Status:', {
        isSupported,
        isSubscribed,
        reminderCount: reminders.length,
        petCount: pets.length,
        enabled
      });
    }
  }, [enabled, isAuthenticated, isSupported, isSubscribed, reminders.length, pets.length]);

  // This component doesn't render anything
  return null;
}