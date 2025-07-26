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
  Eye,
  Camera,
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

interface PaginatedMedicalRecordsResponse {
  records: MedicalRecord[];
  pagination: {
    page: number;
    limit: number;
    totalRecords: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export default function MedicalTimeline({ petId, medicalRecords }: MedicalTimelineProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const [attachmentIndex, setAttachmentIndex] = useState(0);
  
  // Filter and sort states
  const [filterType, setFilterType] = useState<MedicalRecordType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'type' | 'cost'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  const deleteRecordMutation = useMutation({
    mutationFn: async (recordId: number) => {
      await apiRequest("DELETE", `/api/pets/${petId}/medical-records/${recordId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets", petId, "medical-records"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pets", petId, "reminders"] });
      toast({
        title: "Record deleted",
        description: "Medical record has been removed successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
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
      case 'lab-test': return <FileText {...iconProps} />;
      default: return <Stethoscope {...iconProps} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'vaccine': return 'bg-green-100 text-green-800 border-green-200';
      case 'deworming': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'treatment': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'surgery': return 'bg-red-100 text-red-800 border-red-200';
      case 'checkup': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'lab-test': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return isValid(date) ? format(date, "MMM d, yyyy") : "Invalid date";
  };

  const formatType = (type: string) => {
    return type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Unknown';
  };

  const handleDeleteRecord = (recordId: number, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteRecordMutation.mutate(recordId);
    }
  };

  // Query to get full record with attachments when viewing details
  const { data: fullRecordData } = useQuery({
    queryKey: [`/api/pets/${petId}/medical-records-full`],
    queryFn: () => apiRequest(`/api/pets/${petId}/medical-records?includeAttachments=true&limit=1000`),
    enabled: !!selectedRecord && isDialogOpen,
  });

  const handleRecordClick = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsDialogOpen(true);
  };

  // Update full record data when query completes
  React.useEffect(() => {
    if (fullRecordData?.records && selectedRecord) {
      const fullRecord = fullRecordData.records.find((r: MedicalRecord) => r.id === selectedRecord.id);
      if (fullRecord) {
        setSelectedRecordWithAttachments(fullRecord);
      }
    }
  }, [fullRecordData, selectedRecord]);

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

  const toggleSortOrder = () => {
    setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
  };

  if (medicalRecords.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Stethoscope className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="font-medium text-gray-900 mb-2">No Medical Records</h3>
          <p className="text-gray-500 text-sm">
            Start tracking your pet's health by adding their first medical record.
          </p>
        </CardContent>
      </Card>
    );
  }

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
              <label className="text-sm font-medium text-gray-700">Sort Order</label>
              <Button
                variant="outline"
                onClick={toggleSortOrder}
                className="w-full justify-start"
              >
                {sortOrder === 'desc' ? (
                  <SortDesc className="w-4 h-4 mr-2" />
                ) : (
                  <SortAsc className="w-4 h-4 mr-2" />
                )}
                {sortBy === 'date' 
                  ? (sortOrder === 'desc' ? 'Newest First' : 'Oldest First')
                  : (sortOrder === 'desc' ? 'Z to A' : 'A to Z')
                }
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      {filterType !== 'all' && (
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          Showing {filteredAndSortedRecords.length} {filterType.replace('-', ' ')} record{filteredAndSortedRecords.length !== 1 ? 's' : ''} 
          {filteredAndSortedRecords.length < medicalRecords.length && (
            <span> out of {medicalRecords.length} total</span>
          )}
        </div>
      )}

      {/* No filtered results */}
      {filteredAndSortedRecords.length === 0 && filterType !== 'all' && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <Stethoscope className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">No {filterType.replace('-', ' ')} records found</h3>
          <p className="text-gray-500">Try adjusting your filters or add new records.</p>
          <Button
            variant="outline"
            onClick={() => setFilterType('all')}
            className="mt-4"
          >
            Show All Records
          </Button>
        </div>
      )}

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {filteredAndSortedRecords.map((record, index) => (
            <div key={record.id} className="relative">
              {/* Timeline dot */}
              <div className={`absolute left-4 w-4 h-4 rounded-full border-2 border-white ${
                index === 0 ? 'bg-primary' : 'bg-gray-300'
              } shadow-sm`}></div>
              
              {/* Record card */}
              <Card className="ml-12 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleRecordClick(record)}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`activity-icon ${record.type}`}>
                          {getActivityIcon(record.type)}
                        </div>
                        <Badge variant="outline" className={getTypeColor(record.type)}>
                          {formatType(record.type)}
                        </Badge>
                        <span className="text-xs text-gray-500">
                          {formatDate(record.dateAdministered)}
                        </span>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-1">{record.title}</h4>
                      
                      {record.description && (
                        <p className="text-sm text-gray-600 mb-2">{record.description}</p>
                      )}

                      <div className="grid grid-cols-1 gap-2 text-xs text-gray-500">
                        {record.veterinarian && (
                          <div className="flex items-center">
                            <Stethoscope className="w-3 h-3 mr-1" />
                            <span>Dr. {record.veterinarian}</span>
                          </div>
                        )}
                        
                        {record.clinic && (
                          <div className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            <span>{record.clinic}</span>
                          </div>
                        )}
                        
                        {record.cost && (
                          <div className="flex items-center">
                            <DollarSign className="w-3 h-3 mr-1" />
                            <span>₱{record.cost}</span>
                          </div>
                        )}
                        
                        {record.batchNumber && (
                          <div className="flex items-center">
                            <FileText className="w-3 h-3 mr-1" />
                            <span>Batch: {record.batchNumber}</span>
                          </div>
                        )}
                      </div>

                      {/* Images preview */}
                      {record.attachments && record.attachments.length > 0 && (
                        <div className="mt-2">
                          <div className="flex items-center gap-1 mb-2">
                            <ImageIcon className="w-3 h-3 text-gray-500" />
                            <span className="text-xs text-gray-500">{record.attachments.length} image{record.attachments.length > 1 ? 's' : ''}</span>
                          </div>
                          <div className="flex gap-2 flex-wrap">
                            {record.attachments.slice(0, 3).map((attachment, idx) => (
                              <div 
                                key={idx}
                                className="relative w-12 h-12 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedRecord(record);
                                  setAttachmentIndex(idx);
                                  setShowAttachments(true);
                                }}
                              >
                                <img
                                  src={attachment}
                                  alt={`Medical record attachment ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                />
                                {idx === 2 && record.attachments.length > 3 && (
                                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                    <span className="text-white text-xs font-medium">+{record.attachments.length - 3}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {record.nextDueDate && (
                        <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          <span className="text-amber-800">
                            Next due: {formatDate(record.nextDueDate)}
                          </span>
                        </div>
                      )}

                      {record.notes && (
                        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                          <p className="text-gray-600">{record.notes}</p>
                        </div>
                      )}

                      {record.imageUrl && (
                        <div className="mt-2">
                          <div className="flex items-center text-xs text-gray-500 mb-1">
                            <ImageIcon className="w-3 h-3 mr-1" />
                            <span>Attached document</span>
                          </div>
                          <div 
                            className="cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedRecord(record);
                              const allImages = [
                                ...(record.attachments || []),
                                ...(record.imageUrl ? [record.imageUrl] : [])
                              ];
                              setAttachmentIndex(allImages.findIndex(img => img === record.imageUrl));
                              setShowAttachments(true);
                            }}
                          >
                            <img 
                              src={record.imageUrl} 
                              alt="Medical record"
                              className="max-w-32 h-auto rounded border"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteRecord(record.id, record.title);
                      }}
                      disabled={deleteRecordMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Detailed Record Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md" aria-describedby="record-details">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedRecord && getActivityIcon(selectedRecord.type)}
              {selectedRecord?.title}
            </DialogTitle>
          </DialogHeader>
          <div id="record-details">
            {selectedRecord && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={getTypeColor(selectedRecord.type)}>
                    {formatType(selectedRecord.type)}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {formatDate(selectedRecord.dateAdministered)}
                  </span>
                </div>

                {selectedRecord.description && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">Description</h4>
                    <p className="text-sm text-gray-600">{selectedRecord.description}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {selectedRecord.veterinarian && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Veterinarian</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <Stethoscope className="w-4 h-4 mr-2" />
                        Dr. {selectedRecord.veterinarian}
                      </div>
                    </div>
                  )}
                  
                  {selectedRecord.clinic && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Clinic</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        {selectedRecord.clinic}
                      </div>
                    </div>
                  )}
                  
                  {selectedRecord.cost && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Cost</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        ₱{selectedRecord.cost}
                      </div>
                    </div>
                  )}
                  
                  {selectedRecord.batchNumber && (
                    <div>
                      <h4 className="font-medium text-sm text-gray-900 mb-1">Batch Number</h4>
                      <div className="flex items-center text-sm text-gray-600">
                        <FileText className="w-4 h-4 mr-2" />
                        {selectedRecord.batchNumber}
                      </div>
                    </div>
                  )}
                </div>

                {selectedRecord.nextDueDate && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                    <h4 className="font-medium text-sm text-amber-800 mb-1">Next Due Date</h4>
                    <div className="flex items-center text-sm text-amber-700">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatDate(selectedRecord.nextDueDate)}
                    </div>
                  </div>
                )}

                {selectedRecord.notes && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-1">Notes</h4>
                    <div className="p-3 bg-gray-50 rounded text-sm text-gray-600">
                      {selectedRecord.notes}
                    </div>
                  </div>
                )}

                {/* Images section */}
                {((selectedRecord.attachments && selectedRecord.attachments.length > 0) || selectedRecord.imageUrl) && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-900 mb-2">
                      Attached Images ({(selectedRecord.attachments?.length || 0) + (selectedRecord.imageUrl ? 1 : 0)})
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedRecord.attachments?.map((attachment, idx) => (
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
                          />
                        </div>
                      ))}
                      {selectedRecord.imageUrl && (
                        <div 
                          className="aspect-square rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity border"
                          onClick={() => {
                            const allImages = [
                              ...(selectedRecord.attachments || []),
                              selectedRecord.imageUrl!
                            ];
                            setAttachmentIndex(allImages.length - 1);
                            setShowAttachments(true);
                          }}
                        >
                          <img 
                            src={selectedRecord.imageUrl} 
                            alt="Medical record document"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
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