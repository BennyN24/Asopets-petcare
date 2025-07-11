import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhoto?: string;
  className?: string;
  compact?: boolean;
}

export default function PhotoUpload({ onPhotoUploaded, currentPhoto, className = "", compact = false }: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (8MB limit)
    if (file.size > 8 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 8MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create compressed preview for mobile
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate dimensions to maintain aspect ratio with max 800px width
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        canvas.width = width;
        canvas.height = height;
        
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 with aggressive compression for database storage
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5);
        setPreview(compressedDataUrl);
        onPhotoUploaded(compressedDataUrl);
        
        toast({
          title: "Photo uploaded",
          description: "Your photo has been uploaded successfully.",
        });
      };
      
      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);

    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoUploaded("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Compact mode for profile avatar usage
  if (compact) {
    return (
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Button
          type="button"
          size="sm"
          disabled={isUploading}
          onClick={triggerFileInput}
          className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center border-2 border-white shadow-sm hover:bg-primary/90 transition-colors p-0"
        >
          {isUploading ? (
            <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <Camera className="w-3 h-3" />
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Uploaded photo"
            className="w-full h-32 object-cover rounded-lg border"
          />
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 w-6 h-6 p-0"
            onClick={handleRemovePhoto}
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      ) : (
        <Card className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                {isUploading ? (
                  <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <h3 className="font-medium text-gray-900 mb-1">
                {isUploading ? "Uploading..." : "Add Photo"}
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                {isUploading ? "Please wait..." : "Upload a photo or document"}
              </p>
              <div className="flex items-center justify-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={triggerFileInput}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Choose Photo
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Max file size: 10MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}