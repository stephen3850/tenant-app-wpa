"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchIcon, BookOpenIcon, FolderIcon, PlusIcon } from "lucide-react";
import Link from "next/link";

export function KnowledgeBase({ categories, articles }: any) {
  const [search, setSearch] = useState("");

  const filteredArticles = articles.filter((article: any) =>
    article.title.toLowerCase().includes(search.toLowerCase()) ||
    article.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            className="pl-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Link href="/dashboard/support/articles/new">
          <Button>
            <PlusIcon className="mr-2 h-4 w-4" /> Create Article
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase text-muted-foreground tracking-wider">Categories</h3>
          <div className="space-y-1">
            {categories.map((category: any) => (
              <Button
                key={category.id}
                variant="ghost"
                className="w-full justify-start font-normal"
                asChild
              >
                <Link href={`/dashboard/support/knowledge-base?category=${category.id}`}>
                  <FolderIcon className="mr-2 h-4 w-4 text-blue-500" />
                  {category.name}
                </Link>
              </Button>
            ))}
          </div>
        </div>

        <div className="md:col-span-3 space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredArticles.map((article: any) => (
              <Card key={article.id} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{article.category.name}</Badge>
                    {article.status === "DRAFT" && <Badge variant="outline">Draft</Badge>}
                  </div>
                  <CardTitle className="text-xl mt-2">
                    <Link href={`/dashboard/support/articles/${article.id}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {article.content.replace(/<[^>]*>?/gm, "")}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <BookOpenIcon className="mr-2 h-4 w-4" />
                    Updated {new Date(article.updatedAt).toLocaleDateString()}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
