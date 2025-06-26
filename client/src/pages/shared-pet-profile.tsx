import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  Mail, 
  Calendar, 
  FileText, 
  Heart,
  Share2,
  Download,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

interface RecentMedicalRecord {
  id: number;
  type: string;
  title?: string;
  date: string;
  veterinarian?: string;
  clinic?: string;
  cost?: number;
}

interface ShareablePetProfile {
  id: number;
  name: string;
  category: string;
  breed?: string;
  age?: number;
  dateOfBirth?: string;
  microchipId?: string;
  birthmarks?: string;
  imageUrl?: string;
  medicalRecordCount: number;
  recentMedicalRecords?: RecentMedicalRecord[];
  owner: {
    name: string;
    email?: string;
    phone?: string;
    emergencyContact?: string;
    emergencyPhone?: string;
  };
  lastUpdated: string;
  shareUrl: string;
}

export default function SharedPetProfile() {
  const { id } = useParams();
  const { toast } = useToast();
  const shareToken = id || "";

  const { data: petProfile, isLoading, error } = useQuery({
    queryKey: [`/api/pets/share/${shareToken}`],
    queryFn: async (): Promise<ShareablePetProfile> => {
      console.log('Fetching pet profile for token:', shareToken);
      const response = await fetch(`/api/pets/share/${shareToken}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      console.log('Response status:', response.status);
      if (!response.ok) {
        console.error('Failed to fetch pet profile:', response.status, response.statusText);
        throw new Error('Pet profile not found');
      }
      const data = await response.json();
      console.log('Pet profile data:', data);
      return data;
    },
    enabled: !!shareToken,
    retry: false
  });

  const categoryColors = {
    dog: "bg-amber-100 text-amber-800",
    cat: "bg-purple-100 text-purple-800", 
    bird: "bg-sky-100 text-sky-800",
    rabbit: "bg-green-100 text-green-800",
    horse: "bg-orange-100 text-orange-800",
    exotic: "bg-pink-100 text-pink-800",
    other: "bg-gray-100 text-gray-800"
  };

  const handleShare = async () => {
    if (!petProfile) return;

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${petProfile.name} - Pet Profile`,
          text: `View ${petProfile.name}'s pet profile and contact information`,
          url: petProfile.shareUrl
        });
      } else {
        await navigator.clipboard.writeText(petProfile.shareUrl);
        toast({
          title: "Link Copied",
          description: "Pet profile link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Share failed:", error);
      toast({
        title: "Share Failed",
        description: "Could not share pet profile",
        variant: "destructive"
      });
    }
  };

  const handleDownloadContact = () => {
    if (!petProfile) return;

    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${petProfile.owner.name} (${petProfile.name}'s Owner)
TEL:${petProfile.owner.phone || ''}
EMAIL:${petProfile.owner.email || ''}
NOTE:Pet: ${petProfile.name} (${petProfile.category})${petProfile.breed ? `, Breed: ${petProfile.breed}` : ''}${petProfile.microchipId ? `, Microchip: ${petProfile.microchipId}` : ''}
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${petProfile.name}-owner-contact.vcf`;
    link.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Contact Downloaded",
      description: "Owner contact information saved to your device",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-center mt-4 text-gray-600">Loading pet profile...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !petProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Pet Profile Not Found</h2>
            <p className="text-gray-600 mb-4">
              The pet profile you're looking for could not be found or is no longer available.
            </p>
            <Button onClick={() => window.history.back()} variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <Card className="shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-lg">
            <div className="text-center">
              {petProfile.imageUrl ? (
                <img
                  src={petProfile.imageUrl}
                  alt={petProfile.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-white object-cover"
                />
              ) : (
                <div className="w-24 h-24 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <span className="text-3xl">🐾</span>
                </div>
              )}
              <CardTitle className="text-2xl font-bold">{petProfile.name}</CardTitle>
              <Badge 
                className={`mt-2 ${categoryColors[petProfile.category as keyof typeof categoryColors] || categoryColors.other}`}
              >
                {petProfile.category}
              </Badge>
              <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                <span className="text-blue-700 font-medium">Share Link:</span>
                <br />
                <span className="text-blue-600 font-mono text-xs">{petProfile.shareUrl}</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">
            {/* Pet Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-red-500" />
                Pet Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {petProfile.breed && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Breed:</span>
                    <span className="font-medium">{petProfile.breed}</span>
                  </div>
                )}
                
                {petProfile.age && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Age:</span>
                    <span className="font-medium">{petProfile.age} months</span>
                  </div>
                )}
                
                {petProfile.dateOfBirth && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Born:</span>
                    <span className="font-medium">
                      {format(new Date(petProfile.dateOfBirth), 'MMM dd, yyyy')}
                    </span>
                  </div>
                )}
                
                {petProfile.microchipId && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Microchip:</span>
                    <span className="font-medium font-mono text-sm">{petProfile.microchipId}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Medical Records:</span>
                  <span className="font-medium">{petProfile.medicalRecordCount}</span>
                </div>
              </div>

              {petProfile.birthmarks && (
                <div className="mt-4">
                  <span className="text-gray-600 block mb-1">Birthmarks/Notes:</span>
                  <p className="font-medium text-sm bg-gray-50 p-3 rounded">{petProfile.birthmarks}</p>
                </div>
              )}
            </div>

            {/* Recent Medical Records */}
            {petProfile.recentMedicalRecords && petProfile.recentMedicalRecords.length > 0 && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                  <FileText className="w-5 h-5 mr-2 text-green-500" />
                  Recent Medical Records
                </h3>
                
                <div className="space-y-3">
                  {petProfile.recentMedicalRecords.map((record) => (
                    <div key={record.id} className="bg-gray-50 p-3 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={`text-xs ${
                            record.type === 'vaccine' ? 'bg-green-100 text-green-800' :
                            record.type === 'deworming' ? 'bg-blue-100 text-blue-800' :
                            record.type === 'treatment' ? 'bg-orange-100 text-orange-800' :
                            record.type === 'surgery' ? 'bg-red-100 text-red-800' :
                            record.type === 'checkup' ? 'bg-purple-100 text-purple-800' :
                            record.type === 'lab-test' ? 'bg-yellow-100 text-yellow-800' :
                            record.type === 'grooming' ? 'bg-pink-100 text-pink-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {record.type}
                          </Badge>
                          <span className="text-sm font-medium">{record.title || 'Medical Record'}</span>
                        </div>
                        <span className="text-xs text-gray-500">
                          {format(new Date(record.date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        {record.veterinarian && (
                          <div>Dr. {record.veterinarian}</div>
                        )}
                        {record.clinic && (
                          <div>{record.clinic}</div>
                        )}
                        {record.cost && (
                          <div className="font-medium">{record.cost}</div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {petProfile.medicalRecordCount > 5 && (
                    <div className="text-center text-sm text-gray-500 mt-3">
                      +{petProfile.medicalRecordCount - 5} more medical records available
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Owner Contact Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                <User className="w-5 h-5 mr-2 text-blue-500" />
                Owner Contact
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{petProfile.owner.name}</span>
                </div>
                
                {petProfile.owner.phone && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Phone:</span>
                    <a 
                      href={`tel:${petProfile.owner.phone}`}
                      className="font-medium text-blue-600 hover:underline flex items-center"
                    >
                      <Phone className="w-4 h-4 mr-1" />
                      {petProfile.owner.phone}
                    </a>
                  </div>
                )}
                
                {petProfile.owner.email && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Email:</span>
                    <a 
                      href={`mailto:${petProfile.owner.email}`}
                      className="font-medium text-blue-600 hover:underline flex items-center"
                    >
                      <Mail className="w-4 h-4 mr-1" />
                      {petProfile.owner.email}
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Emergency Contact */}
            {(petProfile.owner.emergencyContact || petProfile.owner.emergencyPhone) && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center mb-4">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-500" />
                  Emergency Contact
                </h3>
                
                <div className="space-y-3">
                  {petProfile.owner.emergencyContact && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium">{petProfile.owner.emergencyContact}</span>
                    </div>
                  )}
                  
                  {petProfile.owner.emergencyPhone && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phone:</span>
                      <a 
                        href={`tel:${petProfile.owner.emergencyPhone}`}
                        className="font-medium text-red-600 hover:underline flex items-center"
                      >
                        <Phone className="w-4 h-4 mr-1" />
                        {petProfile.owner.emergencyPhone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="border-t pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <Button onClick={handleShare} className="w-full">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
                
                <Button onClick={handleDownloadContact} variant="outline" className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Download Contact
                </Button>
              </div>
            </div>

            {/* Footer Information */}
            <div className="border-t pt-6 text-center text-sm text-gray-500">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4 mr-1" />
                Last updated: {format(new Date(petProfile.lastUpdated), 'MMM dd, yyyy')}
              </div>
              <p>Generated by ASOPETS Pet Care Management</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}