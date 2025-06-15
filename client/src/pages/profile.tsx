import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import type { Pet, MedicalRecord, Reminder } from "@shared/schema";

interface UserProfile {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  dateOfBirth?: string;
  emergencyContact?: string;
  emergencyPhone?: string;
  preferredLanguage?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    reminders: boolean;
  };
}

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState<UserProfile>({
    id: "",
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    country: "Philippines",
    dateOfBirth: "",
    emergencyContact: "",
    emergencyPhone: "",
    preferredLanguage: "en",
    notificationPreferences: {
      email: true,
      sms: false,
      push: true,
      reminders: true
    }
  });

  // Initialize profile data when user loads
  useEffect(() => {
    if (user) {
      setProfileData({
        id: user.id || "",
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        phone: user.phone || "",
        address: user.address || "",
        city: user.city || "",
        country: user.country || "Philippines",
        dateOfBirth: user.dateOfBirth || "",
        emergencyContact: user.emergencyContact || "",
        emergencyPhone: user.emergencyPhone || "",
        preferredLanguage: user.preferredLanguage || "en",
        notificationPreferences: user.notificationPreferences || {
          email: true,
          sms: false,
          push: true,
          reminders: true
        }
      });
    }
  }, [user]);

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

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: Partial<UserProfile>) => {
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
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive"
      });
    }
  });

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

  const handleSaveProfile = () => {
    updateProfileMutation.mutate(profileData);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNotificationChange = (type: keyof UserProfile['notificationPreferences'], value: boolean) => {
    setProfileData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences!,
        [type]: value
      }
    }));
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
                  {profileData.firstName && profileData.lastName 
                    ? `${profileData.firstName} ${profileData.lastName}` 
                    : profileData.firstName || "Pet Owner"}
                </h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{profileData.email || 'Not available'}</span>
                </div>
                {profileData.phone && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <Phone className="w-4 h-4 mr-2" />
                    <span className="text-sm">{profileData.phone}</span>
                  </div>
                )}
                {profileData.city && (
                  <div className="flex items-center text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span className="text-sm">{profileData.city}, {profileData.country}</span>
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
                    Edit Profile
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="flex items-center">
                      <UserCircle className="w-5 h-5 mr-2" />
                      Edit Profile Information
                    </DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-6">
                    {/* Personal Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={profileData.firstName || ""}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                            placeholder="Enter your first name"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={profileData.lastName || ""}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                            placeholder="Enter your last name"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="dateOfBirth">Date of Birth</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileData.dateOfBirth || ""}
                          onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Contact Information</h3>
                      
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={profileData.phone || ""}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          placeholder="+63 912 345 6789"
                        />
                      </div>

                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Textarea
                          id="address"
                          value={profileData.address || ""}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          placeholder="Enter your complete address"
                          className="min-h-[80px]"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={profileData.city || ""}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            placeholder="Enter your city"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="country">Country</Label>
                          <Select 
                            value={profileData.country} 
                            onValueChange={(value) => handleInputChange('country', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select country" />
                            </SelectTrigger>
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
                        </div>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Emergency Contact</h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="emergencyContact">Emergency Contact Name</Label>
                          <Input
                            id="emergencyContact"
                            value={profileData.emergencyContact || ""}
                            onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                            placeholder="Enter emergency contact name"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="emergencyPhone">Emergency Phone Number</Label>
                          <Input
                            id="emergencyPhone"
                            value={profileData.emergencyPhone || ""}
                            onChange={(e) => handleInputChange('emergencyPhone', e.target.value)}
                            placeholder="+63 912 345 6789"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Preferences */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-900">Preferences</h3>
                      
                      <div>
                        <Label htmlFor="preferredLanguage">Preferred Language</Label>
                        <Select 
                          value={profileData.preferredLanguage} 
                          onValueChange={(value) => handleInputChange('preferredLanguage', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="tl">Filipino</SelectItem>
                            <SelectItem value="es">Spanish</SelectItem>
                            <SelectItem value="zh">Chinese</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Notification Preferences */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Notification Preferences</Label>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <Label htmlFor="email-notifications" className="text-sm">Email Notifications</Label>
                            <Switch
                              id="email-notifications"
                              checked={profileData.notificationPreferences?.email || false}
                              onCheckedChange={(checked) => handleNotificationChange('email', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="sms-notifications" className="text-sm">SMS Notifications</Label>
                            <Switch
                              id="sms-notifications"
                              checked={profileData.notificationPreferences?.sms || false}
                              onCheckedChange={(checked) => handleNotificationChange('sms', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="push-notifications" className="text-sm">Push Notifications</Label>
                            <Switch
                              id="push-notifications"
                              checked={profileData.notificationPreferences?.push || false}
                              onCheckedChange={(checked) => handleNotificationChange('push', checked)}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <Label htmlFor="reminder-notifications" className="text-sm">Medical Reminders</Label>
                            <Switch
                              id="reminder-notifications"
                              checked={profileData.notificationPreferences?.reminders || false}
                              onCheckedChange={(checked) => handleNotificationChange('reminders', checked)}
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
                        onClick={handleSaveProfile}
                        disabled={updateProfileMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-2" />
                        {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </div>
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

            {overdueReminders > 0 && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center text-destructive">
                  <Bell className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    {overdueReminders} overdue reminder{overdueReminders !== 1 ? 's' : ''} need attention
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Heart className="w-5 h-5 mr-2 text-primary" />
              Financial Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-3xl font-bold text-primary">{formatCurrency(totalExpenses)}</div>
              <div className="text-sm text-gray-600 mt-1">Total Pet Care Expenses</div>
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Average per pet: {formatCurrency(pets.length > 0 ? totalExpenses / pets.length : 0)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2 text-primary" />
              Account Settings
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
            
            <Separator />
            
            <Button 
              variant="destructive" 
              className="w-full justify-start" 
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