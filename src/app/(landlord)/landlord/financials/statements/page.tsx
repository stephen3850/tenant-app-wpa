import { getOwnerStatements } from "@/actions/landlord-financial";
import { OwnerStatementsList } from "@/features/landlord/components/owner-statements-list";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function OwnerStatementsPage() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  const statements = await getOwnerStatements();

  return <OwnerStatementsList statements={statements} />;
}
