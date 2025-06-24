import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";

const labTestTypes = [
  "Blood Test",
  "Urinalysis",
  "Fecal Examination",
  "Tissue / Skin",
  "Imaging",
  "Rapid Test Kit",
  "Culture",
  "Other"
];

export default function LabTestForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "lab-test" as const,
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
    reminderEnabled: false,
    reminderSms: false,
  };

  const extraFields = [
    {
      name: "batchNumber" as const,
      label: "Test Reference/ID",
      type: "text" as const,
      placeholder: "Lab reference number or test ID",
    },
    {
      name: "cost" as const,
      label: "Test Cost",
      type: "text" as const,
      placeholder: "Enter cost (optional)",
    },
    {
      name: "notes" as const,
      label: "Test Results & Notes",
      type: "textarea" as const,
      placeholder: "Enter test results, reference ranges, and any additional notes",
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Lab Test Record"
      petId={petId}
      recordType="lab-test"
      typeOptions={labTestTypes}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}?refresh=true`);
      }}
    />
  );
}