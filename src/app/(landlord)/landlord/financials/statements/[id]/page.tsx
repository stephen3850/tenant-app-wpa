import { getOwnerStatement } from "@/actions/landlord-financial";
import { OwnerStatementDetails } from "@/features/landlord/components/owner-statement-details";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function OwnerStatementPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const statement = await getOwnerStatement(params.id);

  if (!statement) {
    notFound();
  }

  return <OwnerStatementDetails statement={statement} />;
}
