"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createArticle, updateArticle, publishArticle } from "@/actions/support";

export function ArticleEditor({ article, categories }: any) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: article?.title || "",
    categoryId: article?.categoryId || "",
    content: article?.content || "",
    changeSummary: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (article) {
        await updateArticle(article.id, formData);
      } else {
        const newArticle = await createArticle(formData);
        router.push(`/dashboard/support/articles/${newArticle.id}`);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    if (!article) return;
    setLoading(true);
    try {
      await publishArticle(article.id);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to publish article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">{article ? "Edit Article" : "Create New Article"}</h2>
        <div className="space-x-2">
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Draft"}
          </Button>
          {article && article.status !== "PUBLISHED" && (
            <Button type="button" variant="default" onClick={handlePublish} disabled={loading}>
              Publish
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. How to generate monthly invoices"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Article Body (supports HTML/Markdown)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="min-h-[400px] font-mono"
                placeholder="Write your article content here..."
                required
              />
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat: any) => (
                      <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {article && (
                <div className="space-y-2">
                  <Label htmlFor="changeSummary">Change Summary</Label>
                  <Input
                    id="changeSummary"
                    value={formData.changeSummary}
                    onChange={(e) => setFormData({ ...formData, changeSummary: e.target.value })}
                    placeholder="What did you change?"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {article && (
            <Card>
              <CardHeader>
                <CardTitle>Metadata</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge>{article.status}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span>{article.currentVersion}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Author:</span>
                  <span>{article.author.name}</span>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </form>
  );
}
