import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfService() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center">Terms of Service</CardTitle>
            <p className="text-center text-gray-600">ASOPETS - Pet Care Management</p>
            <p className="text-center text-sm text-gray-500">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Acceptance of Terms</h2>
              <p className="mb-3">
                By accessing and using ASOPETS, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Description of Service</h2>
              <p className="mb-3">
                ASOPETS is a pet care management application that helps users:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Track pet medical records and vaccinations</li>
                <li>Schedule and manage medical reminders</li>
                <li>Monitor pet expenses and budgets</li>
                <li>Find and rate veterinary clinics</li>
                <li>Store pet photos and health documentation</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">User Responsibilities</h2>
              <p className="mb-3">You agree to:</p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Use the service only for lawful purposes</li>
                <li>Respect the privacy and rights of other users</li>
                <li>Not attempt to interfere with the service's operation</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Medical Disclaimer</h2>
              <p className="mb-3">
                <strong>Important:</strong> ASOPETS is a pet care management tool and does not provide medical advice. 
                The information stored and managed through this app should not replace professional veterinary care. 
                Always consult with qualified veterinarians for medical decisions regarding your pets.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Data Ownership</h2>
              <p className="mb-3">
                You retain ownership of all data you input into ASOPETS, including pet information, medical records, 
                and photos. We provide tools to export your data at any time.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Service Availability</h2>
              <p className="mb-3">
                We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                We may perform maintenance, updates, or modifications that temporarily affect service availability.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Limitation of Liability</h2>
              <p className="mb-3">
                ASOPETS shall not be liable for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use of the service.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Account Termination</h2>
              <p className="mb-3">
                You may terminate your account at any time. We reserve the right to suspend or terminate accounts 
                that violate these terms of service.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Changes to Terms</h2>
              <p className="mb-3">
                We may update these terms from time to time. Users will be notified of significant changes, 
                and continued use of the service constitutes acceptance of updated terms.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Contact Information</h2>
              <p className="mb-3">
                For questions about these Terms of Service, please contact us through the app's support section.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}