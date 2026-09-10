import { getLandlordDocument } from "@/actions/landlord-document";
import { LandlordDocumentDetails } from "@/features/landlord/components/landlord-document-details";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordDocumentPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const document = await getLandlordDocument(params.id);

  if (!document) {
    notFound();
  }

  return <LandlordDocumentDetails document={document} />;
}
