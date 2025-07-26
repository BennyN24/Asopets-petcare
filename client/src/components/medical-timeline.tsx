import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar, 
  Syringe, 
  PillBottle, 
  Heart as MedicalKit, 
  UserCog, 
  Stethoscope,
  MapPin,
  DollarSign,
  FileText,
  Image as ImageIcon,
  Trash2,
  Filter,
  SortAsc,
  SortDesc
} from "lucide-react";
import MedicalAttachmentViewer from "@/components/medical-attachment-viewer";
import { format, isValid } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { MedicalRecord, MedicalRecordType } from "@shared/schema";

interface MedicalTimelineProps {
  petId: number;
  medicalRecords: MedicalRecord[];
}

export default function MedicalTimeline({ petId, medicalRecords }: MedicalTimelineProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [selectedRecordWithAttachments, setSelectedRecordWithAttachments] = useState<MedicalRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachmentIndex, setAttachmentIndex] = useState(0);
  
  // Filter and sort states
  const [filterType, setFilterType] = useState<MedicalRecordType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'cost'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Query to get full record with attachments when viewing details
  const { data: fullRecordData } = useQuery({
    queryKey: [`/api/pets/${petId}/medical-records-full`],
    queryFn: async () => {
      const response = await fetch(`/api/pets/${petId}/medical-records?includeAttachments=true&limit=1000`, {
        credentials: 'include'
      });
      return response.json();
    },
    enabled: !!selectedRecord && isDialogOpen,
  });

  // Update full record data when query completes
  React.useEffect(() => {
    if (fullRecordData?.records && selectedRecord) {
      const fullRecord = fullRecordData.records.find((r: MedicalRecord) => r.id === selectedRecord.id);
      if (fullRecord) {
        setSelectedRecordWithAttachments(fullRecord);
      }
    }
  }, [fullRecordData, selectedRecord]);

  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: number) => {
      await apiRequest("DELETE", `/api/medical-records/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets", petId, "medical-records"] });
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${petId}/medical-records`] });
      toast({
        title: "Record deleted",
        description: "Medical record has been removed successfully.",
      });
      setIsDialogOpen(false);
      setSelectedRecord(null);
      setSelectedRecordWithAttachments(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete record",
        variant: "destructive",
      });
    },
  });

  const getActivityIcon = (type: string) => {
    const iconProps = { className: "w-4 h-4" };
    switch (type) {
      case 'vaccine': return <Syringe {...iconProps} />;
      case 'deworming': return <PillBottle {...iconProps} />;
      case 'treatment': return <MedicalKit {...iconProps} />;
      case 'surgery': return <UserCog {...iconProps} />;
      case 'checkup': return <Stethoscope {...iconProps} />;
      case 'grooming': return <UserCog {...iconProps} />;
      default: return <FileText {...iconProps} />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case 'vaccine': return 'bg-green-100 text-green-800';
      case 'deworming': return 'bg-orange-100 text-orange-800';
      case 'treatment': return 'bg-blue-100 text-blue-800';
      case 'surgery': return 'bg-red-100 text-red-800';
      case 'checkup': return 'bg-purple-100 text-purple-800';
      case 'grooming': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDeleteRecord = (recordId: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteRecordMutation.mutate(recordId);
    }
  };

  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setSelectedRecordWithAttachments(null); // Reset while loading
    setIsDialogOpen(true);
  };

  // Filter and sort records
  const filteredAndSortedRecords = useMemo(() => {
    let filtered = medicalRecords;
    
    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(record => record.type === filterType);
    }
    
    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.dateAdministered).getTime() - new Date(b.dateAdministered).getTime();
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
        case 'cost':
          const costA = parseFloat(a.cost || '0');
          const costB = parseFloat(b.cost || '0');
          comparison = costA - costB;
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return sorted;
  }, [medicalRecords, filterType, sortBy, sortOrder]);

  // Get unique record types for filter options
  const availableTypes = useMemo(() => {
    const types = new Set(medicalRecords.map(record => record.type));
    return Array.from(types).sort();
  }, [medicalRecords]);

  // Check if record has images (excluding placeholders)
  const hasValidImages = (record: MedicalRecord) => {
    const hasValidAttachments = record.attachments && record.attachments.length > 0 && 
      !record.attachments.every(a => typeof a === 'string' && a.includes('attachment(s)'));
    const hasValidImageUrl = record.imageUrl && record.imageUrl !== '[image_available]';
    return hasValidAttachments || hasValidImageUrl;
  };

  return (
    <div className="space-y-4">
      {/* Filter and Sort Controls */}
      <div className="bg-gray-50 p-4 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">Medical History</h3>
            <span className="text-sm text-gray-500">({filteredAndSortedRecords.length}/{medicalRecords.length})</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            {showFilters ? 'Hide' : 'Show'} Filters
          </Button>
        </div>
        
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Type Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Filter by Type</label>
              <Select value={filterType} onValueChange={(value) => setFilterType(value as MedicalRecordType | 'all')}>
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {availableTypes.map(type => (
                    <SelectItem key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort by</label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as 'date' | 'type' | 'cost')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="type">Type</SelectItem>
                  <SelectItem value="cost">Cost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort Order */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Order</label>
              <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as 'asc' | 'desc')}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">
                    <div className="flex items-center gap-2">
                      <SortDesc className="w-4 h-4" />
                      Newest First
                    </div>
                  </SelectItem>
                  <SelectItem value="asc">
                    <div className="flex items-center gap-2">
                      <SortAsc className="w-4 h-4" />
                      Oldest First
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {showFilters && (
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setFilterType('all');
                setSortBy('date');
                setSortOrder('desc');
              }}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Medical Records Timeline */}
      <div className="space-y-4">
        {filteredAndSortedRecords.length === 0 ? (
          <div className="text-center py-8">
            <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No medical records</h3>
            <p className="text-gray-500">
              {filterType !== 'all' ? `No ${filterType} records found.` : 'No medical records have been added yet.'}
            </p>
          </div>
        ) : (
          filteredAndSortedRecords.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4" onClick={() => handleRecordClick(record)}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getActivityIcon(record.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getBadgeColor(record.type)}>
                          {record.type}
                        </Badge>
                        {hasValidImages(record) && (
                          <ImageIcon className="w-4 h-4 text-blue-600" />
                        )}
                      </div>
                      <h4 className="text-sm font-medium text-gray-900 mb-1">
                        {record.title || `${record.type.charAt(0).toUpperCase()}${record.type.slice(1)} Record`}
                      </h4>
                      <div className="space-y-1 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {isValid(new Date(record.dateAdministered)) 
                              ? format(new Date(record.dateAdministered), "MMM dd, yyyy")
                              : "No date"
                            }
                          </span>
                        </div>
                        {record.veterinarian && (
                          <div className="flex items-center gap-1">
                            <UserCog className="w-3 h-3" />
                            <span>Dr. {record.veterinarian}</span>
                          </div>
                        )}
                        {record.clinic && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            <span>{record.clinic}</span>
                          </div>
                        )}
                        {record.cost && (
                          <div className="flex items-center gap-1">
                            <DollarSign className="w-3 h-3" />
                            <span>{record.cost}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Medical Record Detail Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRecord && getActivityIcon(selectedRecord.type)}
              <span>{selectedRecord?.title || `${selectedRecord?.type} Record`}</span>
            </DialogTitle>
          </DialogHeader>
          
          {selectedRecord && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge className={getBadgeColor(selectedRecord.type)}>
                  {selectedRecord.type}
                </Badge>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteRecord(selectedRecord.id, selectedRecord.title || selectedRecord.type)}
                  disabled={deleteRecordMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Date Administered</label>
                  <p className="text-sm">
                    {isValid(new Date(selectedRecord.dateAdministered))
                      ? format(new Date(selectedRecord.dateAdministered), "MMMM dd, yyyy")
                      : "No date specified"
                    }
                  </p>
                </div>

                {selectedRecord.nextDueDate && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Next Due Date</label>
                    <p className="text-sm">
                      {isValid(new Date(selectedRecord.nextDueDate))
                        ? format(new Date(selectedRecord.nextDueDate), "MMMM dd, yyyy")
                        : "No date specified"
                      }
                    </p>
                  </div>
                )}

                {selectedRecord.veterinarian && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {selectedRecord.type === 'grooming' ? 'Groomer' : 'Veterinarian'}
                    </label>
                    <p className="text-sm">Dr. {selectedRecord.veterinarian}</p>
                  </div>
                )}

                {selectedRecord.clinic && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">
                      {selectedRecord.type === 'grooming' ? 'Grooming Salon' : 'Clinic'}
                    </label>
                    <p className="text-sm">{selectedRecord.clinic}</p>
                  </div>
                )}

                {selectedRecord.batchNumber && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Batch Number</label>
                    <p className="text-sm">{selectedRecord.batchNumber}</p>
                  </div>
                )}

                {selectedRecord.weight && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Weight</label>
                    <p className="text-sm">{selectedRecord.weight}</p>
                  </div>
                )}

                {selectedRecord.cost && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Cost</label>
                    <p className="text-sm">{selectedRecord.cost}</p>
                  </div>
                )}
              </div>

              {selectedRecord.description && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Description</label>
                  <p className="text-sm text-gray-600">{selectedRecord.description}</p>
                </div>
              )}

              {/* Attachments Section */}
              {selectedRecordWithAttachments ? (
                hasValidImages(selectedRecordWithAttachments) ? (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Attachments</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedRecordWithAttachments.attachments?.map((attachment, idx) => {
                        // Skip placeholder text from pagination
                        if (typeof attachment === 'string' && attachment.includes('attachment(s)')) {
                          return null;
                        }
                        return (
                          <div 
                            key={idx}
                            className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border"
                            onClick={() => {
                              setAttachmentIndex(idx);
                              setShowAttachments(true);
                            }}
                          >
                            <img
                              src={attachment}
                              alt={`Medical record attachment ${idx + 1}`}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                console.error('Failed to load attachment:', attachment);
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        );
                      })}
                      {selectedRecordWithAttachments.imageUrl && selectedRecordWithAttachments.imageUrl !== '[image_available]' && (
                        <div 
                          className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border"
                          onClick={() => {
                            const validAttachments = selectedRecordWithAttachments.attachments?.filter(
                              a => typeof a === 'string' && !a.includes('attachment(s)')
                            ) || [];
                            const allImages = [
                              ...validAttachments,
                              selectedRecordWithAttachments.imageUrl!
                            ];
                            setAttachmentIndex(allImages.length - 1);
                            setShowAttachments(true);
                          }}
                        >
                          <img 
                            src={selectedRecordWithAttachments.imageUrl} 
                            alt="Medical record document"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.error('Failed to load image:', selectedRecordWithAttachments.imageUrl);
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ) : null
              ) : (
                hasValidImages(selectedRecord) && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Attachments</h4>
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-600" />
                        <span>Loading attachments...</span>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Lightbox */}
      {showAttachments && selectedRecordWithAttachments && (
        <MedicalAttachmentViewer
          attachments={[
            ...(selectedRecordWithAttachments.attachments?.filter(a => 
              typeof a === 'string' && !a.includes('attachment(s)')
            ) || []),
            ...(selectedRecordWithAttachments.imageUrl && selectedRecordWithAttachments.imageUrl !== '[image_available]' 
              ? [selectedRecordWithAttachments.imageUrl] : [])
          ]}
          isOpen={showAttachments}
          onClose={() => setShowAttachments(false)}
          initialIndex={attachmentIndex}
        />
      )}
    </div>
  );
}