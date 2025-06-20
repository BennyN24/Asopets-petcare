import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CuteNotification from "@/components/cute-notification";
import NotificationDropdown from "@/components/notification-dropdown";
import type { Reminder, Pet } from "@shared/schema";

interface ReminderWithPet extends Reminder {
  pet: Pet;
}

interface MedicationReminderManagerProps {
  showDropdown?: boolean;
  onDropdownClose?: () => void;
}

export default function MedicationReminderManager({ 
  showDropdown = false, 
  onDropdownClose 
}: MedicationReminderManagerProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [snoozedReminders, setSnoozedReminders] = React.useState<Set<number>>(new Set());
  const [dismissedReminders, setDismissedReminders] = React.useState<Set<number>>(new Set());

  // Fetch active reminders with pet details
  const { data: reminders = [] } = useQuery<ReminderWithPet[]>({
    queryKey: ["/api/reminders/with-pets"],
    queryFn: async () => {
      const [remindersResponse, petsResponse] = await Promise.all([
        apiRequest("GET", "/api/reminders"),
        apiRequest("GET", "/api/pets")
      ]);
      
      const reminderData = await remindersResponse.json();
      const petData = await petsResponse.json();
      
      // Combine reminders with pet information
      return reminderData.map((reminder: Reminder) => {
        const pet = petData.find((p: Pet) => p.id === reminder.petId);
        return { ...reminder, pet };
      }).filter((r: ReminderWithPet) => r.pet); // Only include reminders with valid pets
    },
    enabled: isAuthenticated,
    refetchInterval: 30000, // Check for new reminders every 30 seconds
  });

  // Complete reminder mutation
  const completeReminderMutation = useMutation({
    mutationFn: async (reminderId: number) => {
      await apiRequest("PUT", `/api/reminders/${reminderId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reminders/with-pets"] });
      toast({
        title: "Reminder completed",
        description: "Great job taking care of your pet!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Snooze reminder (local state management)
  const handleSnooze = (reminderId: number, minutes: number) => {
    setSnoozedReminders(prev => new Set(Array.from(prev).concat(reminderId)));
    
    // Remove from snoozed after the specified time
    setTimeout(() => {
      setSnoozedReminders(prev => {
        const newSet = new Set(Array.from(prev));
        newSet.delete(reminderId);
        return newSet;
      });
    }, minutes * 60 * 1000);

    toast({
      title: "Reminder snoozed",
      description: `We'll remind you again in ${minutes} minutes`,
    });
  };

  // Dismiss reminder (local state management)
  const handleDismiss = (reminderId: number) => {
    setDismissedReminders(prev => new Set(Array.from(prev).concat(reminderId)));
    
    toast({
      title: "Reminder dismissed",
      description: "You can find this reminder in your schedule",
    });
  };

  // Filter reminders to show
  const activeReminders = reminders.filter(reminder => 
    !reminder.isCompleted && 
    !snoozedReminders.has(reminder.id) && 
    !dismissedReminders.has(reminder.id)
  );

  // Get urgent reminders (due today or overdue)
  const urgentReminders = activeReminders.filter(reminder => {
    if (!reminder.dueDate) return false;
    const dueDate = new Date(reminder.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    return dueDate <= today;
  });

  // Show notification permission request for urgent reminders
  React.useEffect(() => {
    if (urgentReminders.length > 0 && "Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            // Show browser notification for urgent reminders
            urgentReminders.forEach(reminder => {
              if (reminder.pet) {
                new Notification(`${reminder.pet.name}'s ${reminder.type}`, {
                  body: reminder.title,
                  icon: "/favicon.ico",
                  tag: `reminder-${reminder.id}`,
                });
              }
            });
          }
        });
      } else if (Notification.permission === "granted") {
        // Show notifications for new urgent reminders
        urgentReminders.forEach(reminder => {
          if (reminder.pet) {
            new Notification(`${reminder.pet.name}'s ${reminder.type}`, {
              body: reminder.title,
              icon: "/favicon.ico",
              tag: `reminder-${reminder.id}`,
            });
          }
        });
      }
    }
  }, [urgentReminders.length]);

  if (!isAuthenticated || activeReminders.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-3 max-w-sm">
      {activeReminders.slice(0, 3).map((reminder) => (
        <CuteNotification
          key={reminder.id}
          reminder={reminder}
          pet={reminder.pet}
          onComplete={(id) => completeReminderMutation.mutate(id)}
          onDismiss={handleDismiss}
          onSnooze={handleSnooze}
        />
      ))}
      
      {activeReminders.length > 3 && (
        <div className="text-center text-sm text-gray-600 bg-white rounded-lg p-2 shadow-md border">
          +{activeReminders.length - 3} more reminders in your schedule
        </div>
      )}

      {/* Notification Dropdown */}
      <NotificationDropdown
        reminders={reminders}
        isOpen={showDropdown}
        onClose={onDropdownClose || (() => {})}
      />
    </div>
  );
}