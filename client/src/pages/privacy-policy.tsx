import React, { useState, useEffect, useRef, useCallback } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield } from "lucide-react";

export default function PrivacyPolicy() {
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
              <Shield className="w-6 h-6 mr-3 text-blue-600" />
              Privacy Policy
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </p>
          </CardHeader>
          <CardContent className="prose max-w-none space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">Information We Collect</h3>
              <p className="text-gray-700 mb-4">
                ASOPETS collects information to provide better services to our users. We collect:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Account information (email, name, contact details)</li>
                <li>Pet information (names, breeds, medical records, photos)</li>
                <li>Medical records and veterinary information</li>
                <li>Usage data and app analytics</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">How We Use Information</h3>
              <p className="text-gray-700 mb-4">
                We use the collected information to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Provide and maintain the ASOPETS service</li>
                <li>Send reminders and notifications about your pets</li>
                <li>Generate QR codes for emergency pet identification</li>
                <li>Improve our services and develop new features</li>
                <li>Communicate with you about your account</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Information Sharing</h3>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share information:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>With veterinarians when you choose to share medical records</li>
                <li>In emergency situations when QR codes are scanned</li>
                <li>With service providers who assist in operating our platform</li>
                <li>When required by law or to protect our rights</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Data Security</h3>
              <p className="text-gray-700">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Your Rights</h3>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Export your pet data</li>
                <li>Opt out of non-essential communications</li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
              <p className="text-gray-700">
                If you have questions about this Privacy Policy, please contact us at support@asopets.com
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}