import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Calendar, 
  Shield, 
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign
} from "lucide-react";
import { format, differenceInMonths, isThisMonth, isThisYear } from "date-fns";
import type { Pet, MedicalRecord, Reminder } from "@shared/schema";

interface DashboardInsightsProps {
  pets: Pet[];
  allMedicalRecords: MedicalRecord[];
  reminders: Reminder[];
}

export default function DashboardInsights({ pets, allMedicalRecords, reminders }: DashboardInsightsProps) {
  const now = new Date();
  
  // Calculate health metrics
  const totalPets = pets.length;
  const activeReminders = reminders.filter(r => !r.isCompleted);
  const overdueReminders = reminders.filter(r => r.isOverdue && !r.isCompleted);
  const completedThisMonth = reminders.filter(r => 
    r.isCompleted && r.dueDate && isThisMonth(new Date(r.dueDate))
  );
  
  // Recent medical activity
  const recentRecords = allMedicalRecords.filter(record =>
    isThisMonth(new Date(record.dateAdministered))
  );
  
  // Cost tracking for this year
  const yearlyRecords = allMedicalRecords.filter(record =>
    isThisYear(new Date(record.dateAdministered))
  );
  const totalYearlyCost = yearlyRecords
    .filter(record => record.cost && !isNaN(parseFloat(record.cost)))
    .reduce((sum, record) => sum + parseFloat(record.cost!), 0);
  
  // Vaccination coverage
  const petsWithRecentVaccines = pets.filter(pet => {
    const lastVaccine = allMedicalRecords
      .filter(record => record.petId === pet.id && record.type === 'vaccine')
      .sort((a, b) => new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime())[0];
    
    if (!lastVaccine) return false;
    return differenceInMonths(now, new Date(lastVaccine.dateAdministered)) <= 12;
  });
  
  const vaccinationCoverage = totalPets > 0 ? (petsWithRecentVaccines.length / totalPets) * 100 : 0;

  // Health score calculation
  const calculateHealthScore = () => {
    if (totalPets === 0) return 100;
    
    let score = 100;
    
    // Deduct points for overdue reminders
    score -= (overdueReminders.length / totalPets) * 20;
    
    // Add points for completed tasks this month
    score += Math.min(completedThisMonth.length * 5, 20);
    
    // Deduct points for poor vaccination coverage
    if (vaccinationCoverage < 80) {
      score -= (80 - vaccinationCoverage) / 2;
    }
    
    return Math.max(0, Math.min(100, Math.round(score)));
  };

  const healthScore = calculateHealthScore();
  
  const getHealthScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 70) return "text-accent";
    return "text-destructive";
  };

  const getHealthScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 50) return "Fair";
    return "Needs Attention";
  };

  return (
    <div className="space-y-4">
      {/* Health Score Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center text-lg">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Health Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`text-3xl font-bold ${getHealthScoreColor(healthScore)}`}>
                {healthScore}%
              </div>
              <div className="text-sm text-gray-600">{getHealthScoreLabel(healthScore)}</div>
              <Progress value={healthScore} className="mt-2 h-2" />
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Vaccination Coverage</span>
                <span className="text-xs font-medium">{Math.round(vaccinationCoverage)}%</span>
              </div>
              <Progress value={vaccinationCoverage} className="h-1" />
              
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-600">Tasks Completed</span>
                <span className="text-xs font-medium">{completedThisMonth.length} this month</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div className="text-lg font-bold text-gray-900">{totalPets}</div>
            <div className="text-xs text-gray-600">Total Pets</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Clock className="w-4 h-4 text-accent" />
            </div>
            <div className="text-lg font-bold text-gray-900">{activeReminders.length}</div>
            <div className="text-xs text-gray-600">Active Reminders</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-3 text-center">
            <div className="flex items-center justify-center mb-1">
              <Calendar className="w-4 h-4 text-secondary" />
            </div>
            <div className="text-lg font-bold text-gray-900">{recentRecords.length}</div>
            <div className="text-xs text-gray-600">This Month</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Costs */}
      <div className="grid grid-cols-1 gap-4">
        {/* Recent Activity */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-secondary" />
                <span className="text-sm">Recent Activity</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {recentRecords.length} this month
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentRecords.length > 0 ? (
              <div className="space-y-2">
                {recentRecords.slice(0, 3).map((record) => {
                  const pet = pets.find(p => p.id === record.petId);
                  return (
                    <div key={record.id} className="flex items-center justify-between text-sm">
                      <div>
                        <span className="font-medium">{record.title}</span>
                        <span className="text-gray-500 ml-1">• {pet?.name}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {format(new Date(record.dateAdministered), "MMM d")}
                      </span>
                    </div>
                  );
                })}
                {recentRecords.length > 3 && (
                  <div className="text-xs text-gray-500 text-center pt-1">
                    +{recentRecords.length - 3} more records
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center text-gray-500 text-sm py-2">
                No recent activity
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cost Summary */}
        {totalYearlyCost > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center">
                <DollarSign className="w-4 h-4 mr-2 text-green-600" />
                <span className="text-sm">Yearly Expenses</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  ${totalYearlyCost.toFixed(2)}
                </div>
                <div className="text-xs text-gray-600">
                  {yearlyRecords.length} procedures in {now.getFullYear()}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Critical Alerts */}
      {overdueReminders.length > 0 && (
        <Card className="border-destructive bg-red-50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-destructive">
              <AlertTriangle className="w-4 h-4 mr-2" />
              <span className="text-sm">Needs Immediate Attention</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {overdueReminders.slice(0, 2).map((reminder) => {
                const pet = pets.find(p => p.id === reminder.petId);
                return (
                  <div key={reminder.id} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{reminder.title}</span>
                      <span className="text-gray-600 ml-1">• {pet?.name}</span>
                    </div>
                    <Badge variant="destructive" className="text-xs">Overdue</Badge>
                  </div>
                );
              })}
              {overdueReminders.length > 2 && (
                <div className="text-xs text-destructive text-center pt-1">
                  +{overdueReminders.length - 2} more overdue
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Success Message */}
      {overdueReminders.length === 0 && activeReminders.length > 0 && (
        <Card className="border-success bg-green-50">
          <CardContent className="p-3 text-center">
            <CheckCircle className="w-5 h-5 text-success mx-auto mb-1" />
            <div className="text-sm font-medium text-success">All up to date!</div>
            <div className="text-xs text-gray-600">No overdue reminders</div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}