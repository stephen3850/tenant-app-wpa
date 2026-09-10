"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { TicketPriority } from "@prisma/client";
import { createMaintenanceRequest } from "@/actions/tenant-maintenance";
import { Loader2Icon, AlertTriangleIcon, WrenchIcon, PaperclipIcon, XIcon } from "lucide-react";

export function CreateRequestForm({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    categoryId: "",
    priority: "MEDIUM" as TicketPriority,
    preferredAccessTime: "",
    contactPreference: "PHONE"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.categoryId) throw new Error("Please select a category");

      const result = await createMaintenanceRequest(formData);
      router.push(`/portal/tickets/${result.id}`);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-3xl mx-auto shadow-lg border-2">
        <CardHeader className="bg-slate-50 border-b">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
              <WrenchIcon className="h-6 w-6" />
            </div>
            <div>
              <CardTitle className="text-xl">New Maintenance Request</CardTitle>
              <CardDescription>Provide details about the issue and we'll handle it.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-3 text-sm">
              <AlertTriangleIcon className="h-5 w-5" />
              {error}
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Request Category</Label>
              <Select
                onValueChange={(val) => setFormData({ ...formData, categoryId: val })}
                required
              >
                <SelectTrigger id="category" className="bg-white">
                  <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority Level</Label>
              <Select
                defaultValue="MEDIUM"
                onValueChange={(val) => setFormData({ ...formData, priority: val as TicketPriority })}
              >
                <SelectTrigger id="priority" className="bg-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LOW">Low - Minor issue</SelectItem>
                  <SelectItem value="MEDIUM">Medium - Normal request</SelectItem>
                  <SelectItem value="HIGH">High - Urgent attention</SelectItem>
                  <SelectItem value="EMERGENCY">Emergency - Immediate risk</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Short Summary</Label>
            <Input
              id="subject"
              placeholder="e.g., Leaking kitchen sink faucet"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="bg-white"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detailed Description</Label>
            <Textarea
              id="description"
              placeholder="Please describe the issue in detail. When did it start? Where exactly is it located?"
              rows={5}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="bg-white resize-none"
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
             <div className="space-y-2">
                <Label htmlFor="access">Preferred Access Time</Label>
                <Input
                  id="access"
                  placeholder="e.g., Weekdays after 4 PM"
                  value={formData.preferredAccessTime}
                  onChange={(e) => setFormData({ ...formData, preferredAccessTime: e.target.value })}
                  className="bg-white"
                />
             </div>
             <div className="space-y-2">
                <Label htmlFor="contact">Contact Preference</Label>
                <Select
                  defaultValue="PHONE"
                  onValueChange={(val) => setFormData({ ...formData, contactPreference: val })}
                >
                  <SelectTrigger id="contact" className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PHONE">Phone Call</SelectItem>
                    <SelectItem value="SMS">Text Message</SelectItem>
                    <SelectItem value="EMAIL">Email</SelectItem>
                    <SelectItem value="APP">App Notification</SelectItem>
                  </SelectContent>
                </Select>
             </div>
          </div>

          <div className="space-y-2">
             <Label>Attachments (Photos/Videos)</Label>
             <div className="border-2 border-dashed rounded-lg p-8 text-center bg-slate-50 border-slate-200">
                <PaperclipIcon className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600 font-medium">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">Up to 5 files (Max 10MB each)</p>
                <p className="text-[10px] text-blue-600 mt-4 font-bold uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full inline-block border border-blue-100 cursor-pointer hover:bg-blue-100 transition-colors">
                  Select Files
                </p>
             </div>
          </div>
        </CardContent>
        <CardFooter className="bg-slate-50 border-t p-6 flex justify-between gap-4">
           <Button variant="outline" type="button" onClick={() => router.back()} disabled={loading}>
              Cancel
           </Button>
           <Button type="submit" className="bg-blue-600 hover:bg-blue-700 min-w-[150px]" disabled={loading}>
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
           </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
