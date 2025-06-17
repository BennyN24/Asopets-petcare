import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QrCode, Camera, X, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onClose: () => void;
  onScanSuccess: (data: any) => void;
}

export default function QRScanner({ onClose, onScanSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment", // Use back camera on mobile
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }

      setStream(mediaStream);
      
      // Start scanning for QR codes
      startQRDetection();

    } catch (err) {
      setError("Camera access denied or not available");
      setIsScanning(false);
    }
  };

  const startQRDetection = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !video || !context) return;

    const scanFrame = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Simple QR code detection using canvas data
        // In a real implementation, you'd use a library like jsQR
        try {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          // Placeholder for QR detection logic
          // For now, we'll simulate detection with a manual trigger
        } catch (err) {
          console.error("QR detection error:", err);
        }
      }

      if (isScanning) {
        requestAnimationFrame(scanFrame);
      }
    };

    scanFrame();
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const handleManualInput = () => {
    // For demo purposes, simulate scanning a pet QR code
    const demoData = {
      type: "pet_profile",
      petId: "demo-pet-123",
      name: "Demo Pet",
      category: "dog",
      breed: "Golden Retriever",
      owner: "Demo Owner",
      contact: "demo@example.com"
    };

    toast({
      title: "QR Code Scanned!",
      description: `Found pet profile: ${demoData.name}`,
    });

    onScanSuccess(demoData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center">
              <QrCode className="w-5 h-5 mr-2" />
              Scan QR Code
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isScanning ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Scan a pet's QR code to view their profile and medical records.
              </p>
              
              <Button onClick={startCamera} className="w-full">
                <Camera className="w-4 h-4 mr-2" />
                Start Camera
              </Button>

              <Button 
                variant="outline" 
                onClick={handleManualInput}
                className="w-full"
              >
                <Download className="w-4 h-4 mr-2" />
                Demo Scan (Testing)
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative bg-black rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                <canvas
                  ref={canvasRef}
                  className="hidden"
                />
                
                {/* QR Code overlay */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-48 border-2 border-white border-dashed rounded-lg opacity-70"></div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  Stop Camera
                </Button>
                <Button onClick={handleManualInput} className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Test Scan
                </Button>
              </div>

              <p className="text-xs text-gray-500 text-center">
                Position the QR code within the frame to scan
              </p>
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}