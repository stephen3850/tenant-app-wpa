import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supportService } from "@/features/support/services/support-service";
import { KnowledgeBase } from "@/features/support/components/knowledge-base";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import Link from "next/link";

export default async function KnowledgeBasePage({ searchParams }: { searchParams: Promise<any> }) {
  const params = await searchParams;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const categories = await supportService.getCategories(user.organizationId);
  const articles = await supportService.getArticles(user.organizationId, {
    categoryId: params.category,
    search: params.q
  });

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/support">
            <ChevronLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-3xl font-bold tracking-tight">Knowledge Base</h2>
      </div>

      <KnowledgeBase
        categories={categories}
        articles={articles}
      />
    </div>
  );
}
