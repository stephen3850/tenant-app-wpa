"use client";

import { DocumentCard } from "./document-card";
import { FileQuestionIcon } from "lucide-react";

export function DocumentList({ documents }: { documents: any[] }) {
  if (documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-xl border border-dashed">
        <div className="p-4 bg-slate-50 rounded-full mb-4">
          <FileQuestionIcon className="h-10 w-10 text-slate-300" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No documents found</h3>
        <p className="text-sm text-slate-500 mt-1 max-w-[250px] text-center">
          We couldn't find any documents matching your current filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {documents.map((doc) => (
        <DocumentCard key={doc.id} doc={doc} />
      ))}
    </div>
  );
}
