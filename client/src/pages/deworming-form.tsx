import { useParams, useLocation } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";

const dewormingTypes = [
  "Roundworm Treatment",
  "Hookworm Treatment", 
  "Tapeworm Treatment",
  "Whipworm Treatment",
  "Heartworm Prevention",
  "General Deworming",
  "Other"
];

export default function DewormingForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const petId = parseInt(id || "0");

  const defaultValues = {
    petId,
    type: "deworming" as const,
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

  return (
    <MedicalRecordForm
      title="Add Deworming Record"
      petId={petId}
      recordType="deworming"
      typeOptions={dewormingTypes}
      defaultValues={defaultValues}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => {
        setLocation(`/pet/${petId}`);
      }}
    />
  );
}
