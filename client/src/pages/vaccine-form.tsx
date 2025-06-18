import React from "react";
import { useParams, useLocation } from "wouter";
import { insertMedicalRecordSchema } from "@shared/schema";
import MedicalRecordForm from "@/components/medical-record-form";

const vaccineTypes = [
  "Rabies",
  "DHPP (Distemper, Hepatitis, Parvovirus, Parainfluenza)",
  "Bordetella",
  "Lyme Disease",
  "Canine Influenza",
  "FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)",
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
      placeholder: "Enter batch number",
    },
    {
      name: "weight" as const,
      label: "Pet Weight (kg)",
      type: "text" as const,
      placeholder: "Enter weight in kg",
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Vaccination Record"
      petId={petId}
      recordType="vaccine"
      typeOptions={vaccineTypes}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}`);
      }}
    />
  );
}
