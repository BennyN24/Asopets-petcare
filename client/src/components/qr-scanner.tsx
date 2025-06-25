import { useState, useEffect, useRef, useCallback } from "react";
// @ts-ignore
import jsQR from "jsqr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QrCode, Camera, X, Upload } from "lucide-react";
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Add delay for mobile browsers to properly initialize
    const timer = setTimeout(() => {
      startCamera();
    }, 300);

    return () => {
      clearTimeout(timer);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

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

      // Check for camera permissions first
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera not supported in this browser");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" }, // Use back camera on mobile
          width: { ideal: 1280, max: 1920, min: 480 },
          height: { ideal: 720, max: 1080, min: 360 },
          frameRate: { ideal: 24, max: 30, min: 10 }
        }
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        // Wait for video to be ready before starting detection
        videoRef.current.onloadedmetadata = () => {
          console.log("📹 Video metadata loaded, starting QR detection");
          videoRef.current?.play().then(() => {
            console.log("▶️ Video playing, dimensions:", videoRef.current?.videoWidth, "x", videoRef.current?.videoHeight);
            // Start scanning immediately when video starts playing
            startQRDetection();
          }).catch((playError) => {
            console.error("❌ Video play error:", playError);
            setError("Failed to start video playback");
            setIsScanning(false);
          });
        };

        // Handle video errors
        videoRef.current.onerror = (err) => {
          console.error("❌ Video error:", err);
          setError("Video playback error");
          setIsScanning(false);
        };
      }

      setStream(mediaStream);

    } catch (err: any) {
      console.error("📷 Camera error:", err);
      
      let errorMessage = "Camera access denied or not available";
      
      if (err.name === 'NotAllowedError') {
        errorMessage = "Camera permission denied. Please allow camera access and try again.";
      } else if (err.name === 'NotFoundError') {
        errorMessage = "No camera found on this device.";
      } else if (err.name === 'NotSupportedError') {
        errorMessage = "Camera not supported in this browser.";
      } else if (err.name === 'NotReadableError') {
        errorMessage = "Camera is being used by another application.";
      }
      
      setError(errorMessage);
      setIsScanning(false);
    }
  };

  const startQRDetection = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const context = canvas?.getContext('2d');

    if (!canvas || !video || !context) return;

    let scanningActive = true;
    let lastScanTime = 0;

    const scanFrame = () => {
      if (!scanningActive || !isScanning) return;

      const currentTime = Date.now();

      // Throttle scanning to avoid excessive processing
      if (currentTime - lastScanTime < 200) {
        requestAnimationFrame(scanFrame);
        return;
      }

      lastScanTime = currentTime;

      if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the current frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        try {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });

          if (code && code.data) {
            console.log("🔍 QR Code detected! Raw data length:", code.data.length);
            console.log("📄 Raw QR code data:", code.data);

            try {
              const qrData = JSON.parse(code.data);
              console.log("✅ Successfully parsed QR data:", qrData);
              console.log("🔍 QR Data validation check:", {
                hasType: !!qrData.type,
                type: qrData.type,
                hasPetId: !!(qrData.petId || qrData.id),
                petId: qrData.petId || qrData.id,
                hasOwnerId: !!(qrData.ownerId || qrData.userId),
                ownerId: qrData.ownerId || qrData.userId,
                name: qrData.name || qrData.petName
              });

              // Check for pet_profile type with required fields
              if (qrData.type === 'pet_profile' && (qrData.petId || qrData.id)) {
                console.log("🎉 Valid pet QR code detected successfully!");
                scanningActive = false; // Stop scanning

                // Normalize the data structure
                const normalizedData = {
                  type: 'pet_profile',
                  petId: qrData.petId || qrData.id,
                  ownerId: qrData.ownerId || qrData.userId,
                  name: qrData.name || qrData.petName,
                  petName: qrData.petName || qrData.name,
                  category: qrData.category,
                  breed: qrData.breed,
                  dateOfBirth: qrData.dateOfBirth,
                  age: qrData.age,
                  microchipId: qrData.microchipId,
                  birthmarks: qrData.birthmarks,
                  medicalRecordCount: qrData.medicalRecordCount || 0,
                  lastUpdated: qrData.lastUpdated || qrData.timestamp,
                  owner: qrData.owner,
                  scannedAt: new Date().toISOString()
                };

                console.log("📋 Normalized QR data:", normalizedData);

                toast({
                  title: "Pet QR Code Found!",
                  description: `Found ${normalizedData.name || 'pet'} profile with ${normalizedData.medicalRecordCount} records`,
                });
                stopCamera();
                onScanSuccess(normalizedData);
                return;
              } else {
                console.log("❌ QR code validation failed:", {
                  typeMatch: qrData.type === 'pet_profile',
                  hasPetId: !!(qrData.petId || qrData.id),
                  hasOwnerId: !!(qrData.ownerId || qrData.userId),
                  actualType: qrData.type,
                  actualPetId: qrData.petId || qrData.id,
                  actualOwnerId: qrData.ownerId || qrData.userId
                });
              }
            } catch (parseError) {
              console.error("❌ QR JSON parsing failed:", parseError);
              console.log("📄 Raw data that failed to parse:", code.data);
              console.log("📝 First 100 chars:", code.data.substring(0, 100));
            }
          }
        } catch (err) {
          console.error("🚨 QR detection error:", err);
        }
      }

      // Continue scanning
      if (scanningActive && isScanning) {
        requestAnimationFrame(scanFrame);
      }
    };

    // Start the scanning loop
    requestAnimationFrame(scanFrame);

    // Cleanup function
    return () => {
      scanningActive = false;
    };
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setError("Failed to process image");
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);

          if (code) {
            console.log("QR Code found in uploaded image:", code.data);

            try {
              const qrData = JSON.parse(code.data);
              console.log("Parsed QR data from image:", qrData);

              // Check for pet_profile type with required fields
              if (qrData.type === 'pet_profile' && (qrData.petId || qrData.id)) {
                console.log("Valid pet QR code detected in uploaded image!");

                // Normalize the data structure
                const normalizedData = {
                  type: 'pet_profile',
                  petId: qrData.petId || qrData.id,
                  ownerId: qrData.ownerId || qrData.userId,
                  name: qrData.name || qrData.petName,
                  petName: qrData.petName || qrData.name,
                  category: qrData.category,
                  breed: qrData.breed,
                  dateOfBirth: qrData.dateOfBirth,
                  age: qrData.age,
                  microchipId: qrData.microchipId,
                  birthmarks: qrData.birthmarks,
                  medicalRecordCount: qrData.medicalRecordCount || 0,
                  lastUpdated: qrData.lastUpdated || qrData.timestamp,
                  owner: qrData.owner
                };

                toast({
                  title: "Pet QR Code Found!",
                  description: `Found ${normalizedData.name || 'pet'} profile from uploaded image`,
                });
                onScanSuccess(normalizedData);
                return;
              } else {
                setError("Invalid pet QR code in the uploaded image");
              }
            } catch (parseError) {
              console.error("Failed to parse QR data from image:", parseError);
              setError("Invalid QR code format in the uploaded image");
            }
          } else {
            setError("No QR code found in the uploaded image");
          }
        } catch (err) {
          console.error("Error processing uploaded image:", err);
          setError("Failed to process the uploaded image");
        }
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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

              <div className="grid grid-cols-1 gap-3">
                <Button onClick={startCamera} disabled className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Starting Camera...
                </Button>

                <Button onClick={handleUploadClick} variant="outline" className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload QR Image
                </Button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
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

              <div className="flex justify-center">
                <Button onClick={stopCamera} variant="outline">
                  Stop Camera
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