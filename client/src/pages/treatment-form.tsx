import { useParams, useLocation } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";

const treatmentTypes = [
  "Flea Treatment",
  "Tick Treatment",
  "Ear Infection Treatment",
  "Skin Condition Treatment",
  "Antibiotic Course",
  "Pain Management",
  "Allergy Treatment",
  "Other"
];

export default function TreatmentForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "treatment" as const,
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
      label: "Treatment Cost",
      type: "text" as const,
      placeholder: "Enter cost (optional)",
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Treatment Record"
      petId={petId}
      recordType="treatment"
      typeOptions={treatmentTypes}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}`);
      }}
    />
  );
}
