import { getLandlordDocuments } from "@/actions/landlord-document";
import { LandlordDocumentVault } from "@/features/landlord/components/landlord-document-vault";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LandlordDocumentsPage({
  searchParams,
}: {
  searchParams: { propertyId?: string; category?: string; search?: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const documents = await getLandlordDocuments(searchParams);

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
      <LandlordDocumentVault documents={documents} />
    </div>
  );
}
