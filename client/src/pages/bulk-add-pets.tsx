
import React, { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function BulkAddPets() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [csvData, setCsvData] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const bulkCreateMutation = useMutation({
    mutationFn: async (pets: any[]) => {
      const results = [];
      for (const pet of pets) {
        try {
          const result = await apiRequest("POST", "/api/pets", pet);
          results.push({ success: true, pet: pet.name, result });
        } catch (error) {
          results.push({ success: false, pet: pet.name, error: error.message });
        }
      }
      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      const successful = results.filter(r => r.success).length;
      const failed = results.filter(r => !r.success).length;
      
      toast({
        title: "Bulk Import Complete",
        description: `${successful} pets added successfully${failed > 0 ? `, ${failed} failed` : ''}`,
      });
      
      if (successful > 0) {
        setCsvData("");
        setLocation("/");
      }
    },
  });

  const processCsvData = () => {
    if (!csvData.trim()) {
      toast({
        title: "Error",
        description: "Please enter CSV data",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      const lines = csvData.trim().split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      
      const pets = lines.slice(1).map(line => {
        const values = line.split(',').map(v => v.trim());
        const pet: any = {};
        
        headers.forEach((header, index) => {
          const value = values[index] || "";
          switch (header.toLowerCase()) {
            case 'name':
              pet.name = value;
              break;
            case 'category':
              pet.category = value || 'other';
              break;
            case 'breed':
              pet.breed = value;
              break;
            case 'date_of_birth':
            case 'dateofbirth':
              pet.dateOfBirth = value;
              break;
            case 'age':
              pet.age = value ? parseInt(value) : 0;
              break;
            case 'microchip_id':
            case 'microchipid':
              pet.microchipId = value;
              break;
            case 'birthmarks':
            case 'notes':
              pet.birthmarks = value;
              break;
          }
        });
        
        return pet;
      }).filter(pet => pet.name); // Only include pets with names

      if (pets.length === 0) {
        throw new Error("No valid pets found in CSV data");
      }

      bulkCreateMutation.mutate(pets);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process CSV data: " + error.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = "name,category,breed,date_of_birth,age,microchip_id,birthmarks\nFluffy,cat,Persian,2020-01-15,48,,White patch on chest\nBuddy,dog,Golden Retriever,2019-05-20,60,123456789,Scar on left ear";
    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pet_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center">
          <button onClick={() => setLocation("/")} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">Bulk Add Pets</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Import Multiple Pets</CardTitle>
            <p className="text-sm text-gray-600">
              Add multiple pets at once using CSV format
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button
              variant="outline"
              onClick={downloadTemplate}
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>

            <div>
              <label className="text-sm font-medium">CSV Data</label>
              <Textarea
                placeholder="Paste your CSV data here..."
                value={csvData}
                onChange={(e) => setCsvData(e.target.value)}
                className="h-40 mt-2"
              />
            </div>

            <Button
              onClick={processCsvData}
              disabled={isProcessing || bulkCreateMutation.isPending}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isProcessing || bulkCreateMutation.isPending ? "Processing..." : "Import Pets"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV Format Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p><strong>Required columns:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>name - Pet's name</li>
                <li>category - dog, cat, bird, rabbit, horse, exotic, other</li>
              </ul>
              <p><strong>Optional columns:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>breed - Pet's breed</li>
                <li>date_of_birth - YYYY-MM-DD format</li>
                <li>age - Age in months</li>
                <li>microchip_id - Microchip identifier</li>
                <li>birthmarks - Notes or identifying marks</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
import React, { useState, useRef } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Upload, Download, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function BulkAddPets() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const bulkImportMutation = useMutation({
    mutationFn: async (pets: any[]) => {
      const results = [];
      for (const pet of pets) {
        try {
          const result = await apiRequest("POST", "/api/pets", pet);
          results.push({ success: true, pet: pet.name, result });
        } catch (error: any) {
          results.push({ success: false, pet: pet.name, error: error.message });
        }
      }
      return results;
    },
    onSuccess: (results) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      setResults(results);
      const successCount = results.filter(r => r.success).length;
      const errorCount = results.filter(r => !r.success).length;
      
      toast({
        title: "Import Complete",
        description: `${successCount} pets imported successfully${errorCount > 0 ? `, ${errorCount} errors` : ''}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
      toast({
        title: "Invalid File",
        description: "Please upload a CSV file",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        const pets = [];
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim());
          if (values.length === headers.length && values[0]) {
            const pet: any = {};
            headers.forEach((header, index) => {
              const key = header.toLowerCase().replace(/\s+/g, '');
              pet[key] = values[index] || '';
            });
            
            // Map common variations
            if (pet.petname) pet.name = pet.petname;
            if (pet.type) pet.category = pet.type;
            if (pet.birthdate) pet.dateOfBirth = pet.birthdate;
            if (pet.agemonths) pet.age = parseInt(pet.agemonths) || 0;
            
            pets.push(pet);
          }
        }
        
        if (pets.length === 0) {
          toast({
            title: "No Data Found",
            description: "No valid pet data found in the CSV file",
            variant: "destructive",
          });
          setIsProcessing(false);
          return;
        }
        
        bulkImportMutation.mutate(pets);
      } catch (error) {
        toast({
          title: "Parse Error",
          description: "Failed to parse CSV file. Please check the format.",
          variant: "destructive",
        });
      } finally {
        setIsProcessing(false);
      }
    };
    
    reader.readAsText(file);
  };

  const downloadTemplate = () => {
    const csvContent = "name,category,breed,dateOfBirth,age,microchipId,birthmarks\nFluffy,cat,Persian,2020-01-15,48,,White patch on chest\nBuddy,dog,Golden Retriever,2019-06-10,66,123456789,None";
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'asopets-template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="mobile-container">
      <div className="bg-primary text-white p-4">
        <div className="flex items-center">
          <button onClick={() => setLocation("/")} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Bulk Import Pets</h2>
            <p className="text-white/80 text-sm">Upload multiple pets from CSV</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload CSV File</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900">CSV Format Requirements</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    Your CSV should include columns: name, category, breed, dateOfBirth, age, microchipId, birthmarks
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={downloadTemplate}
              variant="outline"
              className="w-full"
            >
              <Download className="w-4 h-4 mr-2" />
              Download CSV Template
            </Button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />

            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing || bulkImportMutation.isPending}
              className="w-full"
            >
              <Upload className="w-4 h-4 mr-2" />
              {isProcessing ? "Processing..." : "Upload CSV File"}
            </Button>
          </CardContent>
        </Card>

        {results && (
          <Card>
            <CardHeader>
              <CardTitle>Import Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {results.map((result: any, index: number) => (
                  <div key={index} className={`p-2 rounded ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
                    <span className="font-medium">{result.pet}</span>: {result.success ? 'Success' : result.error}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
