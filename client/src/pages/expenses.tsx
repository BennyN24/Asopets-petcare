import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
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
  Stethoscope,
  Filter,
  Download,
  Plus,
  Search,
  ArrowUpDown,
  Edit,
  Trash2
} from "lucide-react";
import { format, startOfYear, endOfYear, startOfMonth, endOfMonth, isThisYear, isThisMonth, subMonths } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import BottomNavigation from "@/components/bottom-navigation";
import type { Pet, MedicalRecord } from "@shared/schema";

export default function Expenses() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterPet, setFilterPet] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [budgetGoal, setBudgetGoal] = useState(() => {
    const saved = localStorage.getItem('petBudgetGoal');
    return saved ? Number(saved) : 100;
  });
  const [isSettingBudget, setIsSettingBudget] = useState(false);

  // Save budget to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('petBudgetGoal', budgetGoal.toString());
  }, [budgetGoal]);

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

  // Budget tracking
  const monthlyBudget = pets.length * budgetGoal;
  const budgetUsed = monthlyExpenses > 0 ? (monthlyExpenses / monthlyBudget) * 100 : 0;

  // Filtered and sorted records
  const filteredRecords = recordsWithCost.filter(record => {
    const pet = pets.find(p => p.id === record.petId);
    const petName = pet?.name || '';
    
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (record.veterinarian && record.veterinarian.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = filterType === "all" || record.type === filterType;
    const matchesPet = filterPet === "all" || record.petId.toString() === filterPet;
    
    return matchesSearch && matchesType && matchesPet;
  }).sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'date':
        comparison = new Date(a.dateAdministered).getTime() - new Date(b.dateAdministered).getTime();
        break;
      case 'amount':
        comparison = parseAmount(a.cost) - parseAmount(b.cost);
        break;
      case 'pet':
        const petA = pets.find(p => p.id === a.petId)?.name || '';
        const petB = pets.find(p => p.id === b.petId)?.name || '';
        comparison = petA.localeCompare(petB);
        break;
      case 'type':
        comparison = a.type.localeCompare(b.type);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder === 'desc' ? -comparison : comparison;
  });

  // Export function
  const exportToCSV = () => {
    const headers = ['Date', 'Pet', 'Type', 'Title', 'Veterinarian', 'Clinic', 'Cost'];
    const csvData = filteredRecords.map(record => {
      const pet = pets.find(p => p.id === record.petId);
      return [
        format(new Date(record.dateAdministered), 'yyyy-MM-dd'),
        pet?.name || 'Unknown',
        record.type,
        record.title,
        record.veterinarian || '',
        record.clinic || '',
        parseAmount(record.cost).toFixed(2)
      ];
    });
    
    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pet-expenses-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Export Complete",
      description: "Expense data has been exported to CSV file.",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccine': return 'bg-green-100 text-green-800';
      case 'deworming': return 'bg-blue-100 text-blue-800';
      case 'treatment': return 'bg-amber-100 text-amber-800';
      case 'surgery': return 'bg-red-100 text-red-800';
      case 'checkup': return 'bg-purple-100 text-purple-800';
      case 'lab-test': return 'bg-cyan-100 text-cyan-800';
      case 'grooming': return 'bg-pink-100 text-pink-800';
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Expenses</h1>
            <p className="text-white/80 text-sm">
              {formatCurrency(yearlyExpenses)} spent this year
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-2"
              onClick={exportToCSV}
            >
              <Download className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">History</TabsTrigger>
            <TabsTrigger value="breakdown">Analytics</TabsTrigger>
            <TabsTrigger value="budget">Add Budget</TabsTrigger>
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

          <TabsContent value="transactions" className="space-y-4 mt-6">
            {/* Filter and Search Controls */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Transaction History</h3>
                    <Button variant="outline" size="sm" onClick={exportToCSV}>
                      <Download className="w-4 h-4 mr-2" />
                      Export CSV
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search transactions..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="vaccine">Vaccines</SelectItem>
                          <SelectItem value="deworming">Deworming</SelectItem>
                          <SelectItem value="treatment">Treatment</SelectItem>
                          <SelectItem value="surgery">Surgery</SelectItem>
                          <SelectItem value="checkup">Checkup</SelectItem>
                          <SelectItem value="lab-test">Lab Test</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={filterPet} onValueChange={setFilterPet}>
                        <SelectTrigger>
                          <SelectValue placeholder="All Pets" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Pets</SelectItem>
                          {pets.map(pet => (
                            <SelectItem key={pet.id} value={pet.id.toString()}>
                              {pet.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="flex-1">
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="amount">Amount</SelectItem>
                          <SelectItem value="pet">Pet</SelectItem>
                          <SelectItem value="type">Type</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                      >
                        <ArrowUpDown className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Transaction List */}
            <Card>
              <CardContent className="p-0">
                {filteredRecords.length > 0 ? (
                  <div className="divide-y">
                    {filteredRecords.map((record) => {
                      const pet = pets.find(p => p.id === record.petId);
                      return (
                        <div key={record.id} className="p-4 hover:bg-gray-50">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start space-x-3">
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                {getActivityIcon(record.type)}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <p className="font-medium text-gray-900">{record.title}</p>
                                  <Badge className={`text-xs ${getTypeColor(record.type)}`}>
                                    {record.type}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-600">{pet?.name}</p>
                                <p className="text-xs text-gray-500">
                                  {format(new Date(record.dateAdministered), 'MMM d, yyyy')}
                                </p>
                                {record.veterinarian && (
                                  <p className="text-xs text-gray-500">Dr. {record.veterinarian}</p>
                                )}
                                {record.clinic && (
                                  <p className="text-xs text-gray-500">{record.clinic}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-lg">{formatCurrency(parseAmount(record.cost))}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Receipt className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="font-medium">No transactions found</p>
                    <p className="text-sm">Try adjusting your search or filter criteria</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transaction Summary */}
            {filteredRecords.length > 0 && (
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-primary">
                        {filteredRecords.length}
                      </p>
                      <p className="text-sm text-gray-600">Transactions</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">
                        {formatCurrency(filteredRecords.reduce((sum, record) => sum + parseAmount(record.cost), 0))}
                      </p>
                      <p className="text-sm text-gray-600">Total Amount</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
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
            {/* Budget Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-accent" />
                    Budget Settings
                  </div>
                  <Dialog open={isSettingBudget} onOpenChange={setIsSettingBudget}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Set Monthly Budget</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="budget">Monthly Budget per Pet</Label>
                          <Input
                            id="budget"
                            type="number"
                            value={budgetGoal}
                            onChange={(e) => setBudgetGoal(Number(e.target.value))}
                            placeholder="100"
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            Total monthly budget: {formatCurrency(pets.length * budgetGoal)}
                          </p>
                        </div>
                        <Button 
                          className="w-full"
                          onClick={() => {
                            setIsSettingBudget(false);
                            toast({
                              title: "Budget Updated",
                              description: `Monthly budget set to ${formatCurrency(budgetGoal)} per pet`,
                            });
                          }}
                        >
                          Save Budget
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded">
                      <p className="text-sm text-gray-600">Per Pet</p>
                      <p className="text-lg font-bold">{formatCurrency(budgetGoal)}</p>
                    </div>
                    <div className="text-center p-3 bg-primary/10 rounded">
                      <p className="text-sm text-gray-600">Total Budget</p>
                      <p className="text-lg font-bold text-primary">{formatCurrency(monthlyBudget)}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Spent This Month</span>
                    <span className="font-bold">{formatCurrency(monthlyExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Remaining</span>
                    <span className={`font-bold ${monthlyBudget - monthlyExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
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
                      className={`h-3 ${budgetUsed > 90 ? 'bg-red-100' : budgetUsed > 75 ? 'bg-yellow-100' : 'bg-green-100'}`}
                    />
                    {budgetUsed > 100 && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-xs text-red-800">
                        Over budget by {formatCurrency(monthlyExpenses - monthlyBudget)}
                      </div>
                    )}
                    {budgetUsed > 75 && budgetUsed <= 100 && (
                      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs text-yellow-800">
                        Approaching budget limit ({Math.round(budgetUsed)}% used)
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spending by Pet */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <PieChart className="w-5 h-5 mr-2 text-primary" />
                  Pet Budget Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pets.map(pet => {
                    const petExpenses = recordsWithCost
                      .filter(record => record.petId === pet.id && isThisMonth(new Date(record.dateAdministered)))
                      .reduce((sum, record) => sum + parseAmount(record.cost), 0);
                    const petBudgetUsed = petExpenses > 0 ? (petExpenses / budgetGoal) * 100 : 0;
                    
                    return (
                      <div key={pet.id} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{pet.name}</span>
                          <span className="font-bold">{formatCurrency(petExpenses)}</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Budget: {formatCurrency(budgetGoal)}</span>
                          <span>{Math.round(petBudgetUsed)}%</span>
                        </div>
                        <Progress 
                          value={Math.min(petBudgetUsed, 100)} 
                          className="h-2"
                        />
                      </div>
                    );
                  })}
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