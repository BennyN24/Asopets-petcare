import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";

interface MedicalAttachmentViewerProps {
  attachments: string[];
  isOpen: boolean;
  onClose: () => void;
  initialIndex?: number;
}

export default function MedicalAttachmentViewer({ 
  attachments, 
  isOpen, 
  onClose, 
  initialIndex = 0 
}: MedicalAttachmentViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % attachments.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + attachments.length) % attachments.length);
  };

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
  };

  if (!attachments || attachments.length === 0) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Medical Record Attachments ({currentIndex + 1}/{attachments.length})</span>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={toggleZoom}>
                {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative flex items-center justify-center bg-gray-50 rounded-lg overflow-hidden">
          {/* Navigation arrows */}
          {attachments.length > 1 && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/80 hover:bg-white"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}
          
          {/* Image */}
          <img
            src={attachments[currentIndex]}
            alt={`Medical attachment ${currentIndex + 1}`}
            className={`max-w-full transition-all duration-200 ${
              isZoomed 
                ? 'max-h-none w-full cursor-zoom-out' 
                : 'max-h-[60vh] object-contain cursor-zoom-in'
            }`}
            onClick={toggleZoom}
          />
        </div>
        
        {/* Thumbnail navigation */}
        {attachments.length > 1 && (
          <div className="flex justify-center space-x-2 mt-4 max-w-full overflow-x-auto pb-2">
            {attachments.map((attachment, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex 
                    ? 'border-primary shadow-lg' 
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <img
                  src={attachment}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}