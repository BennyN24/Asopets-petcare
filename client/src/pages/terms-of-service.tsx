import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText } from "lucide-react";

export default function TermsOfService() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6">
          <Button 
            onClick={() => setLocation("/")} 
            variant="ghost" 
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-2xl">
              <FileText className="w-6 h-6 mr-3 text-blue-600" />
              Terms of Service
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">1. Acceptance of Terms</h3>
              <p className="text-gray-700">
                By accessing and using ASOPETS, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">2. Service Description</h3>
              <p className="text-gray-700 mb-4">
                ASOPETS is a pet care management platform that allows users to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Track pet medical records and vaccinations</li>
                <li>Set reminders for pet care activities</li>
                <li>Generate QR codes for pet identification</li>
                <li>Manage pet expenses and budgets</li>
                <li>Find and rate veterinary clinics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">3. User Responsibilities</h3>
              <p className="text-gray-700 mb-4">
                As a user of ASOPETS, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide accurate and complete information about your pets</li>
                <li>Keep your medical records up to date</li>
                <li>Use the service responsibly and lawfully</li>
                <li>Respect the privacy of other users</li>
                <li>Not share false or misleading information</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">4. Medical Disclaimer</h3>
              <p className="text-gray-700">
                ASOPETS is not a substitute for professional veterinary advice, diagnosis, or treatment. Always seek the advice of your veterinarian with any questions you may have regarding your pet's health. Never disregard professional veterinary advice or delay in seeking it because of something you have read on ASOPETS.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">5. Data and Privacy</h3>
              <p className="text-gray-700">
                Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, to understand our practices regarding the collection, use, and disclosure of your information.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">6. Service Availability</h3>
              <p className="text-gray-700">
                We strive to provide reliable service, but cannot guarantee 100% uptime. The service may be temporarily unavailable due to maintenance, updates, or technical issues.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">7. Limitation of Liability</h3>
              <p className="text-gray-700">
                ASOPETS shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">8. Changes to Terms</h3>
              <p className="text-gray-700">
                We reserve the right to modify these terms at any time. We will notify users of any material changes via email or through the app. Continued use of the service after changes constitutes acceptance of the new terms.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">9. Contact Information</h3>
              <p className="text-gray-700">
                If you have any questions about these Terms of Service, please contact us at support@asopets.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}