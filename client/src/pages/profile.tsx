import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ContactRound,
  MessageSquare,
  Send,
} from "lucide-react";
import PhotoUpload from "@/components/photo-upload";
import { format } from "date-fns";
import BottomNavigation from "@/components/bottom-navigation";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
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
  profileImageUrl?: string;
  notificationPreferences?: {
    email: boolean;
    sms: boolean;
    push: boolean;
    reminders: boolean;
  };
}

const contactSupportSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

type ContactSupportData = z.infer<typeof contactSupportSchema>;

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
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
    profileImageUrl: "",
    notificationPreferences: {
      email: true,
      sms: false,
      push: true,
      reminders: true,
    },
  });

  // Initialize profile data when user loads
  useEffect(() => {
    if (user) {
      const userData = user as Record<string, any>;
      setProfileData({
        id: userData?.id || "",
        email: userData?.email || "",
        firstName: userData?.firstName || "",
        lastName: userData?.lastName || "",
        phone: userData?.phone || "",
        address: userData?.address || "",
        city: userData?.city || "",
        country: userData?.country || "Philippines",
        dateOfBirth: userData?.dateOfBirth || "",
        emergencyContact: userData?.emergencyContact || "",
        emergencyPhone: userData?.emergencyPhone || "",
        preferredLanguage: userData?.preferredLanguage || "en",
        profileImageUrl: userData?.profileImageUrl || "",
        notificationPreferences: userData?.notificationPreferences || {
          email: true,
          sms: false,
          push: true,
          reminders: true,
        },
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
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Failed to update profile");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/user"] });
      setIsEditingProfile(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Update failed",
        description: "Failed to update your profile. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Calculate user statistics
  const totalRecords = allMedicalRecords.length;
  const totalReminders = reminders.length;
  const completedReminders = reminders.filter((r) => r.isCompleted).length;
  const overdueReminders = reminders.filter(
    (r) => r.isOverdue && !r.isCompleted,
  ).length;

  // Calculate total expenses
  const totalExpenses = allMedicalRecords
    .filter((record) => record.cost && !isNaN(parseFloat(record.cost)))
    .reduce((sum, record) => sum + parseFloat(record.cost!), 0);

  // Calculate account age based on user registration date
  const calculateAccountAge = () => {
    const userData = user as any;
    if (!userData?.createdAt) return "New member";

    const registrationDate = new Date(userData.createdAt);
    const now = new Date();
    const diffInMs = now.getTime() - registrationDate.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays < 30) {
      return `${diffInDays} day${diffInDays !== 1 ? "s" : ""}`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months !== 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(diffInDays / 365);
      const remainingMonths = Math.floor((diffInDays % 365) / 30);
      if (remainingMonths === 0) {
        return `${years} year${years !== 1 ? "s" : ""}`;
      } else {
        return `${years}y ${remainingMonths}m`;
      }
    }
  };

  const accountAge = calculateAccountAge();

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
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `pet-care-data-${format(new Date(), "yyyy-MM-dd")}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Data exported",
      description: "Your pet care data has been downloaded.",
    });
  };

  const handleImportData = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);

          // Validate the data structure
          if (!data.pets || !Array.isArray(data.pets)) {
            throw new Error("Invalid data format");
          }

          toast({
            title: "Import successful",
            description: `Found ${data.pets.length} pets, ${data.medicalRecords?.length || 0} medical records, and ${data.reminders?.length || 0} reminders.`,
          });

          // Here you would typically upload this data to your server
          console.log("Imported data:", data);
        } catch (error) {
          toast({
            title: "Import failed",
            description: "The file format is invalid or corrupted.",
            variant: "destructive",
          });
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(amount);
  };

  const handleSaveProfile = async () => {
    try {
      // Filter out empty strings and null values
      const cleanData = Object.fromEntries(
        Object.entries({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          phone: profileData.phone,
          address: profileData.address,
          emergencyContact: profileData.emergencyContact,
          emergencyPhone: profileData.emergencyPhone,
          profileImageUrl: profileData.profileImageUrl,
        }).filter(
          ([key, value]) =>
            value !== "" && value !== null && value !== undefined,
        ),
      );

      await updateProfileMutation.mutateAsync(cleanData);
      setIsEditingProfile(false);
    } catch (error) {
      // Error is handled by the mutation's onError
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setProfileData((prev) => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences!,
        [type]: value,
      },
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
    <div className="mobile-container mobile-safe pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <User className="w-6 h-6 mr-3" />
            <div>
              <h1 className="text-xl font-bold">Profile</h1>
              <p className="text-white/80 text-sm">Account & Settings</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={handleExportData}
            >
              <Download className="w-5 h-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                {profileData.profileImageUrl ? (
                  <img
                    src={profileData.profileImageUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                  </div>
                )}
                {isEditingProfile && (
                  <div className="absolute -bottom-1 -right-1">
                    <PhotoUpload
                      onPhotoUploaded={(url: string) =>
                        handleInputChange("profileImageUrl", url)
                      }
                      currentPhoto={profileData.profileImageUrl}
                      className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-primary/90 transition-colors"
                    />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-900">
                  {profileData.firstName && profileData.lastName
                    ? `${profileData.firstName} ${profileData.lastName}`
                    : profileData.firstName || "Pet Owner"}
                </h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">
                    {profileData.email || "Not available"}
                  </span>
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
                    <span className="text-sm">
                      {profileData.city}, {profileData.country}
                    </span>
                  </div>
                )}
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Member since {accountAge}</span>
                </div>
                <Button
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  {isEditingProfile ? (
                    <>
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </>
                  ) : (
                    <>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Editing Form */}
        {isEditingProfile && (
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Profile Photo Upload */}
              <div className="flex flex-col items-center space-y-3">
                <div className="relative">
                  {profileData.profileImageUrl ? (
                    <img
                      src={profileData.profileImageUrl}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20">
                      <User className="w-12 h-12 text-primary" />
                    </div>
                  )}
                </div>
                <PhotoUpload
                  onPhotoUploaded={(url: string) =>
                    handleInputChange("profileImageUrl", url)
                  }
                  currentPhoto={profileData.profileImageUrl}
                  className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter first name"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    placeholder="Enter last name"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Enter phone number"
                />
              </div>

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profileData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Enter address"
                />
              </div>

              <Button
                onClick={handleSaveProfile}
                disabled={updateProfileMutation.isPending}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>
        )}

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
                <div className="text-2xl font-bold text-primary">
                  {pets.length}
                </div>
                <div className="text-sm text-gray-600">Pets Registered</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-secondary">
                  {totalRecords}
                </div>
                <div className="text-sm text-gray-600">Medical Records</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-accent">
                  {totalReminders}
                </div>
                <div className="text-sm text-gray-600">Total Reminders</div>
              </div>

              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-success">
                  {completedReminders}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
            </div>

            {overdueReminders > 0 && (
              <div className="mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center text-destructive">
                  <Bell className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    {overdueReminders} overdue reminder
                    {overdueReminders !== 1 ? "s" : ""} need attention
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
              <div className="text-3xl font-bold text-primary">
                {formatCurrency(totalExpenses)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Total Pet Care Expenses
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Average per pet:{" "}
                {formatCurrency(
                  pets.length > 0 ? totalExpenses / pets.length : 0,
                )}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Contact Support */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" />
              Contact Support
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showContactForm ? (
              <div className="text-center">
                <p className="text-sm text-gray-600 mb-4">
                  Need help? Have questions about your pet care management? 
                  Our support team is here to assist you.
                </p>
                <Button
                  onClick={() => setShowContactForm(true)}
                  className="w-full"
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Contact Support
                </Button>
              </div>
            ) : (
              <ContactSupportForm 
                userEmail={profileData.email || (user as any)?.email || ""}
                userName={`${profileData.firstName || ""} ${profileData.lastName || ""}`.trim() || "Pet Owner"}
                onSuccess={() => {
                  setShowContactForm(false);
                  toast({
                    title: "Message sent",
                    description: "Your support request has been sent successfully. We'll get back to you soon!",
                  });
                }}
                onCancel={() => setShowContactForm(false)}
              />
            )}
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

            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleImportData}
            >
              <Upload className="w-4 h-4 mr-2" />
              Import Data
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

interface ContactSupportFormProps {
  userEmail: string;
  userName: string;
  onSuccess: () => void;
  onCancel: () => void;
}

function ContactSupportForm({ userEmail, userName, onSuccess, onCancel }: ContactSupportFormProps) {
  const { toast } = useToast();
  const form = useForm<ContactSupportData>({
    resolver: zodResolver(contactSupportSchema),
    defaultValues: {
      subject: "",
      message: "",
    },
  });

  const submitSupportRequest = useMutation({
    mutationFn: async (data: ContactSupportData) => {
      await apiRequest("POST", "/api/support/contact", {
        ...data,
        userEmail,
        userName,
      });
    },
    onSuccess: () => {
      form.reset();
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to send support request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ContactSupportData) => {
    submitSupportRequest.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Input
                  placeholder="Brief description of your issue"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Please describe your issue in detail. Include any error messages or steps you've taken."
                  rows={5}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex space-x-2">
          <Button
            type="submit"
            disabled={submitSupportRequest.isPending}
            className="flex-1"
          >
            {submitSupportRequest.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={submitSupportRequest.isPending}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
