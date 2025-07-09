import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Bell,
  BellRing,
  Settings,
  Syringe,
  PillBottle,
  Heart as MedicalKit,
  UserCog,
  Stethoscope,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import { format, isToday, isTomorrow, isThisWeek, differenceInDays } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import BottomNavigation from "@/components/bottom-navigation";
import NotificationDropdown from "@/components/notification-dropdown";
import PushNotificationManager from "@/components/push-notification-manager";
import NotificationSettings from "@/components/notification-settings";
import { usePushNotifications } from "@/hooks/use-push-notifications";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Reminder, Pet as PetType } from "@shared/schema";
import { useMemo } from "react";
import { Label } from "@/components/ui/label";

export default function Schedule() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"upcoming" | "completed">("upcoming");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedPet, setSelectedPet] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "type" | "pet">("date");
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const { isSupported: pushSupported, isSubscribed: pushEnabled } = usePushNotifications();

  const { data: reminders = [], isLoading: remindersLoading } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders"],
    enabled: isAuthenticated,
  });

  const { data: pets = [] } = useQuery<PetType[]>({
    queryKey: ["/api/pets"],
    queryFn: async () => {
      const response = await fetch("/api/pets?includePhotos=false&limit=50");
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      return response.json();
    },
    enabled: isAuthenticated,
  });

  // Query for reminders with pet data for notifications
  const { data: remindersWithPets = [] } = useQuery({
    queryKey: ["/api/reminders/with-pets"],
    queryFn: async () => {
      const response = await fetch("/api/reminders");
      if (!response.ok) throw new Error(`${response.status}: ${response.statusText}`);
      const remindersData = await response.json();

      // Combine reminders with pet data
      return remindersData.map((reminder: any) => ({
        ...reminder,
        pet: pets.find((pet: PetType) => pet.id === reminder.petId)
      })).filter((reminder: any) => reminder.pet); // Only include reminders with valid pets
    },
    enabled: isAuthenticated && pets.length > 0,
  });

  const completeReminderMutation = useMutation({
    mutationFn: async (reminderId: number) => {
      await apiRequest("PUT", `/api/reminders/${reminderId}/complete`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reminders/overdue"] });
      toast({
        title: "Reminder completed",
        description: "The reminder has been marked as completed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const getActivityIcon = (type: string) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case 'vaccine': return <Syringe {...iconProps} />;
      case 'deworming': return <PillBottle {...iconProps} />;
      case 'treatment': return <MedicalKit {...iconProps} />;
      case 'surgery': return <UserCog {...iconProps} />;
      case 'checkup': return <Stethoscope {...iconProps} />;
      case 'grooming': return <UserCog {...iconProps} />;
      default: return <Bell {...iconProps} />;
    }
  };

  const getPetName = (petId: number) => {
    const pet = pets.find(p => p.id === petId);
    return pet?.name || 'Unknown Pet';
  };

  const getDateCategory = (dueDate: string) => {
    const date = new Date(dueDate);
    const now = new Date();
    const daysDiff = differenceInDays(date, now);

    if (daysDiff < 0) return 'overdue';
    if (isToday(date)) return 'today';
    if (isTomorrow(date)) return 'tomorrow';
    if (isThisWeek(date)) return 'this-week';
    if (daysDiff <= 30) return 'this-month';
    return 'later';
  };

  const formatDateDisplay = (dueDate: string, category: string) => {
    const date = new Date(dueDate);
    switch (category) {
      case 'overdue':
        const daysOverdue = Math.abs(differenceInDays(date, new Date()));
        return `${daysOverdue} day${daysOverdue !== 1 ? 's' : ''} overdue`;
      case 'today':
        return 'Today';
      case 'tomorrow':
        return 'Tomorrow';
      case 'this-week':
        return format(date, 'EEEE');
      default:
        return format(date, 'MMM d, yyyy');
    }
  };

  const getBadgeVariant = (category: string) => {
    switch (category) {
      case 'overdue': return 'destructive';
      case 'today': return 'destructive';
      case 'tomorrow': return 'default';
      case 'this-week': return 'secondary';
      default: return 'outline';
    }
  };

  const categorizeReminders = (reminderList: Reminder[]) => {
    const categories = {
      overdue: [] as Reminder[],
      today: [] as Reminder[],
      tomorrow: [] as Reminder[],
      'this-week': [] as Reminder[],
      'this-month': [] as Reminder[],
      later: [] as Reminder[]
    };

    reminderList
      .filter(reminder => reminder.dueDate)
      .forEach(reminder => {
        const category = getDateCategory(reminder.dueDate!);
        categories[category].push(reminder);
      });

    return categories;
  };

  const activeReminders = reminders.filter(r => !r.isCompleted);
  const completedReminders = reminders.filter(r => r.isCompleted && pets.some(pet => pet.id === r.petId));

  // Filter and sort reminders
  const filteredUpcomingReminders = useMemo(() => {
    let filtered = activeReminders;

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(reminder => reminder.type === selectedType);
    }

    // Apply pet filter
    if (selectedPet !== "all") {
      filtered = filtered.filter(reminder => reminder.petId.toString() === selectedPet);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "type":
          return a.type.localeCompare(b.type);
        case "pet":
          const petA = pets.find(p => p.id === a.petId)?.name || "";
          const petB = pets.find(p => p.id === b.petId)?.name || "";
          return petA.localeCompare(petB);
        case "date":
        default:
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
    });

    return filtered;
  }, [activeReminders, selectedType, selectedPet, sortBy, pets]);

  const filteredCompletedReminders = useMemo(() => {
    let filtered = completedReminders;

    // Apply type filter
    if (selectedType !== "all") {
      filtered = filtered.filter(reminder => reminder.type === selectedType);
    }

    // Apply pet filter
    if (selectedPet !== "all") {
      filtered = filtered.filter(reminder => reminder.petId.toString() === selectedPet);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "type":
          return a.type.localeCompare(b.type);
        case "pet":
          const petA = pets.find(p => p.id === a.petId)?.name || "";
          const petB = pets.find(p => p.id === b.petId)?.name || "";
          return petA.localeCompare(petB);
        case "date":
        default:
          // For completed reminders, sort by completion date descending
          if (a.completedAt && b.completedAt) {
            return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
          }
          return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
      }
    });

    return filtered;
  }, [completedReminders, selectedType, selectedPet, sortBy, pets]);

  const categorizedReminders = categorizeReminders(filteredUpcomingReminders);

  const handleCompleteReminder = (reminderId: number) => {
    completeReminderMutation.mutate(reminderId);
  };

  // Calculate notification counts
  const activeNotifications = remindersWithPets.filter((r: any) => !r.isCompleted);
  const overdueNotifications = activeNotifications.filter((r: any) => r.isOverdue);
  const upcomingNotifications = activeNotifications.filter((r: any) => !r.isOverdue);
  const totalNotificationCount = activeNotifications.length;

  const handleNotificationClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
  };

  const handleCloseNotifications = () => {
    setShowNotificationDropdown(false);
  };

  if (remindersLoading) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading schedule...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container pb-20">
      {/* Push Notification Manager */}
      <PushNotificationManager enabled={isAuthenticated} />
      
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Schedule</h1>
            <p className="text-white/80 text-sm">Manage Reminders</p>
          </div>
          <div className="flex items-center space-x-3">
            {/* Push Notification Settings */}
            <Dialog open={showNotificationSettings} onOpenChange={setShowNotificationSettings}>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 relative p-2"
                >
                  {pushEnabled ? (
                    <BellRing className="w-5 h-5 text-green-300" />
                  ) : (
                    <Settings className="w-5 h-5" />
                  )}
                  {pushSupported && !pushEnabled && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <NotificationSettings onClose={() => setShowNotificationSettings(false)} />
              </DialogContent>
            </Dialog>

            {/* Notification Dropdown */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 relative p-2"
              onClick={handleNotificationClick}
            >
              <Bell className="w-5 h-5" />
              {totalNotificationCount > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalNotificationCount > 9 ? '9+' : totalNotificationCount}
                </div>
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4 space-y-6">

        {/* Filter Controls - Moved above tabs */}
        <div className="bg-white rounded-lg border shadow-sm p-4">
          <div className="flex flex-col space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Filter & Sort</h3>
              {(selectedType !== "all" || selectedPet !== "all" || sortBy !== "date") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedType("all");
                    setSelectedPet("all");
                    setSortBy("date");
                  }}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Clear filters
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Type Filter */}
              <div>
                <Label className="text-xs text-gray-600">Type</Label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="vaccine">Vaccine</SelectItem>
                    <SelectItem value="deworming">Deworming</SelectItem>
                    <SelectItem value="treatment">Treatment</SelectItem>
                    <SelectItem value="surgery">Surgery</SelectItem>
                    <SelectItem value="checkup">Checkup</SelectItem>
                    <SelectItem value="grooming">Grooming</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Pet Filter */}
              <div>
                <Label className="text-xs text-gray-600">Pet</Label>
                <Select value={selectedPet} onValueChange={setSelectedPet}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="All pets" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All pets</SelectItem>
                    {pets.map((pet) => (
                      <SelectItem key={pet.id} value={pet.id.toString()}>
                        {pet.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Options */}
              <div>
                <Label className="text-xs text-gray-600">Sort by</Label>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as "date" | "type" | "pet")}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Due Date</SelectItem>
                    <SelectItem value="type">Type</SelectItem>
                    <SelectItem value="pet">Pet Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "upcoming" | "completed")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {/* Critical Alerts */}
            {categorizedReminders.overdue.length > 0 && (
              <Card className="border-destructive bg-red-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-destructive">
                    <AlertTriangle className="w-5 h-5 mr-2" />
                    Overdue ({categorizedReminders.overdue.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categorizedReminders.overdue.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(reminder.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{reminder.title}</p>
                          <p className="text-sm text-gray-600">{getPetName(reminder.petId)}</p>
                          <p className="text-xs text-destructive font-medium">
                            {formatDateDisplay(reminder.dueDate!, 'overdue')}
                          </p>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCompleteReminder(reminder.id)}
                        disabled={completeReminderMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Done
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Today's Reminders */}
            {categorizedReminders.today.length > 0 && (
              <Card className="border-amber-200 bg-amber-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center text-amber-800">
                    <Clock className="w-5 h-5 mr-2" />
                    Today ({categorizedReminders.today.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {categorizedReminders.today.map((reminder) => (
                    <div key={reminder.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center">
                          {getActivityIcon(reminder.type)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{reminder.title}</p>
                          <p className="text-sm text-gray-600">{getPetName(reminder.petId)}</p>
                          <Badge variant="destructive" className="text-xs">Today</Badge>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleCompleteReminder(reminder.id)}
                        disabled={completeReminderMutation.isPending}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Done
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Upcoming Reminders */}
            {['tomorrow', 'this-week', 'this-month', 'later'].map(category => {
              const categoryReminders = categorizedReminders[category as keyof typeof categorizedReminders];
              if (categoryReminders.length === 0) return null;

              const categoryTitles = {
                tomorrow: 'Tomorrow',
                'this-week': 'This Week',
                'this-month': 'This Month',
                later: 'Later'
              };

              return (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-gray-900">
                      <Bell className="w-5 h-5 mr-2" />
                      {categoryTitles[category as keyof typeof categoryTitles]} ({categoryReminders.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {categoryReminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                            {getActivityIcon(reminder.type)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{reminder.title}</p>
                            <p className="text-sm text-gray-600">{getPetName(reminder.petId)}</p>
                            <Badge variant={getBadgeVariant(category)} className="text-xs">
                              {formatDateDisplay(reminder.dueDate!, category)}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCompleteReminder(reminder.id)}
                          disabled={completeReminderMutation.isPending}
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Done
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}

            {activeReminders.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">No upcoming reminders</h3>
                  <p className="text-gray-500 text-sm">
                    All caught up! Add medical records to create new reminders.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4 mt-6">
            {filteredCompletedReminders.length > 0 ? (
              <div className="space-y-3">
                {filteredCompletedReminders.map((reminder: Reminder) => (
                  <Card key={reminder.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-success/20 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-success" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{reminder.title}</p>
                          <p className="text-sm text-gray-600">{getPetName(reminder.petId)}</p>
                          <div className="space-y-1">
                            <Badge className="text-xs bg-success text-success-foreground">Completed</Badge>
                            {reminder.completedAt && (
                              <p className="text-xs text-gray-500">
                                Completed: {format(new Date(reminder.completedAt), "MMM d, yyyy 'at' h:mm a")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="font-medium text-gray-900 mb-2">No completed reminders</h3>
                  <p className="text-gray-500 text-sm">
                    Completed reminders will appear here.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation activeTab="schedule" />

      {/* Notification Dropdown */}
      <NotificationDropdown
        reminders={remindersWithPets}
        isOpen={showNotificationDropdown}
        onClose={handleCloseNotifications}
      />
    </div>
  );
}