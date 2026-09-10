import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supportService } from "@/features/support/services/support-service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpenIcon, DownloadIcon, HelpCircleIcon, PlusIcon, FileTextIcon } from "lucide-react";
import Link from "next/link";

export default async function SupportDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const articles = await supportService.getArticles(user.organizationId, { status: "PUBLISHED" });
  const drafts = await supportService.getArticles(user.organizationId, { status: "DRAFT" });
  const documents = await supportService.getDocuments(user.organizationId, {});

  const stats = [
    { label: "Published Articles", value: articles.length, icon: BookOpenIcon, color: "text-blue-600" },
    { label: "Draft Articles", value: drafts.length, icon: FileTextIcon, color: "text-yellow-600" },
    { label: "Total Downloads", value: documents.length, icon: DownloadIcon, color: "text-green-600" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Support & Documentation</h2>
        <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
                <Link href="/dashboard/support/knowledge-base">Browse Knowledge Base</Link>
            </Button>
            <Button asChild>
                <Link href="/dashboard/support/articles/new">
                    <PlusIcon className="mr-2 h-4 w-4" /> Create Article
                </Link>
            </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recently Updated Articles</CardTitle>
            <CardDescription>Latest changes to the knowledge base.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {articles.slice(0, 5).map((article: any) => (
                <div key={article.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Link href={`/dashboard/support/articles/${article.id}`} className="font-medium hover:underline">
                      {article.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      In {article.category.name} • By {article.author.name}
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(article.updatedAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              {articles.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No articles published yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Support Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard/support/downloads">
                <DownloadIcon className="mr-2 h-4 w-4" /> Download Center
              </Link>
            </Button>
            <Button variant="ghost" className="w-full justify-start" asChild>
              <Link href="/dashboard/support/knowledge-base?faq=true">
                <HelpCircleIcon className="mr-2 h-4 w-4" /> FAQs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
