import { getUnit } from "@/features/units/actions/unit-actions";
import { UnitDetails } from "@/features/units/components/unit-details";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function UnitDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const unit = await getUnit(id);

  if (!unit) {
    notFound();
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-end">
        <Button asChild variant="outline">
          <Link href={`/units/${id}/edit`}>
            <Edit className="mr-2 h-4 w-4" /> Edit Unit
          </Link>
        </Button>
      </div>

      <UnitDetails unit={unit} />
    </div>
  );
}
