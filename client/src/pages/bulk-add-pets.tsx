import { useState } from "react";
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
      const successful = results.filter((r) => r.success).length;
      const failed = results.filter((r) => !r.success).length;

      toast({
        title: "Bulk Import Complete",
        description: `${successful} pets added successfully${failed > 0 ? `, ${failed} failed` : ""}`,
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
      const lines = csvData.trim().split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      const pets = lines
        .slice(1)
        .map((line) => {
          const values = line.split(",").map((v) => v.trim());
          const pet: any = {};

          headers.forEach((header, index) => {
            const value = values[index] || "";
            switch (header.toLowerCase()) {
              case "name":
                pet.name = value;
                break;
              case "category":
                pet.category = value || "other";
                break;
              case "breed":
                pet.breed = value;
                break;
              case "date_of_birth":
              case "dateofbirth":
                pet.dateOfBirth = value;
                break;
              case "age":
                pet.age = value ? parseInt(value) : 0;
                break;
              case "microchip_id":
              case "microchipid":
                pet.microchipId = value;
                break;
              case "birthmarks":
              case "notes":
                pet.birthmarks = value;
                break;
            }
          });

          return pet;
        })
        .filter((pet) => pet.name); // Only include pets with names

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
    const template =
      "name,category,breed,date_of_birth,age,microchip_id,birthmarks\nFluffy,cat,Persian,2020-01-15,48,,White patch on chest\nBuddy,dog,Golden Retriever,2019-05-20,60,123456789,Scar on left ear";
    const blob = new Blob([template], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pet_template.csv";
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
              {isProcessing || bulkCreateMutation.isPending
                ? "Processing..."
                : "Import Pets"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>CSV Format Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm space-y-2">
              <p>
                <strong>Required columns:</strong>
              </p>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                <li>name - Pet's name</li>
                <li>category - dog, cat, bird, rabbit, horse, exotic, other</li>
              </ul>
              <p>
                <strong>Optional columns:</strong>
              </p>
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
