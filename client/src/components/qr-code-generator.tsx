import React, { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Share, Download, Printer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import QRCode from "qrcode";
import type { Pet, MedicalRecord } from "@shared/schema";

interface QRCodeGeneratorProps {
  pet: Pet;
  medicalRecords?: MedicalRecord[];
}

export default function QRCodeGenerator({ pet, medicalRecords = [] }: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();

  const generateQRData = () => {
    // Generate scannable pet profile data that matches scanner expectations
    const petData = {
      type: "pet_profile",
      petId: pet.id,
      ownerId: pet.userId,
      name: pet.name,
      petName: pet.name, // Add alias for compatibility
      category: pet.category,
      breed: pet.breed,
      dateOfBirth: pet.dateOfBirth,
      age: pet.age,
      microchipId: pet.microchipId,
      birthmarks: pet.birthmarks,
      medicalRecordCount: medicalRecords.length,
      lastUpdated: new Date().toISOString(),
      timestamp: new Date().toISOString(),
      owner: {
        name: "Pet Owner", // Basic info for contact
        phone: "Contact via QR scan",
        email: "Available on scan"
      }
    };
    console.log("Generated QR data for pet:", petData);
    return JSON.stringify(petData);
  };

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const qrData = generateQRData();
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 600,
        margin: 4,
        color: {
          dark: '#1a1a1a',
          light: '#ffffff'
        },
        errorCorrectionLevel: 'H' // High error correction for reliable mobile scanning
      });
      setQrCodeUrl(qrCodeDataUrl);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate QR code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.href = qrCodeUrl;
    link.download = `${pet.name.replace(/[^a-zA-Z0-9]/g, '_')}-profile-qr.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code Downloaded",
      description: `${pet.name}'s QR code saved to your device`,
    });
  };

  const printQR = () => {
    if (!qrCodeUrl) return;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>${pet.name} - Pet Profile QR Code</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                text-align: center; 
                padding: 20px;
                margin: 0;
              }
              .header { 
                margin-bottom: 20px;
                border-bottom: 2px solid #333;
                padding-bottom: 20px;
              }
              .qr-container { 
                margin: 30px 0;
              }
              .footer {
                margin-top: 30px;
                font-size: 12px;
                color: #666;
                border-top: 1px solid #ccc;
                padding-top: 20px;
              }
              img { 
                max-width: 400px; 
                height: auto;
                border: 2px solid #333;
                padding: 10px;
                background: white;
              }
              @media print {
                body { margin: 0; }
              }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>${pet.name}</h1>
              <h2>Pet Profile QR Code</h2>
              <p><strong>Category:</strong> ${pet.category} | <strong>Breed:</strong> ${pet.breed || 'Mixed'}</p>
              ${pet.microchipId ? `<p><strong>Microchip ID:</strong> ${pet.microchipId}</p>` : ''}
            </div>
            <div class="qr-container">
              <img src="${qrCodeUrl}" alt="${pet.name} QR Code" />
            </div>
            <div class="footer">
              <p>Scan this QR code with the ASOPETS app to view ${pet.name}'s complete profile and medical records.</p>
              <p>Generated on ${new Date().toLocaleDateString()}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }

    toast({
      title: "Print QR Code",
      description: `Print dialog opened for ${pet.name}'s QR code`,
    });
  };

  const shareWebLink = async () => {
    try {
      const shareUrl = `https://asopets.com/share/pet/${pet.shareToken}`;
      
      if (navigator.share) {
        await navigator.share({
          title: `${pet.name} - Pet Profile`,
          text: `View ${pet.name}'s pet profile and contact information`,
          url: shareUrl
        });
        
        toast({
          title: "Profile Shared",
          description: `Shared ${pet.name}'s profile link`,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Link Copied",
          description: "Pet profile link copied to clipboard",
        });
      }
    } catch (error) {
      console.error("Share link error:", error);
      toast({
        title: "Share Failed",
        description: "Could not share profile link",
        variant: "destructive"
      });
    }
  };

  const shareQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], `${pet.name.replace(/[^a-zA-Z0-9]/g, '_')}-profile-qr.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${pet.name} Profile QR Code`,
          text: `Scan this QR code to view ${pet.name}'s pet profile and medical records`,
          files: [file],
        });
      } else {
        // Fallback to copying the share URL
        const shareUrl = `${window.location.origin}/shared/pet/${pet.id}`;
        
        await navigator.clipboard.writeText(shareUrl);
        toast({
          title: "Share link copied",
          description: "Share link has been copied to clipboard.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to share QR code.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    generateQRCode();
  }, [pet, medicalRecords]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <QrCode className="w-5 h-5 mr-2 text-primary" />
            <span>QR Code</span>
          </div>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            Complete Profile & Records
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          {isGenerating ? (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg mx-auto">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : qrCodeUrl ? (
            <div className="relative">
              <img 
                src={qrCodeUrl} 
                alt={`QR Code for ${pet.name}`}
                className="w-64 h-64 mx-auto border-2 border-gray-200 rounded-lg shadow-sm bg-white p-2"
              />
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  HD
                </Badge>
              </div>
            </div>
          ) : (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg mx-auto">
              <QrCode className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-600 space-y-1">
          <p className="font-medium text-lg text-gray-800">{pet.name}'s Profile QR Code</p>
          <p className="text-gray-600">Scan to view pet information and {medicalRecords.length} medical record{medicalRecords.length !== 1 ? 's' : ''}</p>
          <div className="flex justify-center items-center space-x-4 text-xs text-gray-500 mt-2">
            <span>Pet ID: {pet.id}</span>
            <span>•</span>
            <span>High Quality</span>
            <span>•</span>
            <span>Mobile Optimized</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <Button
            variant="outline"
            size="sm"
            onClick={downloadQRCode}
            disabled={!qrCodeUrl}
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareQRCode}
            disabled={!qrCodeUrl}
          >
            <Share className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={printQR}
            disabled={!qrCodeUrl}
          >
            <Printer className="w-4 h-4 mr-1" />
            Print
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={shareWebLink}
            disabled={isGenerating}
          >
            <Share className="w-4 h-4 mr-1" />
            Share Link
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>QR code contains complete pet profile data for scanning and sharing</p>
          <p>Compatible with ASOPETS mobile app scanner</p>
          <p className="text-blue-600">
            Share Link: https://asopets.com/share/pet/{pet.shareToken}
          </p>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}