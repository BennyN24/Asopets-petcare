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
                setScanSuccess(true);
                toast({
                  title: "Pet QR Code Found!",
                  description: "Loading pet information...",
                });
                
                // Show success animation before processing
                setTimeout(() => {
                  stopCamera();
                  onScanSuccess(qrData);
                }, 1500);
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
    setScanSuccess(false);
  };

  const handleTestScan = () => {
    // Generate a test QR code for the current user's first pet (if any)
    const testData = {
      type: "pet_profile",
      petId: 10, // Using the pet ID from the logs
      ownerId: "6f1a0727-3380-4dd8-b401-8483bb8c57f8",
      timestamp: new Date().toISOString(),
    };

    setScanSuccess(true);
    setScannedPetCategory("rabbit"); // Based on the pet data from logs
    
    toast({
      title: "Test QR Code Scanned!",
      description: "Loading real pet information...",
    });

    // Show success animation before processing
    setTimeout(() => {
      stopCamera();
      onScanSuccess(testData);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md relative overflow-hidden">
        <FloatingParticles show={scanSuccess} />
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
          {/* Pet Mascot Animation */}
          <AnimatedPetMascot 
            isScanning={isScanning} 
            scanSuccess={scanSuccess}
            petCategory={scannedPetCategory}
          />
          
          {!isScanning ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
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
                
                {/* QR Code overlay with animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div 
                    className={`w-48 h-48 border-2 rounded-lg transition-all duration-300 ${
                      scanSuccess 
                        ? 'border-green-400 border-solid opacity-90 shadow-lg shadow-green-400/50' 
                        : 'border-white border-dashed opacity-70'
                    }`}
                  >
                    {/* Scanning line animation */}
                    {isScanning && !scanSuccess && (
                      <div className="relative w-full h-full overflow-hidden">
                        <div className="absolute w-full h-0.5 bg-blue-400 opacity-80 animate-ping"></div>
                        <div 
                          className="absolute w-full h-0.5 bg-blue-400"
                          style={{
                            animation: 'scan-line 2s linear infinite',
                          }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex space-x-2">
                <Button onClick={stopCamera} variant="outline" className="flex-1">
                  Stop Camera
                </Button>
                <Button onClick={handleTestScan} className="flex-1">
                  <Share2 className="w-4 h-4 mr-2" />
                  Test Scan
                </Button>
              </div>

              {!scanSuccess && (
                <p className="text-xs text-gray-500 text-center">
                  Position the QR code within the frame to scan
                </p>
              )}
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