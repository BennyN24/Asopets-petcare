import { useLocation } from "wouter";
import { useParams } from "wouter";
import MedicalRecordForm from "@/components/medical-record-form";
import type { InsertMedicalRecord } from "@shared/schema";

export default function GroomingForm() {
  const [, setLocation] = useLocation();
  const params = useParams();
  const petId = parseInt(params.id || "0");

  const defaultValues: InsertMedicalRecord = {
    petId,
    type: "grooming",
    title: "",
    dateAdministered: new Date().toISOString().split('T')[0],
    description: "",
    cost: "",
    veterinarian: "",
    clinic: ""
  };

  const extraFields = [
    {
      name: "clinic" as keyof InsertMedicalRecord,
      label: "Grooming Salon",
      type: "text" as const,
      placeholder: "Name of grooming salon"
    },
    {
      name: "veterinarian" as keyof InsertMedicalRecord,
      label: "Groomer Name",
      type: "text" as const,
      placeholder: "Professional groomer name"
    },
    {
      name: "notes" as keyof InsertMedicalRecord,
      label: "Grooming Details",
      type: "textarea" as const,
      placeholder: "Services provided (bath, nail trim, haircut, ear cleaning, etc.)"
    }
  ];

  return (
    <MedicalRecordForm
      title="Add Grooming Record"
      petId={petId}
      recordType="grooming"
      typeOptions={["Full Grooming", "Bath Only", "Nail Trim", "Ear Cleaning", "Teeth Cleaning", "Flea Treatment", "De-shedding", "Nail Painting"]}
      defaultValues={defaultValues}
      extraFields={extraFields}
      onCancel={() => setLocation(`/pet/${petId}`)}
      onSuccess={() => setLocation(`/pet/${petId}`)}
    />
  );
}