"use client";

import { UnitForm } from "@/features/units/components/unit-form";
import { UnitFormValues } from "@/features/units/schemas";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createUnit } from "@/features/units/actions/unit-actions";

interface UnitNewClientProps {
  properties: { id: string, propertyName: string }[];
}

export function UnitNewClient({ properties }: UnitNewClientProps) {
  const router = useRouter();

  const handleSubmit = async (values: UnitFormValues) => {
    try {
      const result = await createUnit(values);
      if (result.success) {
        toast.success("Unit created successfully");
        router.push("/units");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create unit");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <UnitForm
      properties={properties}
      onSubmit={handleSubmit}
    />
  );
}
