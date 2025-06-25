import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { 
  Plus,
  Copy,
  User,
  Phone,
  Mail,
  Calendar,
  PawPrint,
  X
} from 'lucide-react';

interface ScannedPetData {
  type: string;
  petId: string;
  ownerId?: string;
  name?: string;
  petName?: string;
  category?: string;
  breed?: string;
  dateOfBirth?: string;
  age?: number;
  microchipId?: string;
  birthmarks?: string;
  medicalRecordCount?: number;
  lastUpdated?: string;
  owner?: {
    name?: string;
    phone?: string;
    email?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  scannedAt: string;
}

interface ScannedPetTransferProps {
  data: ScannedPetData;
  onClose: () => void;
}

export default function ScannedPetTransfer({ data, onClose }: ScannedPetTransferProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const transferPetMutation = useMutation({
    mutationFn: async () => {
      const petData = {
        name: data.name || data.petName || 'Unknown Pet',
        category: data.category || 'other',
        breed: data.breed || '',
        dateOfBirth: data.dateOfBirth || '',
        age: data.age || 0,
        microchipId: data.microchipId || '',
        birthmarks: data.birthmarks || '',
        notes: `Transferred from QR scan. Original owner: ${data.owner?.name || 'Unknown'}`
      };
      
      const response = await apiRequest("POST", "/api/pets", petData);
      return response;
    },
    onSuccess: () => {
      toast({
        title: "Pet Added Successfully",
        description: `${data.name || data.petName || 'Pet'} has been added to your pet profiles.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to add pet to your profile.",
        variant: "destructive",
      });
    }
  });

  const copyContactInfo = async () => {
    if (data.owner) {
      const contactInfo = `${data.owner.name || 'Name not available'}\nPhone: ${data.owner.phone || 'Not available'}\nEmail: ${data.owner.email || 'Not available'}`;
      try {
        await navigator.clipboard.writeText(contactInfo);
        toast({
          title: "Contact Info Copied",
          description: "Owner's contact information has been copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Copy Failed",
          description: "Unable to copy contact information.",
          variant: "destructive",
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  const getPetIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      dog: '🐕',
      cat: '🐱', 
      bird: '🐦',
      rabbit: '🐰',
      horse: '🐴',
      exotic: '🦎',
      other: '🐾'
    };
    return icons[category] || '🐾';
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardHeader className="text-center pb-4 relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            <X className="w-4 h-4" />
          </Button>
          
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <PawPrint className="w-8 h-8 text-white" />
          </div>
          
          <CardTitle className="text-xl font-bold text-gray-900">
            Pet Profile Found
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Pet Info */}
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="text-3xl">
              {getPetIcon(data.category)}
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">
                {data.name || data.petName || 'Unknown Pet'}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="secondary" className="capitalize">
                  {data.category || 'Unknown'}
                </Badge>
                {data.breed && (
                  <span className="text-sm text-gray-600">{data.breed}</span>
                )}
              </div>
            </div>
          </div>

          {/* Pet Details */}
          <div className="space-y-3">
            {data.age && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Age:</span>
                <span className="font-medium">{data.age} months</span>
              </div>
            )}
            {data.dateOfBirth && (
              <div className="flex items-center justify-between">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Born:</span>
                <span className="font-medium">{formatDate(data.dateOfBirth)}</span>
              </div>
            )}
            {data.microchipId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Microchip:</span>
                <span className="font-medium text-xs font-mono">{data.microchipId}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Medical Records:</span>
              <span className="font-medium">{data.medicalRecordCount || 0}</span>
            </div>
          </div>

          {/* Owner Info */}
          {data.owner && (
            <div className="border-t pt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900 flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  Owner Information
                </h4>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyContactInfo}
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Copy
                </Button>
              </div>
              <div className="space-y-2 text-sm">
                {data.owner.name && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="font-medium">{data.owner.name}</span>
                  </div>
                )}
                {data.owner.phone && (
                  <div className="flex items-center justify-between">
                    <Phone className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{data.owner.phone}</span>
                  </div>
                )}
                {data.owner.email && (
                  <div className="flex items-center justify-between">
                    <Mail className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{data.owner.email}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={() => transferPetMutation.mutate()}
              disabled={transferPetMutation.isPending}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              size="lg"
            >
              {transferPetMutation.isPending ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Add to My Pets
            </Button>
            
            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full"
            >
              View Only
            </Button>
          </div>

          {/* Note */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Adding this pet will create a new profile in your account with available information
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}