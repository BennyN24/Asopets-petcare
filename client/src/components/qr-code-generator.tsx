import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, Share, Download, Copy } from "lucide-react";
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
    const baseUrl = window.location.origin;
    
    // Generate comprehensive pet data including profile and medical records
    const petData = {
      type: "pet_complete",
      pet: {
        name: pet.name,
        category: pet.category,
        breed: pet.breed,
        dateOfBirth: pet.dateOfBirth,
        microchipId: pet.microchipId,
        birthmarks: pet.birthmarks,
      },
      medicalRecords: medicalRecords.map(record => ({
        type: record.type,
        title: record.title,
        dateAdministered: record.dateAdministered,
        veterinarian: record.veterinarian,
        clinic: record.clinic,
        nextDueDate: record.nextDueDate,
      })),
      recordCount: medicalRecords.length,
      generatedAt: new Date().toISOString(),
      shareUrl: `${baseUrl}/shared/pet/${pet.id}`,
    };
    return JSON.stringify(petData);
  };

  const generateQRCode = async () => {
    setIsGenerating(true);
    try {
      const qrData = generateQRData();
      const qrCodeDataUrl = await QRCode.toDataURL(qrData, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
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
    link.download = `${pet.name}-complete-qr-code.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "QR Code downloaded",
      description: "The QR code has been saved to your device.",
    });
  };

  const copyQRData = async () => {
    try {
      const qrData = generateQRData();
      await navigator.clipboard.writeText(qrData);
      toast({
        title: "Data copied",
        description: "QR code data has been copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy data to clipboard.",
        variant: "destructive",
      });
    }
  };

  const shareQRCode = async () => {
    if (!qrCodeUrl) return;

    try {
      // Convert data URL to blob
      const response = await fetch(qrCodeUrl);
      const blob = await response.blob();
      const file = new File([blob], `${pet.name}-complete-qr.png`, { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `${pet.name} - Complete Profile & Medical Records`,
          text: `QR code for ${pet.name}'s complete profile and medical records`,
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
          <Badge variant="outline">
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
            <img 
              src={qrCodeUrl} 
              alt={`QR Code for ${pet.name}`}
              className="w-64 h-64 mx-auto border rounded-lg"
            />
          ) : (
            <div className="w-64 h-64 flex items-center justify-center bg-gray-100 rounded-lg mx-auto">
              <QrCode className="w-12 h-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="text-center text-sm text-gray-600">
          <p className="font-medium">{pet.name}'s Complete Profile & Medical Records</p>
          <p>Scan to view pet information and {medicalRecords.length} medical record{medicalRecords.length !== 1 ? 's' : ''}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
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
          
          <Button
            variant="outline"
            size="sm"
            onClick={copyQRData}
            className="col-span-2"
          >
            <Copy className="w-4 h-4 mr-1" />
            Copy Data
          </Button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          <p>QR code contains complete pet profile and medical record information</p>
          <p>Generated on {new Date().toLocaleDateString()}</p>
        </div>
      </CardContent>
    </Card>
  );
}