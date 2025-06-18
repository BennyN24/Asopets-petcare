import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Plus, Heart } from "lucide-react";
import QRScanner from "@/components/qr-scanner";
import type { Pet } from "@shared/schema";

export default function Dashboard() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [scannedPetData, setScannedPetData] = useState<any>(null);

  const handleQRScanSuccess = async (data: any) => {
    try {
      const response = await fetch(`/api/pets/public/${data.petId}`);
      if (!response.ok) {
        throw new Error('Pet not found or access denied');
      }

      const petData = await response.json();
      
      if (petData) {
        setScannedPetData(petData);
        
        toast({
          title: "Pet Scanned Successfully!",
          description: `Found ${petData.name} - ${petData.breed}`,
        });
      }
    } catch (error) {
      toast({
        title: "Scan Error",
        description: "Failed to load pet information",
        variant: "destructive",
      });
    }
  };

  // Handle authentication redirect
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = "/";
      return;
    }
  }, [isAuthenticated, isLoading]);

  const { data: pets = [], isLoading: petsLoading } = useQuery<Pet[]>({
    queryKey: ["/api/pets"],
    enabled: !!user,
  });

  if (isLoading || petsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.firstName || "Pet Parent"}!
            </h1>
            <p className="text-gray-600 mt-1">
              Your pets are counting on you 🐾
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              onClick={() => setLocation("/add-pet")}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Pet
            </Button>
            <Button 
              onClick={() => setShowQRScanner(true)}
              variant="outline"
            >
              <QrCode className="h-4 w-4 mr-2" />
              QR Scanner
            </Button>
          </div>
        </div>

        {/* Pet Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              Your Pets ({pets.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">No pets added yet</p>
                <Button onClick={() => setLocation("/add-pet")}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Pet
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {pets.map((pet) => (
                  <Card key={pet.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold">{pet.name}</h3>
                      <p className="text-sm text-gray-600">{pet.breed}</p>
                      <p className="text-xs text-gray-500">{pet.category}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Scanned Pet Data Display */}
        {scannedPetData && (
          <Card>
            <CardHeader>
              <CardTitle>Scanned Pet Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{scannedPetData.name}</h3>
                <p className="text-gray-600">{scannedPetData.breed}</p>
                <p className="text-sm text-gray-500 capitalize">{scannedPetData.category}</p>
                {scannedPetData.microchipId && (
                  <p className="text-sm">Microchip: {scannedPetData.microchipId}</p>
                )}
                {scannedPetData.owner && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="font-medium">Owner Information</h4>
                    <p className="text-sm">{scannedPetData.owner.firstName} {scannedPetData.owner.lastName}</p>
                    <p className="text-sm">{scannedPetData.owner.email}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* QR Scanner Modal */}
        {showQRScanner && (
          <QRScanner
            onClose={() => setShowQRScanner(false)}
            onScanSuccess={handleQRScanSuccess}
          />
        )}
      </div>
    </div>
  );
}