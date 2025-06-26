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
  const [scanningStatus, setScanningStatus] = useState<string>("Initializing camera...");
  const [detectionAttempts, setDetectionAttempts] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement>(null);
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

      // Enhanced camera constraints for better QR detection
      const constraints = {
        video: {
          facingMode: { ideal: "environment" }, // Use back camera on mobile
          width: { ideal: 1920, max: 2560, min: 640 },
          height: { ideal: 1080, max: 1440, min: 480 },
          frameRate: { ideal: 30, max: 60, min: 15 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        // Wait for video to be ready before starting detection
        videoRef.current.onloadedmetadata = () => {
          console.log("Video metadata loaded, starting QR detection");
          setScanningStatus("Camera ready, scanning for QR codes...");
          videoRef.current?.play().then(() => {
            console.log("Video playing, dimensions:", videoRef.current?.videoWidth, "x", videoRef.current?.videoHeight);
            // Start scanning immediately when video starts playing
            startQRDetection();
          }).catch((playError) => {
            console.error("Video play error:", playError);
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

  const enhanceCameraFrame = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Apply contrast and brightness enhancement
    const contrast = 1.2;
    const brightness = 10;

    for (let i = 0; i < data.length; i += 4) {
      // Enhance contrast and brightness
      data[i] = Math.min(255, Math.max(0, contrast * (data[i] - 128) + 128 + brightness));     // red
      data[i + 1] = Math.min(255, Math.max(0, contrast * (data[i + 1] - 128) + 128 + brightness)); // green
      data[i + 2] = Math.min(255, Math.max(0, contrast * (data[i + 2] - 128) + 128 + brightness)); // blue
    }

    context.putImageData(imageData, 0, 0);
    return imageData;
  };

  const drawScanningOverlay = (canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) => {
    // Clear overlay
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw scanning frame
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const frameSize = Math.min(canvas.width, canvas.height) * 0.6;
    const frameX = centerX - frameSize / 2;
    const frameY = centerY - frameSize / 2;
    
    context.strokeStyle = '#00ff00';
    context.lineWidth = 3;
    context.strokeRect(frameX, frameY, frameSize, frameSize);
    
    // Draw corner markers
    const cornerLength = 20;
    context.lineWidth = 4;
    
    // Top-left corner
    context.beginPath();
    context.moveTo(frameX, frameY + cornerLength);
    context.lineTo(frameX, frameY);
    context.lineTo(frameX + cornerLength, frameY);
    context.stroke();
    
    // Top-right corner
    context.beginPath();
    context.moveTo(frameX + frameSize - cornerLength, frameY);
    context.lineTo(frameX + frameSize, frameY);
    context.lineTo(frameX + frameSize, frameY + cornerLength);
    context.stroke();
    
    // Bottom-left corner
    context.beginPath();
    context.moveTo(frameX, frameY + frameSize - cornerLength);
    context.lineTo(frameX, frameY + frameSize);
    context.lineTo(frameX + cornerLength, frameY + frameSize);
    context.stroke();
    
    // Bottom-right corner
    context.beginPath();
    context.moveTo(frameX + frameSize - cornerLength, frameY + frameSize);
    context.lineTo(frameX + frameSize, frameY + frameSize);
    context.lineTo(frameX + frameSize, frameY + frameSize - cornerLength);
    context.stroke();
  };

  const multiScaleQRDetection = (context: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    // Try detection at multiple scales and regions
    const scales = [1, 0.8, 0.6, 1.2];
    const regions = [
      // Full frame
      { x: 0, y: 0, w: 1, h: 1 },
      // Center region (common QR placement)
      { x: 0.2, y: 0.2, w: 0.6, h: 0.6 },
      // Upper half
      { x: 0, y: 0, w: 1, h: 0.5 },
      // Lower half
      { x: 0, y: 0.5, w: 1, h: 0.5 }
    ];

    for (const scale of scales) {
      for (const region of regions) {
        try {
          const x = Math.floor(region.x * canvas.width);
          const y = Math.floor(region.y * canvas.height);
          const w = Math.floor(region.w * canvas.width * scale);
          const h = Math.floor(region.h * canvas.height * scale);

          if (w > 100 && h > 100) { // Minimum size check
            const imageData = context.getImageData(x, y, w, h);
            
            // Try with different detection methods
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: "attemptBoth"
            });
            
            if (code) {
              console.log(`QR detected at scale ${scale}, region ${JSON.stringify(region)}`);
              return code;
            }
          }
        } catch (err) {
          // Continue to next attempt
        }
      }
    }
    return null;
  };

  const startQRDetection = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const context = canvas?.getContext('2d');
    const overlayContext = overlayCanvas?.getContext('2d');

    if (!canvas || !video || !context || !overlayCanvas || !overlayContext) return;

    let scanningActive = true;
    let lastScanTime = 0;
    let frameCount = 0;

    const scanFrame = () => {
      if (!scanningActive || !isScanning) return;

      const currentTime = Date.now();
      frameCount++;

      // Dynamic throttling - scan faster initially, then slow down
      const throttleTime = frameCount < 30 ? 100 : 150;
      
      if (currentTime - lastScanTime < throttleTime) {
        requestAnimationFrame(scanFrame);
        return;
      }

      lastScanTime = currentTime;

      if (video.readyState === video.HAVE_ENOUGH_DATA && video.videoWidth > 0 && video.videoHeight > 0) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        overlayCanvas.width = video.videoWidth;
        overlayCanvas.height = video.videoHeight;

        // Draw the current frame
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Draw scanning overlay
        drawScanningOverlay(overlayCanvas, overlayContext);

        // Update detection attempts counter
        setDetectionAttempts(prev => prev + 1);
        
        // Update status every 10 frames
        if (frameCount % 10 === 0) {
          setScanningStatus(`Scanning... (${Math.floor(frameCount / 10)} attempts)`);
        }

        try {
          // First try standard detection
          let imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          let code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "attemptBoth",
          });

          // If no QR found, try enhanced detection
          if (!code) {
            // Apply image enhancement
            enhanceCameraFrame(context, canvas);
            
            // Try multi-scale detection
            code = multiScaleQRDetection(context, canvas);
          }

          if (code && code.data) {
            console.log("QR Code detected! Raw data length:", code.data.length);
            console.log("Raw QR code data:", code.data);

            try {
              const qrData = JSON.parse(code.data);
              console.log("Successfully parsed QR data:", qrData);
              console.log("QR Data validation check:", {
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
                console.log("Valid pet QR code detected successfully!");
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

                console.log("Normalized QR data:", normalizedData);

                toast({
                  title: "Pet QR Code Found!",
                  description: `Found ${normalizedData.name || 'pet'} profile with ${normalizedData.medicalRecordCount} records`,
                });
                stopCamera();
                onScanSuccess(normalizedData);
                return;
              } else {
                console.log("QR code validation failed:", {
                  typeMatch: qrData.type === 'pet_profile',
                  hasPetId: !!(qrData.petId || qrData.id),
                  hasOwnerId: !!(qrData.ownerId || qrData.userId),
                  actualType: qrData.type,
                  actualPetId: qrData.petId || qrData.id,
                  actualOwnerId: qrData.ownerId || qrData.userId
                });
              }
            } catch (parseError) {
              console.error("QR JSON parsing failed:", parseError);
              console.log("Raw data that failed to parse:", code.data);
              console.log("First 100 chars:", code.data.substring(0, 100));
            }
          }
        } catch (err) {
          console.error("QR detection error:", err);
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

  const processImageForQR = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): any => {
    // Try multiple detection strategies for better QR code recognition
    const strategies = [
      // Original size
      () => ctx.getImageData(0, 0, canvas.width, canvas.height),
      // Resize to standard size for better detection
      () => {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return null;
        
        const maxSize = 800;
        const scale = Math.min(maxSize / canvas.width, maxSize / canvas.height);
        tempCanvas.width = canvas.width * scale;
        tempCanvas.height = canvas.height * scale;
        
        tempCtx.drawImage(canvas, 0, 0, tempCanvas.width, tempCanvas.height);
        return tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
      },
      // Grayscale conversion for better contrast
      () => {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
          data[i] = gray;     // red
          data[i + 1] = gray; // green
          data[i + 2] = gray; // blue
        }
        return imageData;
      }
    ];

    for (let i = 0; i < strategies.length; i++) {
      try {
        const imageData = strategies[i]();
        if (!imageData) continue;

        console.log(`Trying QR detection strategy ${i + 1}/3...`);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "dontInvert",
        });

        if (code) {
          console.log(`QR Code found using strategy ${i + 1}:`, code.data.substring(0, 100));
          return code;
        }
      } catch (err) {
        console.log(`Strategy ${i + 1} failed:`, err);
      }
    }

    // Try with different jsQR options
    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "attemptBoth",
      });
      if (code) {
        console.log("QR Code found with inversionAttempts:", code.data.substring(0, 100));
        return code;
      }
    } catch (err) {
      console.log("Final attempt failed:", err);
    }

    return null;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);
    console.log("Processing uploaded image:", file.name, file.type, file.size);

    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          console.log("Image loaded successfully:", img.width, "x", img.height);
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            setError("Failed to process image");
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          console.log("Canvas prepared, attempting QR detection...");
          const code = processImageForQR(canvas, ctx);

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
                  owner: qrData.owner,
                  scannedAt: new Date().toISOString()
                };

                toast({
                  title: "Pet QR Code Found!",
                  description: `Found ${normalizedData.name || 'pet'} profile from uploaded image`,
                });
                onScanSuccess(normalizedData);
                return;
              } else {
                console.log("QR validation failed:", {
                  type: qrData.type,
                  hasPetId: !!(qrData.petId || qrData.id),
                  petId: qrData.petId || qrData.id
                });
                setError("This QR code is not a valid pet profile");
              }
            } catch (parseError) {
              console.error("Failed to parse QR data from image:", parseError);
              console.log("Raw QR data:", code.data);
              setError("This QR code contains invalid data format");
            }
          } else {
            console.log("No QR code detected in the uploaded image");
            setError("No QR code found in this image. Please make sure the QR code is clear and visible.");
          }
        } catch (err) {
          console.error("Error processing uploaded image:", err);
          setError("Failed to process the uploaded image");
        }
      };
      
      img.onerror = () => {
        console.error("Failed to load image");
        setError("Failed to load the selected image");
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      console.error("Failed to read file");
      setError("Failed to read the selected file");
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
                <canvas
                  ref={overlayCanvasRef}
                  className="absolute inset-0 w-full h-64 pointer-events-none"
                />

                {/* Scanning status overlay */}
                <div className="absolute top-2 left-2 right-2 bg-black bg-opacity-60 text-white text-xs p-2 rounded">
                  <div className="flex justify-between items-center">
                    <span>{scanningStatus}</span>
                    <span className="text-green-400">{detectionAttempts} scans</span>
                  </div>
                </div>

                {/* Center targeting guide */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="w-48 h-48 border-2 border-green-400 rounded-lg animate-pulse">
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-green-400"></div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-green-400"></div>
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-green-400"></div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-green-400"></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button onClick={stopCamera} variant="outline" size="sm">
                  Stop Camera
                </Button>
                <Button onClick={handleUploadClick} variant="ghost" size="sm">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Image
                </Button>
              </div>

              <div className="text-center space-y-2">
                <p className="text-xs text-gray-500">
                  Position the QR code within the green frame
                </p>
                <p className="text-xs text-blue-600">
                  Enhanced scanning with multiple detection methods active
                </p>
              </div>
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