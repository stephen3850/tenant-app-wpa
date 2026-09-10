import React from "react";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { BulkUnitAddClient } from "./bulk-unit-add-client";

interface BulkUnitAddPageProps {
  params: Promise<{ id: string }>;
}

export default async function BulkUnitAddPage({ params }: BulkUnitAddPageProps) {
  const { id } = await params;

  const property = await db.property.findUnique({
    where: { id },
    select: {
      id: true,
      propertyName: true,
      numberOfFloors: true,
    }
  });

  if (!property) {
    notFound();
  }

  return (
    <BulkUnitAddClient
      property={{
        id: property.id,
        name: property.propertyName,
        numberOfFloors: property.numberOfFloors || 1
      }}
    />
  );
}
