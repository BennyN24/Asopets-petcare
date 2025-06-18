import React from "react";
import { ArrowLeft } from "lucide-react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPolicy() {
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
            <CardTitle className="text-2xl text-center">Privacy Policy</CardTitle>
            <p className="text-center text-gray-600">ASOPETS - Pet Care Management</p>
            <p className="text-center text-sm text-gray-500">Last updated: December 2024</p>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Information We Collect</h2>
              <p className="mb-3">
                ASOPETS collects information you provide directly to us, including:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Account information (name, email address)</li>
                <li>Pet information (names, breeds, medical records)</li>
                <li>Veterinary clinic ratings and reviews</li>
                <li>Medical records and health data for your pets</li>
                <li>Photos of your pets and medical documents</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">How We Use Your Information</h2>
              <p className="mb-3">We use the information we collect to:</p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Provide and maintain the ASOPETS service</li>
                <li>Send reminders for pet medical appointments</li>
                <li>Help you track your pet's medical history</li>
                <li>Improve our services and user experience</li>
                <li>Communicate with you about your account</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Information Sharing</h2>
              <p className="mb-3">
                We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in our operations</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Data Security</h2>
              <p className="mb-3">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes:
              </p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Encrypted data transmission and storage</li>
                <li>Secure authentication systems</li>
                <li>Regular security audits and updates</li>
                <li>Limited access to personal data</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Your Rights</h2>
              <p className="mb-3">You have the right to:</p>
              <ul className="list-disc pl-6 mb-3 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate data</li>
                <li>Delete your account and data</li>
                <li>Export your data</li>
                <li>Opt out of communications</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Children's Privacy</h2>
              <p className="mb-3">
                My PetBB is not intended for children under 13. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-lg font-semibold mb-3">Contact Us</h2>
              <p className="mb-3">
                If you have questions about this Privacy Policy, please contact us through the app's support section.
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
