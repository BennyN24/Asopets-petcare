import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertPetSchema, type Pet, type InsertPet, type PetCategory } from "@shared/schema";
import { Edit3, Dog, Cat, Bird, Rabbit, Heart } from "lucide-react";
import PhotoUpload from "./photo-upload";

const petCategories: { value: PetCategory; label: string; icon: any }[] = [
  { value: "dog", label: "Dog", icon: Dog },
  { value: "cat", label: "Cat", icon: Cat },
  { value: "bird", label: "Bird", icon: Bird },
  { value: "rabbit", label: "Rabbit", icon: Rabbit },
  { value: "horse", label: "Horse", icon: Heart },
  { value: "exotic", label: "Exotic", icon: Heart },
  { value: "other", label: "Other", icon: Heart },
];

interface PetEditFormProps {
  pet: Pet;
}

export default function PetEditForm({ pet }: PetEditFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertPet>({
    resolver: zodResolver(insertPetSchema.omit({ userId: true })),
    defaultValues: {
      name: pet?.name || "",
      category: pet?.category || "dog",
      breed: pet?.breed || "",
      dateOfBirth: pet?.dateOfBirth || "",
      age: pet?.age || 0,
      microchipId: pet?.microchipId || "",
      birthmarks: pet?.birthmarks || "",
      imageUrl: pet?.imageUrl || "",
    },
  });

  // Reset form when pet data changes
  React.useEffect(() => {
    if (pet && pet.id) {
      form.reset({
        name: pet.name || "",
        category: pet.category || "dog",
        breed: pet.breed || "",
        dateOfBirth: pet.dateOfBirth || "",
        age: pet.age || 0,
        microchipId: pet.microchipId || "",
        birthmarks: pet.birthmarks || "",
        imageUrl: pet.imageUrl || "",
      });
    }
  }, [pet, form]);

  const updatePetMutation = useMutation({
    mutationFn: async (data: Omit<InsertPet, 'userId'>) => {
      if (!pet?.id) {
        throw new Error("Pet ID is required");
      }
      await apiRequest("PUT", `/api/pets/${pet.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}`] });
      toast({
        title: "Success",
        description: "Pet information updated successfully!",
      });
      setIsOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertPet) => {
    updatePetMutation.mutate(data);
  };

  const handlePhotoUploaded = (url: string) => {
    form.setValue("imageUrl", url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Edit3 className="w-4 h-4 mr-2" />
          Edit Pet Info
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Pet Information</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Photo Upload */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Pet Photo</label>
              <PhotoUpload
                onPhotoUploaded={handlePhotoUploaded}
                currentPhoto={form.watch("imageUrl") || ""}
                className="mx-auto"
              />
            </div>

            {/* Pet Name */}
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

            {/* Pet Category */}
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pet Category</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {petCategories.map((category) => {
                        const IconComponent = category.icon;
                        return (
                          <SelectItem key={category.value} value={category.value}>
                            <div className="flex items-center">
                              <IconComponent className="w-4 h-4 mr-2" />
                              {category.label}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Breed */}
            <FormField
              control={form.control}
              name="breed"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breed</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter breed" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date of Birth */}
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} value={field.value ? field.value.toString() : ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Age */}
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
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Microchip ID */}
            <FormField
              control={form.control}
              name="microchipId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Microchip ID (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter microchip ID" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Birthmarks */}
            <FormField
              control={form.control}
              name="birthmarks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Birthmarks / Remarks</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter any distinctive marks or remarks"
                      {...field} 
                      value={field.value || ""} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsOpen(false)}
                disabled={updatePetMutation.isPending}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updatePetMutation.isPending}
              >
                {updatePetMutation.isPending ? "Updating..." : "Update Pet"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}