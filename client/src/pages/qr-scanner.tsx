import React from "react";
import { useLocation } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import QRScanner from "@/components/qr-scanner";

export default function QRScannerPage() {
  const [, setLocation] = useLocation();
  const [showScanner, setShowScanner] = React.useState(true);

  const handleScanSuccess = (qrData: any) => {
    console.log("QR scan successful:", qrData);
    // Handle the scanned data - could navigate to pet profile or show details
    setShowScanner(false);
    // Navigate back to dashboard with scanned data
    setLocation("/");
  };

  const handleClose = () => {
    setShowScanner(false);
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setLocation("/")}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">QR Scanner</h1>
        </div>
      </div>

      {/* Scanner */}
      {showScanner && (
        <QRScanner
          onScanSuccess={handleScanSuccess}
          onClose={handleClose}
        />
      )}
    </div>
  );
}