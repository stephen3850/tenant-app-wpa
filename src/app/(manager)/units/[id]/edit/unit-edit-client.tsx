"use client";

import { UnitForm } from "@/features/units/components/unit-form";
import { UnitFormValues } from "@/features/units/schemas";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateUnit } from "@/features/units/actions/unit-actions";

interface UnitEditClientProps {
  unit: any;
  properties: { id: string, propertyName: string }[];
}

export function UnitEditClient({ unit, properties }: UnitEditClientProps) {
  const router = useRouter();

  const handleSubmit = async (values: UnitFormValues) => {
    try {
      const result = await updateUnit(unit.id, values);
      if (result.success) {
        toast.success("Unit updated successfully");
        router.push("/units");
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update unit");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <UnitForm
      initialData={unit}
      properties={properties}
      onSubmit={handleSubmit}
    />
  );
}
