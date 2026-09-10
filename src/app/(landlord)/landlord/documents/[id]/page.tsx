import { getLandlordDocument } from "@/actions/landlord-document";
import { LandlordDocumentDetails } from "@/features/landlord/components/landlord-document-details";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordDocumentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const document = await getLandlordDocument(id);

  if (!document) {
    notFound();
  }

  return <LandlordDocumentDetails document={document} />;
}
