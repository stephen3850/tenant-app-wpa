import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { supportService } from "@/features/support/services/support-service";
import { ArticleEditor } from "@/features/support/components/article-editor";
import { VersionHistory } from "@/features/support/components/version-history";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeftIcon, EyeIcon, EditIcon, HistoryIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const article = await supportService.getArticle(id, user.organizationId);
  const categories = await supportService.getCategories(user.organizationId);

  if (!article) notFound();

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/support/knowledge-base">
            <ChevronLeftIcon className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{article.title}</h2>
          <p className="text-muted-foreground">Version {article.currentVersion} • {article.status}</p>
        </div>
      </div>

      <Tabs defaultValue="view" className="space-y-4">
        <TabsList>
          <TabsTrigger value="view">
            <EyeIcon className="mr-2 h-4 w-4" /> View
          </TabsTrigger>
          <TabsTrigger value="edit">
            <EditIcon className="mr-2 h-4 w-4" /> Edit
          </TabsTrigger>
          <TabsTrigger value="history">
            <HistoryIcon className="mr-2 h-4 w-4" /> History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="view" className="space-y-4">
          <Card>
            <CardContent className="pt-6 prose dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={{ __html: article.content }} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="edit">
          <ArticleEditor article={article} categories={categories} />
        </TabsContent>

        <TabsContent value="history">
          <VersionHistory
            articleId={article.id}
            versions={article.versions}
            currentVersion={article.currentVersion}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Simple Card component if not imported
function Card({ children, className }: any) {
    return <div className={`rounded-xl border bg-card text-card-foreground shadow ${className}`}>{children}</div>
}

function CardContent({ children, className }: any) {
    return <div className={`p-6 ${className}`}>{children}</div>
}
