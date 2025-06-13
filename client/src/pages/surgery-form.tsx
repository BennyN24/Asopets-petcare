import { useParams, useLocation } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";

const surgeryTypes = [
  "Spay/Neuter",
  "Dental Surgery",
  "Growth/Tumor Removal",
  "Orthopedic Surgery",
  "Emergency Surgery",
  "Eye Surgery",
  "Other"
];

export default function SurgeryForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "surgery" as const,
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
    reminderEnabled: false, // Surgery typically doesn't need reminders
    reminderSms: false,
  };

  const extraFields = [
    {
      name: "cost" as const,
      label: "Surgery Cost",
      type: "text" as const,
      placeholder: "Enter cost (optional)",
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Surgery Record"
      petId={petId}
      recordType="surgery"
      typeOptions={surgeryTypes}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}`);
      }}
    />
  );
}
