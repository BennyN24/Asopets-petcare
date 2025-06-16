import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertMedicalRecordSchema, type InsertMedicalRecord, type MedicalRecordType } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Camera, Upload, Bell, X, Image } from "lucide-react";
import { useState, useRef } from "react";

interface ExtraField {
  name: keyof InsertMedicalRecord;
  label: string;
  type: "text" | "textarea" | "date" | "select";
  placeholder?: string;
  options?: string[];
}

interface MedicalRecordFormProps {
  title: string;
  petId: number;
  recordType: MedicalRecordType;
  typeOptions: string[];
  defaultValues: InsertMedicalRecord;
  extraFields?: ExtraField[];
  onCancel: () => void;
  onSuccess: () => void;
}

export default function MedicalRecordForm({
  title,
  petId,
  recordType,
  typeOptions,
  defaultValues,
  extraFields = [],
  onCancel,
  onSuccess,
}: MedicalRecordFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<InsertMedicalRecord>({
    resolver: zodResolver(insertMedicalRecordSchema),
    defaultValues,
  });

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setSelectedImage(dataUrl);
        form.setValue('imageUrl', dataUrl);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCameraCapture = () => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  };

  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const removeSelectedImage = () => {
    setSelectedImage(null);
    form.setValue('imageUrl', '');
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const createRecordMutation = useMutation({
    mutationFn: async (data: InsertMedicalRecord) => {
      // Check if online - if not, save to offline storage
      if (!navigator.onLine) {
        const { OfflineStorage } = await import("@/lib/offline-storage");
        const offlineId = OfflineStorage.saveRecord(data);
        return { id: offlineId, offline: true };
      }
      
      try {
        await apiRequest("POST", `/api/pets/${petId}/medical-records`, data);
        return { offline: false };
      } catch (error) {
        // If API fails, save offline as fallback
        const { OfflineStorage } = await import("@/lib/offline-storage");
        const offlineId = OfflineStorage.saveRecord(data);
        return { id: offlineId, offline: true };
      }
    },
    onSuccess: (result) => {
      if (result?.offline) {
        toast({
          title: "Saved Offline",
          description: `${recordType.charAt(0).toUpperCase() + recordType.slice(1)} record saved offline. Will sync when online.`,
          variant: "default",
        });
      } else {
        queryClient.invalidateQueries({ queryKey: ["/api/pets", petId, "medical-records"] });
        queryClient.invalidateQueries({ queryKey: ["/api/pets", petId, "reminders"] });
        queryClient.invalidateQueries({ queryKey: ["/api/reminders"] });
        toast({
          title: "Success",
          description: `${recordType.charAt(0).toUpperCase() + recordType.slice(1)} record saved successfully!`,
        });
      }
      onSuccess();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertMedicalRecord) => {
    createRecordMutation.mutate(data);
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center">
          <button onClick={onCancel} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h2 className="text-xl font-bold">{title}</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{recordType.charAt(0).toUpperCase() + recordType.slice(1)} Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${recordType} type`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {typeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Photo Upload - Moved below record type */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-3">
                  Upload Certificate/Record Photo
                </Label>
                
                {/* Hidden file inputs */}
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                  className="hidden"
                />

                {selectedImage ? (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Medical record preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={removeSelectedImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button" 
                      onClick={handleCameraCapture}
                      disabled={isUploading}
                      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
                    >
                      <Camera className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Take Photo</span>
                    </button>
                    <button 
                      type="button" 
                      onClick={handleFileUpload}
                      disabled={isUploading}
                      className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
                    >
                      <Image className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-600">Choose Photo</span>
                    </button>
                  </div>
                )}
                
                {isUploading && (
                  <div className="mt-2 text-center">
                    <span className="text-sm text-gray-500">Processing image...</span>
                  </div>
                )}
              </div>

              <FormField
                control={form.control}
                name="dateAdministered"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date Administered</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nextDueDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Next Due Date (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="veterinarian"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Veterinarian/Clinic</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter vet name or clinic" 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Extra Fields */}
              {extraFields.map((extraField) => (
                <FormField
                  key={extraField.name}
                  control={form.control}
                  name={extraField.name}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{extraField.label}</FormLabel>
                      <FormControl>
                        {extraField.type === "textarea" ? (
                          <Textarea 
                            placeholder={extraField.placeholder}
                            {...field}
                            value={String(field.value || "")}
                          />
                        ) : (
                          <Input 
                            type={extraField.type}
                            placeholder={extraField.placeholder}
                            {...field}
                            value={String(field.value || "")}
                          />
                        )}
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}



              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Any additional notes or reactions"
                        className="h-24 resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reminder Settings */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start">
                  <Bell className="text-secondary mr-3 mt-1 w-5 h-5" />
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-900">Reminder Settings</p>
                    
                    <FormField
                      control={form.control}
                      name="reminderEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              Send reminder 1 day before due date
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reminderSms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value || false}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              Send SMS reminder 1 hour before due date
                            </FormLabel>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                type="button"
                variant="outline"
                className="flex-1"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="flex-1 bg-primary text-white hover:bg-green-600"
                disabled={createRecordMutation.isPending}
              >
                {createRecordMutation.isPending ? "Saving..." : "Save Record"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
