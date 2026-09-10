import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { supportService } from "@/features/support/services/support-service";
import { ArticleEditor } from "@/features/support/components/article-editor";

export default async function NewArticlePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;
  const categories = await supportService.getCategories(user.organizationId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <ArticleEditor categories={categories} />
    </div>
  );
}
