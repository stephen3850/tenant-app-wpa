import { getOwnerStatement } from "@/actions/landlord-financial";
import { OwnerStatementDetails } from "@/features/landlord/components/owner-statement-details";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function OwnerStatementPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const statement = await getOwnerStatement(id);

  if (!statement) {
    notFound();
  }

  return <OwnerStatementDetails statement={statement} />;
}
