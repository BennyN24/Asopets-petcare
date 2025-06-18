import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Heart, 
  Pill, 
  Clock, 
  CheckCircle, 
  X,
  Zap,
  Sparkles,
  PawPrint
} from "lucide-react";
import { format, isToday, isTomorrow, formatDistanceToNow } from "date-fns";
import { notificationSounds } from "@/lib/notification-sounds";
import type { Reminder, Pet } from "@shared/schema";

interface CuteNotificationProps {
  reminder: Reminder;
  pet: Pet;
  onComplete: (reminderId: number) => void;
  onDismiss: (reminderId: number) => void;
  onSnooze: (reminderId: number, minutes: number) => void;
}

const petEmojis: Record<string, string> = {
  dog: "🐕",
  cat: "🐱", 
  bird: "🐦",
  rabbit: "🐰",
  other: "🐾"
};

const medicationEmojis: Record<string, string> = {
  vaccine: "💉",
  deworming: "💊",
  treatment: "🩹",
  surgery: "🏥",
  checkup: "🩺",
  "lab-test": "🔬"
};

export default function CuteNotification({ 
  reminder, 
  pet, 
  onComplete, 
  onDismiss, 
  onSnooze 
}: CuteNotificationProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [showSnoozeOptions, setShowSnoozeOptions] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  const getUrgencyLevel = () => {
    if (!reminder.dueDate) return "normal";
    const dueDate = new Date(reminder.dueDate);
    const now = new Date();
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    
    if (hoursUntilDue < 0) return "overdue";
    if (hoursUntilDue < 2) return "urgent";
    if (hoursUntilDue < 24) return "soon";
    return "normal";
  };

  const sendPushNotification = async (reminder: Reminder, pet: Pet, urgency: string) => {
    if ('serviceWorker' in navigator && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          const petEmoji = petEmojis[pet.category] || "🐾";
          const medicationEmoji = medicationEmojis[reminder.type] || "💊";
          
          new Notification(`${petEmoji} ${pet.name} - ${reminder.type} reminder`, {
            body: `${medicationEmoji} ${reminder.title}`,
            icon: '/favicon.ico',
            badge: '/favicon.ico',
            tag: `reminder-${reminder.id}`,
            requireInteraction: urgency === "urgent" || urgency === "overdue",

          });
        }
      } catch (error) {
        console.log('Push notification error:', error);
      }
    }
  };

  useEffect(() => {
    if (!hasPlayed) {
      // Play appropriate sound and send push notification
      const urgency = getUrgencyLevel();
      
      // Send push notification
      sendPushNotification(reminder, pet, urgency);
      
      // Play sound
      setTimeout(() => {
        if (urgency === "urgent" || urgency === "overdue") {
          notificationSounds.playUrgentAlert();
        } else {
          notificationSounds.playGentleChime();
        }
        setHasPlayed(true);
      }, 300);
    }
  }, [hasPlayed]);

  const handleComplete = () => {
    notificationSounds.playCompletionSound();
    setIsVisible(false);
    setTimeout(() => onComplete(reminder.id), 300);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setTimeout(() => onDismiss(reminder.id), 300);
  };

  const handleSnooze = (minutes: number) => {
    notificationSounds.playSnoozeSound();
    setIsVisible(false);
    setTimeout(() => onSnooze(reminder.id, minutes), 300);
  };

  const urgency = getUrgencyLevel();
  const petEmoji = petEmojis[pet.category as keyof typeof petEmojis] || petEmojis.other;
  const medicationEmoji = medicationEmojis[reminder.type as keyof typeof medicationEmojis] || "💊";

  const urgencyStyles = {
    overdue: "border-red-200 bg-red-50 shadow-red-100",
    urgent: "border-orange-200 bg-orange-50 shadow-orange-100",
    soon: "border-yellow-200 bg-yellow-50 shadow-yellow-100",
    normal: "border-blue-200 bg-blue-50 shadow-blue-100"
  };

  const urgencyColors = {
    overdue: "text-red-800",
    urgent: "text-orange-800", 
    soon: "text-yellow-800",
    normal: "text-blue-800"
  };

  const getTimeDisplay = () => {
    if (!reminder.dueDate) return "";
    const dueDate = new Date(reminder.dueDate);
    
    if (isToday(dueDate)) return "Today";
    if (isTomorrow(dueDate)) return "Tomorrow";
    return format(dueDate, "MMM d");
  };

  if (!isVisible) return null;

  return (
    <Card 
      className={`
        max-w-sm w-full mx-auto 
        ${urgencyStyles[urgency]} 
        transition-all duration-300 transform hover:scale-105 
        shadow-lg border-2 relative overflow-hidden
      `}
    >
      {/* Cute sparkle animation for urgent reminders */}
      {urgency === "urgent" && (
        <div className="absolute top-2 right-2 animate-pulse">
          <Sparkles className="w-4 h-4 text-orange-500" />
        </div>
      )}
      
      {/* Overdue warning flash */}
      {urgency === "overdue" && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-400 to-pink-400 animate-pulse" />
      )}

      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            {/* Pet avatar with medication icon */}
            <div className="relative">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl shadow-sm border-2 border-gray-100">
                {petEmoji}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center text-sm border-2 border-gray-100">
                {medicationEmoji}
              </div>
            </div>

            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h3 className={`font-semibold ${urgencyColors[urgency]}`}>
                  {pet.name}'s {reminder.type}
                </h3>
                {urgency === "overdue" && (
                  <Badge variant="destructive" className="text-xs animate-pulse">
                    Overdue
                  </Badge>
                )}
                {urgency === "urgent" && (
                  <Badge variant="outline" className="text-xs border-orange-300 text-orange-700">
                    <Zap className="w-3 h-3 mr-1" />
                    Urgent
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-gray-700 mb-2">{reminder.title}</p>
              
              <div className="flex items-center space-x-4 text-xs text-gray-600">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeDisplay()}</span>
                </div>
                {reminder.dueDate && (
                  <div className="flex items-center space-x-1">
                    <PawPrint className="w-3 h-3" />
                    <span>{formatDistanceToNow(new Date(reminder.dueDate), { addSuffix: true })}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleDismiss}
            className="p-1 h-6 w-6 hover:bg-white/50"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Action buttons */}
        <div className="mt-4 space-y-2">
          {!showSnoozeOptions ? (
            <div className="flex space-x-2">
              <Button
                onClick={handleComplete}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm py-2"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Done
              </Button>
              
              <Button
                onClick={() => setShowSnoozeOptions(true)}
                variant="outline"
                className="flex-1 text-sm py-2"
              >
                <Bell className="w-4 h-4 mr-2" />
                Snooze
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  onClick={() => handleSnooze(15)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  15 min
                </Button>
                <Button
                  onClick={() => handleSnooze(30)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  30 min
                </Button>
                <Button
                  onClick={() => handleSnooze(60)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  1 hour
                </Button>
                <Button
                  onClick={() => handleSnooze(240)}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  4 hours
                </Button>
              </div>
              <Button
                onClick={() => setShowSnoozeOptions(false)}
                variant="ghost"
                size="sm"
                className="w-full text-xs"
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Cute motivational message */}
        <div className="mt-3 text-center">
          <p className="text-xs text-gray-500 italic">
            {urgency === "overdue" 
              ? `${pet.name} is counting on you! 🥺`
              : urgency === "urgent"
              ? `${pet.name} needs attention soon! 💕`
              : `Keep ${pet.name} healthy and happy! ✨`
            }
          </p>
        </div>
      </CardContent>
    </Card>
  );
}