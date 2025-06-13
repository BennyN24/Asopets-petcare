import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PhotoUploadProps {
  onPhotoUploaded: (url: string) => void;
  currentPhoto?: string;
  className?: string;
}

export default function PhotoUpload({ onPhotoUploaded, currentPhoto, className = "" }: PhotoUploadProps) {
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

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setPreview(result);
      };
      reader.readAsDataURL(file);

      // For now, we'll use the data URL as the image URL
      // In production, you'd upload to a cloud service like AWS S3, Cloudinary, etc.
      const reader2 = new FileReader();
      reader2.onload = (e) => {
        const result = e.target?.result as string;
        onPhotoUploaded(result);
        toast({
          title: "Photo uploaded",
          description: "Your photo has been uploaded successfully.",
        });
      };
      reader2.readAsDataURL(file);

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

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {preview ? (
        <Card>
          <CardContent className="p-3">
            <div className="relative">
              <img
                src={preview}
                alt="Uploaded photo"
                className="w-full h-32 object-cover rounded-lg"
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
          </CardContent>
        </Card>
      ) : (
        <Card 
          className="border-2 border-dashed border-gray-300 hover:border-primary transition-colors cursor-pointer"
          onClick={triggerFileInput}
        >
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
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerFileInput();
                  }}
                >
                  <Upload className="w-4 h-4 mr-1" />
                  Choose File
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isUploading}
                  onClick={(e) => {
                    e.stopPropagation();
                    // In a real app, you might trigger camera capture here
                    triggerFileInput();
                  }}
                >
                  <Camera className="w-4 h-4 mr-1" />
                  Camera
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Max file size: 5MB
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}