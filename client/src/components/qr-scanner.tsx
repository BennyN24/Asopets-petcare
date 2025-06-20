import * as React from "react";
// @ts-ignore
import jsQR from "jsqr";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { QrCode, Camera, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onClose: () => void;
  onScanSuccess: (data: any) => void;
}

export default function QRScanner({ onClose, onScanSuccess }: QRScannerProps) {
  const [isScanning, setIsScanning] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [stream, setStream] = React.useState<MediaStream | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
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

        try {
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });

          if (code) {
            try {
              const qrData = JSON.parse(code.data);
              if (qrData.type === 'pet_profile' && qrData.petId && qrData.ownerId) {
                toast({
                  title: "Pet QR Code Found!",
                  description: "Loading pet information...",
                });
                stopCamera();
                onScanSuccess(qrData);
                return;
              } else {
                setError('This QR code is not a valid pet profile. Please scan a pet QR code.');
                setTimeout(() => setError(null), 3000);
              }
            } catch (e) {
              setError('Invalid QR code format. Please scan a valid pet profile QR code.');
              setTimeout(() => setError(null), 3000);
            }
          }
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
                onClick={handleTestScan}
                className="w-full"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Test Scan (Real Data)
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