import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";

const vaccineTypes = [
  "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
  "Rabies",
  "Bordetella (Kennel Cough)", 
  "Lyme Disease",
  "Canine Influenza",
  "Leptospirosis",
  "FVRCP (Feline Distemper)",
  "FeLV (Feline Leukemia)",
  "Other"
];

export default function VaccineForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "vaccine" as const,
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
      name: "batchNumber" as const,
      label: "Batch/Lot Number",
      type: "text" as const,
      placeholder: "Enter vaccine batch number",
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Vaccine Record"
      petId={petId}
      recordType="vaccine"
      typeOptions={vaccineTypes}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}?refresh=true`);
      }}
    />
  );
}