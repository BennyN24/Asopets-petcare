import React, { useState, useRef, useEffect } from "react";
// @ts-ignore
import jsQR from "jsqr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QrCode, Camera, X, Download, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import AnimatedPetMascot from "./animated-pet-mascot";
import FloatingParticles from "./floating-particles";

interface QRScannerProps {
  onClose: () => void;
  onScanSuccess: (data: any) => void;
}

export default function QRScanner({ onClose, onScanSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [scanSuccess, setScanSuccess] = useState(false);
  const [scannedPetCategory, setScannedPetCategory] = useState<string>("other");
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
        video: { facingMode: "environment" }
      });

      setStream(mediaStream);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
        scanQRCode();
      }
    } catch (err) {
      setError("Camera access denied. Please allow camera permissions.");
      setIsScanning(false);
    }
  };

  const scanQRCode = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const scan = () => {
      if (video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.height = video.videoHeight;
        canvas.width = video.videoWidth;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code) {
          try {
            const data = JSON.parse(code.data);
            if (data.type === "pet-profile" && data.petId) {
              handleScanSuccess(data);
              return;
            }
          } catch (e) {
            // Not a valid pet QR code
          }
        }
      }

      if (isScanning) {
        requestAnimationFrame(scan);
      }
    };

    requestAnimationFrame(scan);
  };

  const handleScanSuccess = async (data: any) => {
    setScanSuccess(true);
    setScannedPetCategory(data.category || "other");
    setIsScanning(false);

    // Stop the camera
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    // Call the success callback
    onScanSuccess(data);

    // Show success toast
    toast({
      title: "QR Code Scanned!",
      description: "Pet profile detected successfully.",
    });

    // Close after animation
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleTestScan = () => {
    // Simulate a successful scan with test data
    const testData = {
      type: "pet-profile",
      petId: 1,
      category: "dog"
    };
    handleScanSuccess(testData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>QR Scanner</CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Animated Pet Mascot */}
          <div className="flex justify-center">
            <AnimatedPetMascot 
              isScanning={isScanning}
              scanSuccess={scanSuccess}
              petCategory={scannedPetCategory}
            />
          </div>

          {/* Floating Particles */}
          <FloatingParticles show={scanSuccess} />

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {!isScanning && !scanSuccess && (
            <div className="space-y-4">
              <div className="relative">
                <video
                  ref={videoRef}
                  className="w-full h-48 bg-gray-100 rounded-lg object-cover"
                  playsInline
                  muted
                />
                <canvas ref={canvasRef} className="hidden" />
                
                {/* Scanning Line Animation */}
                {isScanning && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-full h-0.5 bg-green-500 animate-pulse"></div>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={startCamera} className="flex-1">
                  <Camera className="h-4 w-4 mr-2" />
                  Start Scanning
                </Button>
                <Button onClick={handleTestScan} variant="outline">
                  Test Scan
                </Button>
              </div>
            </div>
          )}

          {scanSuccess && (
            <div className="text-center space-y-2">
              <div className="text-green-600 font-medium">Scan Successful!</div>
              <div className="text-sm text-gray-600">Loading pet information...</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}