import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { RecordsSearch } from "@/features/records/components/records-search";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeftIcon } from "lucide-react";

export default async function GlobalSearchPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/records">
            <ArrowLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Central Records Archive</h2>
      </div>
      <RecordsSearch />
    </div>
  );
}
