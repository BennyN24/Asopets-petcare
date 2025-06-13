import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Upload
} from "lucide-react";
import { format } from "date-fns";
import BottomNavigation from "@/components/bottom-navigation";
import { useToast } from "@/hooks/use-toast";
import type { Pet, MedicalRecord, Reminder } from "@shared/schema";

export default function Profile() {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
                  Pet Owner
                </h2>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{user?.email || 'Not available'}</span>
                </div>
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span className="text-sm">Member since {accountAge}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
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