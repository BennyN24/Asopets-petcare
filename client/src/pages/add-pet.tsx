import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { insertPetSchema, type InsertPet, type PetCategory } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ArrowLeft, Camera, Image, Dog, Cat, Bird, Rabbit, Heart } from "lucide-react";

const petCategories: { value: PetCategory; label: string; icon: any }[] = [
  { value: "dog", label: "Dogs", icon: Dog },
  { value: "cat", label: "Cats", icon: Cat },
  { value: "bird", label: "Birds", icon: Bird },
  { value: "rabbit", label: "Rabbits", icon: Rabbit },
  { value: "other", label: "Others", icon: Heart },
];

export default function AddPet() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedCategory, setSelectedCategory] = useState<PetCategory | null>(null);

  const form = useForm<InsertPet>({
    resolver: zodResolver(insertPetSchema.omit({ userId: true })),
    defaultValues: {
      name: "",
      category: "",
      breed: "",
      dateOfBirth: "",
      microchipId: "",
      birthmarks: "",
      imageUrl: "",
    },
  });

  const createPetMutation = useMutation({
    mutationFn: async (data: Omit<InsertPet, 'userId'>) => {
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

  const onSubmit = (data: Omit<InsertPet, 'userId'>) => {
    if (!selectedCategory) {
      toast({
        title: "Error",
        description: "Please select a pet category",
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
          <h2 className="text-xl font-bold">Add New Pet</h2>
        </div>
      </div>

      <div className="p-4 space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Pet Category Selection */}
            <div>
              <Label className="block text-sm font-medium text-gray-700 mb-3">Pet Category</Label>
              <div className="grid grid-cols-3 gap-3">
                {petCategories.map(({ value, label, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    className={`pet-category-btn ${selectedCategory === value ? 'selected' : ''}`}
                    onClick={() => {
                      setSelectedCategory(value);
                      form.setValue('category', value);
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
              <Label className="block text-sm font-medium text-gray-700 mb-3">Pet Photo</Label>
              <div className="flex space-x-3">
                <button type="button" className="photo-upload-btn">
                  <Camera className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Take Photo</span>
                </button>
                <button type="button" className="photo-upload-btn">
                  <Image className="w-6 h-6 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Choose Photo</span>
                </button>
              </div>
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
                      <Input placeholder="Enter breed" {...field} />
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
                      <Input type="date" {...field} />
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
                      <Input placeholder="Enter microchip ID" {...field} />
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
