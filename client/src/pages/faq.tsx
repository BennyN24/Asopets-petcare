
import React from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ArrowLeft, HelpCircle, ChevronDown, ChevronRight } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Getting Started
  {
    category: "Getting Started",
    question: "What is ASOPETS?",
    answer: "ASOPETS is a comprehensive pet care management app that helps you track your pet's medical records, vaccinations, schedule reminders, monitor expenses, and maintain complete health histories. It's designed to be your pet's digital health companion."
  },
  {
    category: "Getting Started",
    question: "How do I create an account?",
    answer: "You can create an account by clicking 'Join ASOPETS' on the login page. Enter your email and password, then verify your email address through the confirmation link we'll send you."
  },
  {
    category: "Getting Started",
    question: "Is ASOPETS free to use?",
    answer: "Yes, ASOPETS is completely free to use. All features including medical records, reminders, QR codes, and data export are available at no cost."
  },

  // Pet Management
  {
    category: "Pet Management",
    question: "How do I add my pet to the app?",
    answer: "Go to your dashboard and click the 'Add Pet' card. Fill in your pet's information including name, breed, date of birth, and upload a photo. You can add multiple pets to your account."
  },
  {
    category: "Pet Management",
    question: "Can I manage multiple pets?",
    answer: "Yes! ASOPETS supports managing multiple pets. Each pet has their own profile with separate medical records, reminders, and QR codes."
  },
  {
    category: "Pet Management",
    question: "What information should I include in my pet's profile?",
    answer: "Include your pet's name, breed, date of birth, microchip ID (if applicable), physical characteristics, and a recent photo. This information is essential for identification and medical purposes."
  },

  // Medical Records
  {
    category: "Medical Records",
    question: "What types of medical records can I track?",
    answer: "You can track vaccinations, deworming treatments, surgeries, general treatments, checkups, lab tests, and grooming appointments. Each record can include details like veterinarian, clinic, cost, and photos."
  },
  {
    category: "Medical Records",
    question: "Can I attach photos to medical records?",
    answer: "Yes! You can attach multiple photos to any medical record. This is useful for documenting conditions, treatments, or lab results. Photos are automatically compressed for optimal storage."
  },
  {
    category: "Medical Records",
    question: "How do I share medical records with my vet?",
    answer: "You can generate a QR code for your pet that contains their medical history. Your vet can scan this code to access the information, or you can export your data and share it directly."
  },

  // Reminders & Notifications
  {
    category: "Reminders & Notifications",
    question: "How do reminders work?",
    answer: "ASOPETS automatically creates reminders for upcoming vaccinations, treatments, and checkups based on your pet's medical records. You'll see overdue reminders prominently displayed on your dashboard."
  },
  {
    category: "Reminders & Notifications",
    question: "Can I set custom reminders?",
    answer: "Currently, reminders are automatically generated based on medical procedures. We're working on adding custom reminder functionality in future updates."
  },
  {
    category: "Reminders & Notifications",
    question: "What happens when a reminder is overdue?",
    answer: "Overdue reminders appear in red on your dashboard and in the notification bell. You can mark them as completed once you've taken care of the task."
  },

  // QR Codes & Sharing
  {
    category: "QR Codes & Sharing",
    question: "What are QR codes for?",
    answer: "Each pet gets a unique QR code that contains their profile and medical information. This is useful for emergencies, sharing with vets, or if your pet gets lost. Anyone who scans the code can see your contact information and your pet's medical history."
  },
  {
    category: "QR Codes & Sharing",
    question: "Can I print my pet's QR code?",
    answer: "Yes! You can view and save your pet's QR code from their profile page. Print it and attach it to your pet's collar or keep it in your wallet for emergencies."
  },
  {
    category: "QR Codes & Sharing",
    question: "Is my pet's information secure when shared via QR code?",
    answer: "QR codes only share essential information like your pet's name, breed, medical summary, and your contact details. Sensitive information is not included, and you control what information is accessible."
  },

  // Data & Privacy
  {
    category: "Data & Privacy",
    question: "How is my data protected?",
    answer: "We use industry-standard security measures to protect your data. All information is encrypted in transit and at rest. We never sell your personal information to third parties."
  },
  {
    category: "Data & Privacy",
    question: "Can I export my pet's data?",
    answer: "Yes! Go to your profile page and click 'Export My Data'. You'll download a JSON file containing all your pets' information, medical records, and reminders."
  },
  {
    category: "Data & Privacy",
    question: "What happens if I delete my account?",
    answer: "If you delete your account, all your data including pet profiles, medical records, and reminders will be permanently deleted. Make sure to export your data first if you want to keep it."
  },

  // Technical Support
  {
    category: "Technical Support",
    question: "The app isn't working properly. What should I do?",
    answer: "First, try refreshing the page or logging out and back in. If issues persist, contact our support team through the 'Contact Support' feature in your profile page with details about the problem."
  },
  {
    category: "Technical Support",
    question: "Can I use ASOPETS offline?",
    answer: "ASOPETS has basic offline functionality - you can view your pets and records when offline. However, adding new records, photos, or syncing data requires an internet connection."
  },
  {
    category: "Technical Support",
    question: "Is there a mobile app?",
    answer: "ASOPETS is a web-based app that works perfectly on mobile browsers. You can add it to your phone's home screen for a native app-like experience."
  },

  // Veterinary Integration
  {
    category: "Veterinary Integration",
    question: "Can my veterinarian access ASOPETS?",
    answer: "Veterinarians can view your pet's information when you share the QR code or export the data. We're working on direct veterinary integration for future updates."
  },
  {
    category: "Veterinary Integration",
    question: "How do I find veterinary clinics near me?",
    answer: "Use the 'Find Vet Clinics' feature on your dashboard. It will show nearby veterinary clinics with ratings, contact information, and directions."
  }
];

const categories = [...new Set(faqData.map(item => item.category))];

export default function FAQ() {
  const [, setLocation] = useLocation();
  const [openItems, setOpenItems] = React.useState<string[]>([]);

  const toggleItem = (question: string) => {
    setOpenItems(prev => 
      prev.includes(question) 
        ? prev.filter(item => item !== question)
        : [...prev, question]
    );
  };

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
              <HelpCircle className="w-6 h-6 mr-3 text-blue-600" />
              Frequently Asked Questions
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Find answers to common questions about ASOPETS
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            {categories.map((category) => (
              <div key={category}>
                <h3 className="text-lg font-semibold mb-4 text-gray-900 border-b pb-2">
                  {category}
                </h3>
                <div className="space-y-3">
                  {faqData
                    .filter(item => item.category === category)
                    .map((item, index) => (
                      <Collapsible 
                        key={`${category}-${index}`}
                        open={openItems.includes(item.question)}
                        onOpenChange={() => toggleItem(item.question)}
                      >
                        <CollapsibleTrigger className="w-full">
                          <Card className="hover:bg-gray-50 transition-colors cursor-pointer">
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium text-left text-gray-900">
                                  {item.question}
                                </h4>
                                {openItems.includes(item.question) ? (
                                  <ChevronDown className="w-5 h-5 text-gray-500" />
                                ) : (
                                  <ChevronRight className="w-5 h-5 text-gray-500" />
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-4 pb-4 text-gray-700">
                            {item.answer}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}
                </div>
              </div>
            ))}

            {/* Contact Support Section */}
            <div className="mt-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                Still have questions?
              </h3>
              <p className="text-blue-700 mb-4">
                If you can't find the answer you're looking for, our support team is here to help!
              </p>
              <Button 
                onClick={() => setLocation("/profile")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
