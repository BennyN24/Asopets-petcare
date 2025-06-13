import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { format, differenceInDays, isAfter, isBefore, addDays } from "date-fns";
import type { MedicalRecord, Reminder } from "@shared/schema";

interface HealthSummaryCardProps {
  medicalRecords: MedicalRecord[];
  reminders: Reminder[];
}

export default function HealthSummaryCard({ medicalRecords, reminders }: HealthSummaryCardProps) {
  const now = new Date();
  
  // Calculate health metrics
  const totalRecords = medicalRecords.length;
  const overdueReminders = reminders.filter(r => r.isOverdue && !r.isCompleted);
  const upcomingReminders = reminders.filter(r => 
    !r.isOverdue && 
    !r.isCompleted && 
    r.dueDate && 
    differenceInDays(new Date(r.dueDate), now) <= 30
  );
  
  // Latest records by type
  const recordsByType = medicalRecords.reduce((acc, record) => {
    if (!acc[record.type] || new Date(record.dateAdministered) > new Date(acc[record.type].dateAdministered)) {
      acc[record.type] = record;
    }
    return acc;
  }, {} as Record<string, MedicalRecord>);

  // Vaccination status
  const lastVaccine = recordsByType.vaccine;
  const vaccineStatus = lastVaccine 
    ? differenceInDays(now, new Date(lastVaccine.dateAdministered)) <= 365 
      ? "up-to-date" 
      : "due"
    : "missing";

  // Deworming status
  const lastDeworming = recordsByType.deworming;
  const dewormingStatus = lastDeworming 
    ? differenceInDays(now, new Date(lastDeworming.dateAdministered)) <= 90 
      ? "up-to-date" 
      : "due"
    : "missing";

  // Last checkup
  const lastCheckup = recordsByType.checkup;
  const checkupStatus = lastCheckup 
    ? differenceInDays(now, new Date(lastCheckup.dateAdministered)) <= 365 
      ? "recent" 
      : "overdue"
    : "needed";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "up-to-date":
      case "recent":
        return "bg-success text-success-foreground";
      case "due":
      case "overdue":
        return "bg-accent text-accent-foreground";
      case "missing":
      case "needed":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const formatStatusText = (status: string) => {
    switch (status) {
      case "up-to-date":
        return "Up to date";
      case "recent":
        return "Recent";
      case "due":
        return "Due soon";
      case "overdue":
        return "Overdue";
      case "missing":
        return "Not recorded";
      case "needed":
        return "Needed";
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-lg">
          <CheckCircle className="w-5 h-5 mr-2 text-primary" />
          Health Summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Status Overview */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{totalRecords}</div>
            <div className="text-xs text-gray-600">Total Records</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-destructive">{overdueReminders.length}</div>
            <div className="text-xs text-gray-600">Overdue Items</div>
          </div>
        </div>

        {/* Health Status Badges */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Vaccinations</span>
            <Badge className={getStatusColor(vaccineStatus)}>
              {formatStatusText(vaccineStatus)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Deworming</span>
            <Badge className={getStatusColor(dewormingStatus)}>
              {formatStatusText(dewormingStatus)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Last Checkup</span>
            <Badge className={getStatusColor(checkupStatus)}>
              {formatStatusText(checkupStatus)}
            </Badge>
          </div>
        </div>

        {/* Upcoming Reminders */}
        {upcomingReminders.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center mb-2">
              <Clock className="w-4 h-4 mr-2 text-accent" />
              <span className="text-sm font-medium">Upcoming (Next 30 days)</span>
            </div>
            <div className="space-y-1">
              {upcomingReminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">{reminder.title}</span>
                  <span className="text-accent font-medium">
                    {reminder.dueDate && format(new Date(reminder.dueDate), "MMM d")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Critical Alerts */}
        {overdueReminders.length > 0 && (
          <div className="border-t pt-3">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-4 h-4 mr-2 text-destructive" />
              <span className="text-sm font-medium text-destructive">Needs Attention</span>
            </div>
            <div className="space-y-1">
              {overdueReminders.slice(0, 3).map((reminder) => (
                <div key={reminder.id} className="text-xs text-destructive">
                  {reminder.title}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}