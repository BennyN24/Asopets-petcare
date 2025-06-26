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
            console.log("Camera QR Code detected!", {
              dataLength: code.data.length,
              dataPreview: code.data.substring(0, 100),
              frameNumber: frameCount,
              detectionMethod: frameCount < 30 ? "standard" : "enhanced"
            });
            
            setScanningStatus("QR code found! Processing...");

            try {
              const qrData = JSON.parse(code.data);
              console.log("Camera QR successfully parsed:", {
                type: qrData.type,
                petId: qrData.petId || qrData.id,
                hasOwner: !!qrData.owner,
                hasName: !!(qrData.name || qrData.petName),
                allKeys: Object.keys(qrData)
              });

              // Check for pet_profile type with required fields
              if (qrData.type === 'pet_profile' && (qrData.petId || qrData.id)) {
                console.log("Valid pet QR code detected via camera!");
                scanningActive = false; // Stop scanning
                setScanningStatus("Success! Pet profile found");

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

                console.log("Camera scan normalized data:", normalizedData);

                toast({
                  title: "Pet QR Code Found!",
                  description: `Found ${normalizedData.name || 'pet'} profile with ${normalizedData.medicalRecordCount} records`,
                });
                stopCamera();
                onScanSuccess(normalizedData);
                return;
              } else {
                console.log("Camera QR validation failed:", {
                  actualType: qrData.type,
                  expectedType: 'pet_profile',
                  hasPetId: !!(qrData.petId || qrData.id),
                  actualPetId: qrData.petId || qrData.id,
                  allData: qrData
                });
                
                // Show specific error but continue scanning
                if (frameCount % 60 === 0) { // Show error every 60 frames to avoid spam
                  setScanningStatus(`Found ${qrData.type || 'unknown'} QR - need pet profile`);
                }
              }
            } catch (parseError) {
              console.error("Camera QR JSON parsing failed:", {
                error: parseError,
                rawDataLength: code.data.length,
                rawDataStart: code.data.substring(0, 100),
                rawDataEnd: code.data.substring(Math.max(0, code.data.length - 50))
              });
              
              // Identify QR content type for user feedback
              if (frameCount % 60 === 0) { // Show error every 60 frames
                if (code.data.startsWith('http')) {
                  setScanningStatus("Found URL QR - need pet profile QR");
                } else if (code.data.includes('pet') || code.data.includes('Pet')) {
                  setScanningStatus("Found pet QR but wrong format");
                } else {
                  setScanningStatus(`Found QR but not pet profile: ${code.data.substring(0, 20)}...`);
                }
              }
            }
          } else {
            // Update scanning status periodically
            if (frameCount % 30 === 0) {
              setScanningStatus(`Scanning... (${Math.floor(frameCount / 30)} attempts)`);
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
    console.log("Processing image for QR detection...", {
      width: canvas.width,
      height: canvas.height,
      totalPixels: canvas.width * canvas.height
    });
    
    // Enhanced detection strategies with comprehensive debugging
    const strategies = [
      // Strategy 1: Original image with all inversion options
      () => {
        console.log("Strategy 1: Original image analysis");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        console.log("  - Image data extracted:", imageData.width, "x", imageData.height);
        
        // Try all inversion methods
        const inversionOptions = ["dontInvert", "onlyInvert", "attemptBoth"] as const;
        for (const option of inversionOptions) {
          try {
            console.log(`  - Trying inversion: ${option}`);
            const code = jsQR(imageData.data, imageData.width, imageData.height, {
              inversionAttempts: option,
            });
            if (code) {
              console.log(`QR found with ${option}:`, code.data.substring(0, 50));
              return code;
            }
          } catch (err) {
            console.log(`  - ${option} failed:`, err);
          }
        }
        return null;
      },
      
      // Strategy 2: Multiple scaled versions
      () => {
        console.log("Strategy 2: Multi-scale detection");
        const scales = [0.5, 0.75, 1.0, 1.25, 1.5];
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
        if (!tempCtx) return null;
        
        for (const scale of scales) {
          try {
            const newWidth = Math.floor(canvas.width * scale);
            const newHeight = Math.floor(canvas.height * scale);
            
            if (newWidth > 50 && newHeight > 50 && newWidth < 2000 && newHeight < 2000) {
              tempCanvas.width = newWidth;
              tempCanvas.height = newHeight;
              
              tempCtx.clearRect(0, 0, newWidth, newHeight);
              tempCtx.drawImage(canvas, 0, 0, newWidth, newHeight);
              
              const imageData = tempCtx.getImageData(0, 0, newWidth, newHeight);
              console.log(`  - Scale ${scale}: ${newWidth}x${newHeight}`);
              
              const code = jsQR(imageData.data, imageData.width, imageData.height, {
                inversionAttempts: "attemptBoth",
              });
              
              if (code) {
                console.log(`QR found at scale ${scale}:`, code.data.substring(0, 50));
                return code;
              }
            }
          } catch (err) {
            console.log(`  - Scale ${scale} failed:`, err);
          }
        }
        return null;
      },
      
      // Strategy 3: Enhanced contrast and grayscale
      () => {
        console.log("Strategy 3: Enhanced contrast processing");
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Apply aggressive contrast enhancement
        const contrast = 2.0;
        const brightness = 20;
        
        for (let i = 0; i < data.length; i += 4) {
          // Convert to grayscale first
          const gray = Math.round(0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]);
          
          // Apply contrast and brightness
          let enhanced = contrast * (gray - 128) + 128 + brightness;
          enhanced = Math.min(255, Math.max(0, enhanced));
          
          data[i] = enhanced;     // red
          data[i + 1] = enhanced; // green  
          data[i + 2] = enhanced; // blue
        }
        
        console.log("  - Applied contrast enhancement");
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: "attemptBoth",
        });
        
        if (code) {
          console.log("QR found with contrast enhancement:", code.data.substring(0, 50));
          return code;
        }
        return null;
      }
    ];

    // Execute all strategies sequentially
    for (let i = 0; i < strategies.length; i++) {
      try {
        console.log(`Executing detection strategy ${i + 1}/${strategies.length}`);
        const result = strategies[i]();
        if (result && typeof result === 'object' && 'data' in result) {
          console.log(`Success! QR code detected using strategy ${i + 1}`);
          return result;
        }
      } catch (err) {
        console.error(`Strategy ${i + 1} failed with error:`, err);
      }
    }

    console.log("All detection strategies failed - no QR code found");
    
    // Final diagnostic information
    console.log("Detection summary:", {
      imageSize: `${canvas.width}x${canvas.height}`,
      totalPixels: canvas.width * canvas.height,
      strategiesAttempted: strategies.length,
      canvasDataAvailable: !!ctx.getImageData
    });
    
    return null;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.log("No file selected");
      return;
    }

    setError(null);
    console.log("Starting image upload processing:", {
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileSizeMB: (file.size / (1024 * 1024)).toFixed(2) + "MB"
    });

    if (!file.type.startsWith('image/')) {
      console.error("Invalid file type:", file.type);
      setError("Please select an image file (JPG, PNG, etc.)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      console.error("File too large:", file.size);
      setError("Image file is too large. Please select an image under 10MB.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log("FileReader loaded, creating image element...");
      const img = new Image();
      img.onload = () => {
        try {
          console.log("Image loaded successfully:", {
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            width: img.width,
            height: img.height
          });
          
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            console.error("Failed to get canvas context");
            setError("Failed to process image - canvas context error");
            return;
          }

          // Use natural dimensions for better quality
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          
          console.log("Drawing image to canvas:", canvas.width, "x", canvas.height);
          ctx.drawImage(img, 0, 0);

          // Verify canvas has image data
          const testImageData = ctx.getImageData(0, 0, Math.min(canvas.width, 100), Math.min(canvas.height, 100));
          const hasImageData = testImageData.data.some(pixel => pixel > 0);
          console.log("Canvas verification:", {
            hasImageData,
            firstPixels: Array.from(testImageData.data.slice(0, 12))
          });

          if (!hasImageData) {
            console.error("Canvas appears to be empty");
            setError("Failed to load image data");
            return;
          }

          console.log("Starting QR detection on uploaded image...");
          console.log("Image processing details:", {
            canvasWidth: canvas.width,
            canvasHeight: canvas.height,
            hasContext: !!ctx,
            imageSize: `${img.naturalWidth}x${img.naturalHeight}`,
            fileName: file.name,
            fileType: file.type
          });
          
          const code = processImageForQR(canvas, ctx);

          if (code) {
            console.log("QR Code successfully found in uploaded image:", {
              dataLength: code.data.length,
              dataPreview: code.data.substring(0, 100)
            });

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
          console.error("Error processing uploaded image:", {
            error: err,
            errorMessage: (err as Error).message,
            stack: (err as Error).stack
          });
          setError(`Failed to process the uploaded image: ${(err as Error).message}`);
        }
      };
      
      img.onerror = (imgError) => {
        console.error("Failed to load image:", {
          error: imgError,
          src: img.src?.substring(0, 100) + "...",
          fileName: file.name
        });
        setError(`Failed to load the selected image: ${file.name}`);
      };
      
      console.log("Setting image source...");
      img.src = e.target?.result as string;
    };
    
    reader.onerror = (readerError) => {
      console.error("FileReader error:", {
        error: readerError,
        fileName: file.name,
        fileType: file.type
      });
      setError(`Failed to read the selected file: ${file.name}`);
    };
    
    console.log("Starting FileReader...");
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
                <Button onClick={startCamera} className="w-full">
                  <Camera className="w-4 h-4 mr-2" />
                  Start Camera Scan
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
                <p className="text-xs text-gray-600 font-medium">
                  {scanningStatus}
                </p>
                <p className="text-xs text-gray-500">
                  Position the QR code within the green frame for best results
                </p>
                <p className="text-xs text-blue-600">
                  Enhanced detection: {detectionAttempts} scans completed
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