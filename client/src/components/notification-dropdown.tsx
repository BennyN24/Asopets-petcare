import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Clock, AlertCircle, CheckCircle, X, Clock3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { Reminder, Pet } from "@shared/schema";

interface ReminderWithPet extends Reminder {
  pet: Pet;
}

interface NotificationDropdownProps {
  reminders: ReminderWithPet[];
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationDropdown({ 
  reminders, 
  isOpen, 
  onClose 
}: NotificationDropdownProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

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
        description: "The reminder has been marked as complete.",
      });
    },
  });

  const handleComplete = (reminderId: number) => {
    completeReminderMutation.mutate(reminderId);
  };

  const handleSnooze = (reminderId: number, minutes: number) => {
    // For now, just show a toast - snooze functionality can be implemented later
    toast({
      title: "Reminder snoozed",
      description: `Reminder snoozed for ${minutes} minutes.`,
    });
  };

  const getUrgencyColor = (reminder: ReminderWithPet) => {
    if (reminder.isOverdue) return "text-red-600 bg-red-50";
    
    const dueDate = new Date(reminder.dueDate);
    const now = new Date();
    const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff <= 1) return "text-orange-600 bg-orange-50";
    if (hoursDiff <= 24) return "text-yellow-600 bg-yellow-50";
    return "text-blue-600 bg-blue-50";
  };

  const getUrgencyIcon = (reminder: ReminderWithPet) => {
    if (reminder.isOverdue) return <AlertCircle className="w-4 h-4 text-red-600" />;
    
    const dueDate = new Date(reminder.dueDate);
    const now = new Date();
    const hoursDiff = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff <= 1) return <AlertCircle className="w-4 h-4 text-orange-600" />;
    return <Clock className="w-4 h-4 text-blue-600" />;
  };

  const formatDueDate = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const diffInHours = (date.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 0) {
      const overdueDays = Math.floor(Math.abs(diffInHours) / 24);
      return `Overdue by ${overdueDays} day${overdueDays !== 1 ? 's' : ''}`;
    } else if (diffInHours < 1) {
      const minutes = Math.floor(diffInHours * 60);
      return `Due in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else if (diffInHours < 24) {
      const hours = Math.floor(diffInHours);
      return `Due in ${hours} hour${hours !== 1 ? 's' : ''}`;
    } else {
      const days = Math.floor(diffInHours / 24);
      return `Due in ${days} day${days !== 1 ? 's' : ''}`;
    }
  };

  if (!isOpen) return null;

  const activeReminders = reminders.filter(r => !r.isCompleted);
  const overdueReminders = activeReminders.filter(r => r.isOverdue);
  const upcomingReminders = activeReminders.filter(r => !r.isOverdue);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      
      {/* Dropdown */}
      <div 
        ref={dropdownRef}
        className="absolute top-16 right-4 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-xl border border-gray-200 max-h-[80vh] overflow-hidden"
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center text-lg">
              <Bell className="w-5 h-5 mr-2 text-primary" />
              Notifications
              {activeReminders.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white">
                  {activeReminders.length}
                </Badge>
              )}
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {activeReminders.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p className="font-medium">All caught up!</p>
              <p className="text-sm">No pending reminders at the moment.</p>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {/* Overdue reminders first */}
              {overdueReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-4 border-b border-gray-100 ${getUrgencyColor(reminder)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        {getUrgencyIcon(reminder)}
                        <span className="ml-2 font-medium text-sm truncate">
                          {reminder.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {reminder.pet.name} • {reminder.type}
                      </p>
                      <p className="text-xs font-medium">
                        {formatDueDate(reminder.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                        onClick={() => handleComplete(reminder.id)}
                        disabled={completeReminderMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"
                        onClick={() => handleSnooze(reminder.id, 60)}
                      >
                        <Snooze className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Upcoming reminders */}
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className={`p-4 border-b border-gray-100 ${getUrgencyColor(reminder)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center mb-1">
                        {getUrgencyIcon(reminder)}
                        <span className="ml-2 font-medium text-sm truncate">
                          {reminder.title}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 mb-1">
                        {reminder.pet.name} • {reminder.type}
                      </p>
                      <p className="text-xs font-medium">
                        {formatDueDate(reminder.dueDate)}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-green-600 hover:bg-green-100"
                        onClick={() => handleComplete(reminder.id)}
                        disabled={completeReminderMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-100"
                        onClick={() => handleSnooze(reminder.id, 60)}
                      >
                        <Snooze className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {activeReminders.length > 5 && (
                <div className="p-3 text-center">
                  <Button variant="ghost" size="sm" className="text-primary">
                    View all in Schedule
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </div>
    </div>
  );
}