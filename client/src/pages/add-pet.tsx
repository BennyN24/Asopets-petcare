import React, { useState, useEffect, useRef, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import {
  insertPetSchema,
  type InsertPet,
  type PetCategory,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ArrowLeft, Camera, Image, X } from "lucide-react";

const petCategories: { value: PetCategory; label: string; icon: any }[] = [
  {
    value: "dog",
    label: "Dogs",
    icon: () => <span className="text-lg">🐕</span>,
  },
  {
    value: "cat",
    label: "Cats",
    icon: () => <span className="text-lg">🐱</span>,
  },
  {
    value: "bird",
    label: "Birds",
    icon: () => <span className="text-lg">🐦</span>,
  },
  {
    value: "rabbit",
    label: "Rabbits",
    icon: () => <span className="text-lg">🐰</span>,
  },
  {
    value: "horse",
    label: "Horses",
    icon: () => <span className="text-lg">🐴</span>,
  },
  {
    value: "exotic",
    label: "Exotic",
    icon: () => <span className="text-lg">🦎</span>,
  },
  {
    value: "other",
    label: "Others",
    icon: () => <span className="text-lg">❤️</span>,
  },
];

export default function AddPet() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<PetCategory | null>(
    null,
  );
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<InsertPet>({
    resolver: zodResolver(insertPetSchema.omit({ userId: true })),
    defaultValues: {
      name: "",
      category: "",
      breed: "",
      dateOfBirth: "",
      age: undefined,
      microchipId: "",
      birthmarks: "",
      imageUrl: "",
    },
  });

  // Auto-save form data to localStorage
  const formValues = form.watch();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem("petFormDraft", JSON.stringify(formValues));
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [formValues]);

  // Load saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem("petFormDraft");
    if (savedDraft) {
      try {
        const draftData = JSON.parse(savedDraft);
        form.reset(draftData);
      } catch (error) {
        console.error("Failed to load draft:", error);
      }
    }
  }, [form]);

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Compress image before upload
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 800px width/height)
        const maxSize = 800;
        let { width, height } = img;

        if (width > height && width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        } else if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }

        canvas.width = width;
        canvas.height = height;

        ctx?.drawImage(img, 0, 0, width, height);

        // Convert to compressed JPEG
        const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setSelectedImage(compressedDataUrl);
        form.setValue("imageUrl", compressedDataUrl);
        setIsUploading(false);
      };

      img.src = URL.createObjectURL(file);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process image",
        variant: "destructive",
      });
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
    form.setValue("imageUrl", "");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (cameraInputRef.current) cameraInputRef.current.value = "";
  };

  const createPetMutation = useMutation({
    mutationFn: async (data: Omit<InsertPet, "userId">) => {
      await apiRequest("POST", "/api/pets", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      toast({
        title: "Success",
        description: "Pet profile created successfully!",
      });
      setLocation("/");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: Omit<InsertPet, "userId">) => {
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a pet category",
        variant: "destructive",
      });
      return;
    }

    // Validate birth date is not in the future
    if (data.dateOfBirth && new Date(data.dateOfBirth) > new Date()) {
      toast({
        title: "Error",
        description: "Birth date cannot be in the future",
        variant: "destructive",
      });
      return;
    }

    createPetMutation.mutate({
      ...data,
      category: selectedCategory,
    });
  };

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center">
          <button onClick={() => setLocation("/")} className="mr-4">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
            <h2 className="text-xl font-bold">Add New Pet</h2>
            <p className="text-white/80 text-sm">
              Create a complete profile for your pet
            </p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Pet Category Selection */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-3">
                Pet Category
              </Label>
              <div className="grid grid-cols-3 gap-3">
                {petCategories.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    className={`pet-category-btn ${selectedCategory === value ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedCategory(value);
                      form.setValue("category", value);
                    }}
                  >
                    <Icon className="w-6 h-6 text-gray-600 mb-2" />
                    <span className="text-sm font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Pet Photo Upload */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-3">
                Pet Photo
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
                    alt="Pet preview"
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
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleCameraCapture}
                    disabled={isUploading}
                    className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Take Photo</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleFileUpload}
                    disabled={isUploading}
                    className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-gray-50 transition-colors"
                  >
                    <Image className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm text-gray-600">Choose Photo</span>
                  </button>
                </div>
              )}

              {isUploading && (
                <div className="mt-2 text-center">
                  <span className="text-sm text-gray-500">
                    Processing image...
                  </span>
                </div>
              )}
            </div>

            {/* Pet Details Form */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pet Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter pet name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="breed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Breed</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter breed"
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
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} value={field.value || ""} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age (in months)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Enter age in months"
                        {...field}
                        value={field.value || ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value
                              ? parseInt(e.target.value)
                              : undefined,
                          )
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="microchipId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Microchip ID (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter microchip ID"
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
                name="birthmarks"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Birthmarks / Remarks</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter any distinctive marks or remarks"
                        className="h-24 resize-none"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white py-3 font-semibold hover:bg-green-600"
              disabled={createPetMutation.isPending}
            >
              {createPetMutation.isPending ? "Saving..." : "Save Pet Profile"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
