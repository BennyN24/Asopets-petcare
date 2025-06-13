import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  TrendingUp, 
  Calendar,
  PieChart,
  Receipt,
  Target,
  Syringe,
  PillBottle,
  Heart as MedicalKit,
  UserCog,
  Stethoscope
} from "lucide-react";
import { format, startOfYear, endOfYear, startOfMonth, endOfMonth, isThisYear, isThisMonth } from "date-fns";
import BottomNavigation from "@/components/bottom-navigation";
import type { Pet, MedicalRecord } from "@shared/schema";

export default function Expenses() {
  const { isAuthenticated } = useAuth();

  const { data: pets = [], isLoading: petsLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
    enabled: isAuthenticated,
  });

  // Fetch all medical records for expense calculation
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

  const getActivityIcon = (type: string) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case 'vaccine': return <Syringe {...iconProps} />;
      case 'deworming': return <PillBottle {...iconProps} />;
      case 'treatment': return <MedicalKit {...iconProps} />;
      case 'surgery': return <UserCog {...iconProps} />;
      case 'checkup': return <Stethoscope {...iconProps} />;
      default: return <Receipt {...iconProps} />;
    }
  };

  const parseAmount = (cost: string | null) => {
    if (!cost) return 0;
    const parsed = parseFloat(cost.replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const recordsWithCost = allMedicalRecords.filter(record => 
    record.cost && parseAmount(record.cost) > 0
  );

  // Calculate expenses
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  
  const yearlyExpenses = recordsWithCost
    .filter(record => isThisYear(new Date(record.dateAdministered)))
    .reduce((sum, record) => sum + parseAmount(record.cost), 0);
  
  const monthlyExpenses = recordsWithCost
    .filter(record => isThisMonth(new Date(record.dateAdministered)))
    .reduce((sum, record) => sum + parseAmount(record.cost), 0);

  // Calculate expenses by category
  const expensesByType = recordsWithCost
    .filter(record => isThisYear(new Date(record.dateAdministered)))
    .reduce((acc, record) => {
      const type = record.type;
      acc[type] = (acc[type] || 0) + parseAmount(record.cost);
      return acc;
    }, {} as Record<string, number>);

  // Calculate expenses by pet
  const expensesByPet = recordsWithCost
    .filter(record => isThisYear(new Date(record.dateAdministered)))
    .reduce((acc, record) => {
      const pet = pets.find(p => p.id === record.petId);
      const petName = pet?.name || 'Unknown';
      acc[petName] = (acc[petName] || 0) + parseAmount(record.cost);
      return acc;
    }, {} as Record<string, number>);

  // Monthly breakdown for current year
  const monthlyBreakdown = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(currentYear, i, 1);
    const monthExpenses = recordsWithCost
      .filter(record => {
        const recordDate = new Date(record.dateAdministered);
        return recordDate.getFullYear() === currentYear && recordDate.getMonth() === i;
      })
      .reduce((sum, record) => sum + parseAmount(record.cost), 0);
    
    return {
      month: format(month, 'MMM'),
      amount: monthExpenses,
    };
  });

  // Budget tracking (simple target: $100/month per pet)
  const monthlyBudget = pets.length * 100;
  const budgetUsed = monthlyExpenses > 0 ? (monthlyExpenses / monthlyBudget) * 100 : 0;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccine': return 'bg-green-100 text-green-800';
      case 'deworming': return 'bg-blue-100 text-blue-800';
      case 'treatment': return 'bg-amber-100 text-amber-800';
      case 'surgery': return 'bg-red-100 text-red-800';
      case 'checkup': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const sortedTypeExpenses = Object.entries(expensesByType)
    .sort(([,a], [,b]) => b - a);
  
  const sortedPetExpenses = Object.entries(expensesByPet)
    .sort(([,a], [,b]) => b - a);

  if (petsLoading) {
    return (
      <div className="mobile-container">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading expenses...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mobile-container pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center">
          <DollarSign className="w-6 h-6 mr-3" />
          <div>
            <h1 className="text-xl font-bold">Expenses</h1>
            <p className="text-green-100 text-sm">
              {formatCurrency(yearlyExpenses)} spent this year
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
            <TabsTrigger value="budget">Budget</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(monthlyExpenses)}
                  </div>
                  <div className="text-sm text-gray-600">This Month</div>
                  <div className="flex items-center justify-center mt-1">
                    <Calendar className="w-3 h-3 text-secondary mr-1" />
                    <span className="text-xs text-secondary">
                      {format(new Date(), 'MMMM')}
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(yearlyExpenses)}
                  </div>
                  <div className="text-sm text-gray-600">This Year</div>
                  <div className="flex items-center justify-center mt-1">
                    <TrendingUp className="w-3 h-3 text-primary mr-1" />
                    <span className="text-xs text-primary">
                      {currentYear}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Expenses */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Receipt className="w-5 h-5 mr-2 text-secondary" />
                  Recent Expenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recordsWithCost.length > 0 ? (
                  <div className="space-y-3">
                    {recordsWithCost
                      .sort((a, b) => new Date(b.dateAdministered).getTime() - new Date(a.dateAdministered).getTime())
                      .slice(0, 5)
                      .map((record) => {
                        const pet = pets.find(p => p.id === record.petId);
                        return (
                          <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                {getActivityIcon(record.type)}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{record.title}</p>
                                <p className="text-sm text-gray-600">{pet?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(record.dateAdministered), "MMM d, yyyy")}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">
                                {formatCurrency(parseAmount(record.cost))}
                              </div>
                              <Badge className={`text-xs ${getTypeColor(record.type)}`}>
                                {record.type}
                              </Badge>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-6">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium">No expenses recorded</p>
                    <p className="text-sm">Add costs to medical records to track expenses</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="breakdown" className="space-y-4 mt-6">
            {/* By Category */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <PieChart className="w-5 h-5 mr-2 text-primary" />
                  By Category ({currentYear})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sortedTypeExpenses.length > 0 ? (
                  <div className="space-y-3">
                    {sortedTypeExpenses.map(([type, amount]) => (
                      <div key={type} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            {getActivityIcon(type)}
                          </div>
                          <span className="font-medium capitalize">{type}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(amount)}</div>
                          <div className="text-xs text-gray-500">
                            {yearlyExpenses > 0 ? Math.round((amount / yearlyExpenses) * 100) : 0}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No category data available</p>
                )}
              </CardContent>
            </Card>

            {/* By Pet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2 text-accent" />
                  By Pet ({currentYear})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {sortedPetExpenses.length > 0 ? (
                  <div className="space-y-3">
                    {sortedPetExpenses.map(([petName, amount]) => (
                      <div key={petName} className="flex items-center justify-between">
                        <span className="font-medium">{petName}</span>
                        <div className="text-right">
                          <div className="font-bold">{formatCurrency(amount)}</div>
                          <div className="text-xs text-gray-500">
                            {yearlyExpenses > 0 ? Math.round((amount / yearlyExpenses) * 100) : 0}%
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 py-4">No pet data available</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="budget" className="space-y-4 mt-6">
            {/* Monthly Budget */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Target className="w-5 h-5 mr-2 text-accent" />
                  Monthly Budget
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Budget</span>
                    <span className="font-bold">{formatCurrency(monthlyBudget)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Spent</span>
                    <span className="font-bold">{formatCurrency(monthlyExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Remaining</span>
                    <span className={`font-bold ${monthlyBudget - monthlyExpenses >= 0 ? 'text-success' : 'text-destructive'}`}>
                      {formatCurrency(monthlyBudget - monthlyExpenses)}
                    </span>
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Budget Usage</span>
                      <span>{Math.round(budgetUsed)}%</span>
                    </div>
                    <Progress 
                      value={Math.min(budgetUsed, 100)} 
                      className="h-2"
                    />
                    {budgetUsed > 100 && (
                      <p className="text-xs text-destructive mt-1">Over budget by {formatCurrency(monthlyExpenses - monthlyBudget)}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Monthly Trends */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <TrendingUp className="w-5 h-5 mr-2 text-primary" />
                  Monthly Trends ({currentYear})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {monthlyBreakdown.map((month, index) => {
                    const isCurrentMonth = index === currentMonth;
                    return (
                      <div key={month.month} className={`flex justify-between items-center p-2 rounded ${isCurrentMonth ? 'bg-primary/10' : ''}`}>
                        <span className={`font-medium ${isCurrentMonth ? 'text-primary' : ''}`}>
                          {month.month}
                        </span>
                        <span className={`font-bold ${isCurrentMonth ? 'text-primary' : ''}`}>
                          {formatCurrency(month.amount)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <BottomNavigation activeTab="expenses" />
    </div>
  );
}