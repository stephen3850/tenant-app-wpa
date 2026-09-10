"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { startLandlordConversation } from "@/actions/landlord-communication";
import { Loader2Icon, SendIcon } from "lucide-react";

const conversationSchema = z.object({
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  priority: z.string().default("NORMAL"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ConversationValues = z.infer<typeof conversationSchema>;

const categories = [
  "General",
  "Financial",
  "Maintenance",
  "Compliance",
  "Legal",
  "Operational",
  "Emergency"
];

export function ConversationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ConversationValues>({
    resolver: zodResolver(conversationSchema),
    defaultValues: {
      subject: "",
      category: "General",
      priority: "NORMAL",
      message: "",
    },
  });

  async function onSubmit(data: ConversationValues) {
    setLoading(true);
    try {
      const conversation = await startLandlordConversation(data);
      toast.success("Conversation started successfully");
      router.push(`/landlord/communication/${conversation.id}`);
    } catch (error) {
      toast.error("Failed to start conversation");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-black text-slate-700 uppercase tracking-widest text-[10px]">Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="font-bold border-slate-200 focus:ring-blue-600">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat} className="font-bold">{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-black text-slate-700 uppercase tracking-widest text-[10px]">Priority</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="font-bold border-slate-200 focus:ring-blue-600">
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="NORMAL" className="font-bold">Normal</SelectItem>
                    <SelectItem value="IMPORTANT" className="font-bold">Important</SelectItem>
                    <SelectItem value="URGENT" className="font-bold text-red-600">Urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-black text-slate-700 uppercase tracking-widest text-[10px]">Subject</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Question about monthly statement" {...field} className="font-bold border-slate-200 focus:ring-blue-600" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="font-black text-slate-700 uppercase tracking-widest text-[10px]">Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe your inquiry in detail..."
                  {...field}
                  className="min-h-[150px] font-medium border-slate-200 focus:ring-blue-600"
                />
              </FormControl>
              <FormDescription className="text-[10px] font-bold text-slate-400">
                Your message will be sent to the property management team.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="pt-4 flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-xs px-10 py-6 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95"
          >
            {loading ? (
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
                <SendIcon className="mr-2 h-4 w-4" />
            )}
            Send Message
          </Button>
        </div>
      </form>
    </Form>
  );
}
