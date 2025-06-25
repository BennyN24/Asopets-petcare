import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";

const checkupTypes = [
  "Annual Physical Exam",
  "Wellness Check",
  "Senior Pet Exam",
  "Puppy/Kitten Check",
  "Pre-Surgery Exam",
  "Follow-up Visit",
  "Emergency Visit",
  "Other"
];

export default function CheckupForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "checkup" as const,
    title: "",
    description: "",
    dateAdministered: "",
    nextDueDate: "",
    veterinarian: "",
    clinic: "",
    batchNumber: "",
    cost: "",
    notes: "",
    imageUrl: "",
    reminderEnabled: true,
    reminderSms: false,
  };

  const extraFields = [
    {
      name: "cost" as const,
      label: "Visit Cost",
      type: "text" as const,
      placeholder: "Enter cost (optional)",
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Checkup Record"
      petId={petId}
      recordType="checkup"
      typeOptions={checkupTypes}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}?refresh=true`);
      }}
    />
  );
}
