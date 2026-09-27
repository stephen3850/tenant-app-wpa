"use client";

import { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { DocumentCategory } from "@prisma/client";
import { uploadTenantDocument } from "@/actions/tenant-documents";
import { toast } from "sonner";
import {
  UploadIcon,
  FileTextIcon,
  ImageIcon,
  Loader2Icon,
  XIcon,
  CheckCircle2Icon,
  AlertCircleIcon
} from "lucide-react";

export function UploadTenantDocumentDialog({
  trigger
}: {
  trigger?: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: DocumentCategory.MOVE_IN_DOCUMENT as DocumentCategory,
    description: "",
    expiryDate: "",
  });

  const [fileState, setFile] = useState<{
    file: File | null;
    previewUrl: string | null;
    base64Data: string | null;
  }>({
    file: null,
    previewUrl: null,
    base64Data: null,
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > 15 * 1024 * 1024) {
      toast.error("File size exceeds 15MB limit.");
      return;
    }

    const isImage = selectedFile.type.startsWith("image/");
    const previewUrl = isImage ? URL.createObjectURL(selectedFile) : null;

    const reader = new FileReader();
    reader.onload = () => {
      setFile({
        file: selectedFile,
        previewUrl,
        base64Data: reader.result as string,
      });

      // Auto-populate document name if empty
      if (!formData.name) {
        const defaultName = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        setFormData((prev) => ({ ...prev, name: defaultName }));
      }
    };
    reader.readAsDataURL(selectedFile);
  };

  const removeFile = () => {
    if (fileState.previewUrl) {
      URL.revokeObjectURL(fileState.previewUrl);
    }
    setFile({ file: null, previewUrl: null, base64Data: null });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fileState.base64Data || !fileState.file) {
      toast.error("Please select a file to upload.");
      return;
    }

    if (!formData.name.trim()) {
      toast.error("Please enter a document title.");
      return;
    }

    setLoading(true);

    try {
      await uploadTenantDocument({
        name: formData.name.trim(),
        category: formData.category,
        description: formData.description.trim() || undefined,
        expiryDate: formData.expiryDate || undefined,
        fileData: fileState.base64Data,
        fileName: fileState.file.name,
        fileType: fileState.file.type,
        fileSize: fileState.file.size,
      });

      toast.success("Document uploaded successfully!");
      setOpen(false);
      removeFile();
      setFormData({
        name: "",
        category: DocumentCategory.MOVE_IN_DOCUMENT,
        description: "",
        expiryDate: "",
      });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to upload document. Please try again.");
      toast.error("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl h-11 px-5 shadow-sm">
            <UploadIcon className="h-4 w-4 mr-2" /> Upload Document
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-xl rounded-2xl p-6 bg-white border border-slate-200">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <UploadIcon className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-900">
                Upload Document or ID
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500 mt-0.5">
                Upload your National ID, Passport, Utility Bills, or other official records.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5 mt-2">
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2.5 text-xs font-semibold">
              <AlertCircleIcon className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* File Upload Drop Area / Preview */}
          <div className="space-y-2">
            <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
              Document File (ID Image, Photo, or PDF)
            </Label>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx"
              className="hidden"
              onChange={handleFileChange}
            />

            {!fileState.file ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-emerald-500 bg-slate-50/50 hover:bg-emerald-50/30 rounded-2xl p-8 text-center cursor-pointer transition-all group"
              >
                <div className="p-3 bg-white rounded-2xl border shadow-xs inline-block text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 transition-transform mb-3">
                  <UploadIcon className="h-6 w-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Click to choose ID photo or document
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, PNG, WEBP, PDF up to 15MB
                </p>
              </div>
            ) : (
              <div className="relative p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 overflow-hidden">
                  {fileState.previewUrl ? (
                    <div className="relative h-14 w-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white">
                      <img
                        src={fileState.previewUrl}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 shrink-0">
                      <FileTextIcon className="h-6 w-6" />
                    </div>
                  )}

                  <div className="overflow-hidden space-y-0.5">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {fileState.file.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">
                      {(fileState.file.size / 1024 / 1024).toFixed(2)} MB • {fileState.file.type.split("/")[1]?.toUpperCase() || "FILE"}
                    </p>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 shrink-0"
                  onClick={removeFile}
                >
                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Document Title
              </Label>
              <Input
                placeholder="e.g. National ID Card (Front & Back)"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-white rounded-xl h-11 border-slate-200 text-sm font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val as DocumentCategory })}
              >
                <SelectTrigger className="bg-white rounded-xl h-11 border-slate-200 text-sm font-semibold">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value={DocumentCategory.MOVE_IN_DOCUMENT}>
                    ID Picture / Passport / Move-In
                  </SelectItem>
                  <SelectItem value={DocumentCategory.COMPLIANCE_DOCUMENT}>
                    Compliance / KRA PIN
                  </SelectItem>
                  <SelectItem value={DocumentCategory.LEASE_AGREEMENT}>
                    Lease Agreement
                  </SelectItem>
                  <SelectItem value={DocumentCategory.UTILITY_STATEMENT}>
                    Utility Statement
                  </SelectItem>
                  <SelectItem value={DocumentCategory.RECEIPT}>
                    Payment Receipt
                  </SelectItem>
                  <SelectItem value={DocumentCategory.OTHER}>
                    Other Document
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Description / Notes (Optional)
              </Label>
              <Input
                placeholder="e.g. Scanned copy for identity verification"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="bg-white rounded-xl h-11 border-slate-200 text-sm font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Expiry Date (Optional)
              </Label>
              <Input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                className="bg-white rounded-xl h-11 border-slate-200 text-sm font-medium"
              />
            </div>
          </div>

          <DialogFooter className="pt-4 border-t border-slate-100 flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="rounded-xl border-slate-200 font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !fileState.file}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl min-w-[140px]"
            >
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <CheckCircle2Icon className="mr-2 h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
