import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  Heart,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Edit,
  LogOut,
  Trash2,
  Download,
  Upload,
  Save,
  X,
  Globe,
  UserCircle,
  ContactRound
} from "lucide-react";
import { format } from "date-fns";
import BottomNavigation from "@/components/bottom-navigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { updateUserSchema, type UpdateUser } from "@shared/schema";
import type { Pet, MedicalRecord, Reminder, User as UserType } from "@shared/schema";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Profile form
  const form = useForm<UpdateUser>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      firstName: (user as UserType)?.firstName || "",
      lastName: (user as UserType)?.lastName || "",
      phone: (user as UserType)?.phone || "",
      address: (user as UserType)?.address || "",
      city: (user as UserType)?.city || "",
      country: (user as UserType)?.country || "Philippines",
      dateOfBirth: (user as UserType)?.dateOfBirth || "",
      emergencyContact: (user as UserType)?.emergencyContact || "",
      emergencyPhone: (user as UserType)?.emergencyPhone || "",
      preferredLanguage: (user as UserType)?.preferredLanguage || "en",
      notificationPreferences: (user as UserType)?.notificationPreferences || {
        email: true,
        sms: false,
        push: true,
        reminders: true
      }
    }
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateUser) => {
      const response = await fetch("/api/auth/user", {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditingProfile(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    }
  });

  const onSubmitProfile = (data: UpdateUser) => {
    updateProfileMutation.mutate(data);
  };

  const { data: pets = [] } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
    enabled: isAuthenticated,
  });

  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: ["/api/reminders"],
    enabled: isAuthenticated,
  });

  // Fetch all medical records for statistics
  const allMedicalRecordsQueries = useQuery({
    queryKey: ["/api/medical-records/all"],
    queryFn: async () => {
      const allRecords: MedicalRecord[] = [];
      for (const pet of pets) {
        const response = await fetch(`/api/pets/${pet.id}/medical-records`);
        if (response.ok) {
          const records = await response.json();
          allRecords.push(...records);
        }
      }
      return allRecords;
    },
    enabled: isAuthenticated && pets.length > 0,
  });

  const allMedicalRecords = allMedicalRecordsQueries.data || [];

  // Calculate user statistics
  const totalRecords = allMedicalRecords.length;
  const totalReminders = reminders.length;
  const completedReminders = reminders.filter(r => r.isCompleted).length;
  const overdueReminders = reminders.filter(r => r.isOverdue && !r.isCompleted).length;

  // Calculate total expenses
  const totalExpenses = allMedicalRecords
    .filter(record => record.cost && !isNaN(parseFloat(record.cost)))
    .reduce((sum, record) => sum + parseFloat(record.cost!), 0);

  // Calculate account age (mock data since we don't have registration date)
  const accountAge = "2+ years"; // This would come from user registration date

  const handleLogout = () => {
    toast({
      title: "Logging out",
      description: "Redirecting to login page...",
    });
    setTimeout(() => {
      window.location.href = "/api/logout";
    }, 1000);
  };

  const handleExportData = () => {
    const exportData = {
      pets,
      medicalRecords: allMedicalRecords,
      reminders,
      exportDate: new Date().toISOString(),
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `pet-care-data-${format(new Date(), 'yyyy-MM-dd')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data exported",
      description: "Your pet care data has been downloaded.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  if (!isAuthenticated) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center">
          <User className="w-6 h-6 mr-3" />
          <div>
            <h1 className="text-xl font-bold">Profile</h1>
            <p className="text-green-100 text-sm">
              Account & Settings
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.firstName || "Pet Owner"}
                </h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{user?.email || 'Not available'}</span>
                </div>
                {user?.phone && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                {user?.city && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{user.city}, {user.country || 'Philippines'}</span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Member since {accountAge}</span>
                </div>
              </div>
              <Dialog open={isEditingProfile} onOpenChange={setIsEditingProfile}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <UserCircle className="w-5 h-5 mr-2" />
                      Edit Profile
                    </DialogTitle>
                  </DialogHeader>
                  
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitProfile)} className="space-y-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter your first name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="lastName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Last Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter your last name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <Input {...field} type="date" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      {/* Contact Information */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                        
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="+63 912 345 6789" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Address</FormLabel>
                              <FormControl>
                                <Textarea {...field} placeholder="Enter your complete address" className="min-h-[80px]" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="city"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>City</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter your city" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="country"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Country</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select country" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="Philippines">Philippines</SelectItem>
                                    <SelectItem value="United States">United States</SelectItem>
                                    <SelectItem value="Canada">Canada</SelectItem>
                                    <SelectItem value="Australia">Australia</SelectItem>
                                    <SelectItem value="United Kingdom">United Kingdom</SelectItem>
                                    <SelectItem value="Singapore">Singapore</SelectItem>
                                    <SelectItem value="Malaysia">Malaysia</SelectItem>
                                    <SelectItem value="Thailand">Thailand</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Emergency Contact */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="emergencyContact"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Emergency Contact Name</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="Enter emergency contact name" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          
                          <FormField
                            control={form.control}
                            name="emergencyPhone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Emergency Phone Number</FormLabel>
                                <FormControl>
                                  <Input {...field} placeholder="+63 912 345 6789" />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Preferences */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
                        
                        <FormField
                          control={form.control}
                          name="preferredLanguage"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preferred Language</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select language" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="en">English</SelectItem>
                                  <SelectItem value="tl">Filipino</SelectItem>
                                  <SelectItem value="es">Spanish</SelectItem>
                                  <SelectItem value="zh">Chinese</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Notification Preferences */}
                        <div className="space-y-3">
                          <Label className="text-sm font-medium">Notification Preferences</Label>
                          
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
                              <Switch
                                id="email-notifications"
                                checked={form.watch("notificationPreferences.email")}
                                onCheckedChange={(checked) => 
                                  form.setValue("notificationPreferences.email", checked)
                                }
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Label htmlFor="sms-notifications" className="text-sm">SMS Notifications</Label>
                              <Switch
                                id="sms-notifications"
                                checked={form.watch("notificationPreferences.sms")}
                                onCheckedChange={(checked) => 
                                  form.setValue("notificationPreferences.sms", checked)
                                }
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Label htmlFor="push-notifications" className="text-sm">Push Notifications</Label>
                              <Switch
                                id="push-notifications"
                                checked={form.watch("notificationPreferences.push")}
                                onCheckedChange={(checked) => 
                                  form.setValue("notificationPreferences.push", checked)
                                }
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Label htmlFor="reminder-notifications" className="text-sm">Medical Reminders</Label>
                              <Switch
                                id="reminder-notifications"
                                checked={form.watch("notificationPreferences.reminders")}
                                onCheckedChange={(checked) => 
                                  form.setValue("notificationPreferences.reminders", checked)
                                }
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsEditingProfile(false)}
                        >
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </Button>
                        <Button 
                          type="submit" 
                          disabled={updateProfileMutation.isPending}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Shield className="w-5 h-5 mr-2 text-primary" />
              Account Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-primary">{pets.length}</div>
                <div className="text-sm text-gray-600">Pets Registered</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary">{totalRecords}</div>
                <div className="text-sm text-gray-600">Medical Records</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-accent">{totalReminders}</div>
                <div className="text-sm text-gray-600">Total Reminders</div>
              </div>
              
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-success">{completedReminders}</div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>

            {totalExpenses > 0 && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Heart className="w-5 h-5 text-green-600 mr-2" />
                    <span className="font-medium text-green-800">Total Care Investment</span>
                  </div>
                  <span className="text-lg font-bold text-green-800">
                    {formatCurrency(totalExpenses)}
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Amount invested in your pets' health and wellbeing
                </p>
              </div>
            )}

            {overdueReminders > 0 && (
              <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <Bell className="w-4 h-4 text-red-600 mr-2" />
                  <span className="text-sm font-medium text-red-800">
                    {overdueReminders} overdue reminder{overdueReminders !== 1 ? 's' : ''} need attention
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* App Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-gray-600" />
              App Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Bell className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium">Notifications</p>
                  <p className="text-sm text-gray-500">Reminder alerts and updates</p>
                </div>
              </div>
              <Badge variant="outline">Enabled</Badge>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-gray-600 mr-3" />
                <div>
                  <p className="font-medium">Data Privacy</p>
                  <p className="text-sm text-gray-500">Secure data handling</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-success text-success-foreground">Protected</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Download className="w-5 h-5 mr-2 text-gray-600" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={handleExportData}
            >
              <Download className="w-4 h-4 mr-2" />
              Export My Data
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start"
              disabled
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data (Coming Soon)
            </Button>
            
            <Button 
              variant="outline" 
              className="w-full justify-start text-destructive hover:text-destructive"
              disabled
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account (Coming Soon)
            </Button>
          </CardContent>
        </Card>

        {/* Support & Help */}
        <Card>
          <CardHeader>
            <CardTitle>Support & Help</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" disabled>
              <Phone className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
            
            <Button variant="outline" className="w-full justify-start" disabled>
              <Heart className="w-4 h-4 mr-2" />
              Help Center
            </Button>
          </CardContent>
        </Card>

        {/* Logout */}
        <Card>
          <CardContent className="p-4">
            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </CardContent>
        </Card>
      </div>

      <BottomNavigation activeTab="profile" />
    </div>
  );
}