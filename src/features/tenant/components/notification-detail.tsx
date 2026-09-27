"use client";

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BellIcon,
  ClockIcon,
  ArchiveIcon,
  ChevronLeftIcon,
  ArrowRightIcon,
  AlertCircleIcon,
  FileTextIcon,
  CreditCardIcon,
  KeyIcon,
  WrenchIcon,
  ShieldIcon,
  MegaphoneIcon
} from "lucide-react";
import Link from "next/link";
import { archiveNotification } from "@/actions/tenant-notifications";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { tenantRoutes } from "@/lib/routes";

export function NotificationDetail({ notification }: { notification: any }) {
  const router = useRouter();
  const { toast } = useToast();
  const [isArchiving, setIsArchiving] = useState(false);

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await archiveNotification(notification.id);
      toast({
        title: "Notification Archived",
        description: "Moving this notification to your archive.",
      });
      router.push(tenantRoutes.notifications());
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to archive notification",
        variant: "destructive",
      });
    } finally {
      setIsArchiving(false);
    }
  };

  const getIcon = (type: string) => {
    const className = "h-8 w-8";
    switch (type) {
      case "INVOICE_ISSUED": return <FileTextIcon className={`${className} text-blue-600`} />;
      case "PAYMENT_CONFIRMED": return <CreditCardIcon className={`${className} text-green-600`} />;
      case "RECEIPT_GENERATED": return <FileTextIcon className={`${className} text-emerald-600`} />;
      case "LEASE_EXPIRY": return <KeyIcon className={`${className} text-orange-600`} />;
      case "MAINTENANCE_UPDATE": return <WrenchIcon className={`${className} text-purple-600`} />;
      case "SECURITY_NOTICE": return <ShieldIcon className={`${className} text-red-600`} />;
      case "ANNOUNCEMENT_REMINDER": return <MegaphoneIcon className={`${className} text-slate-600`} />;
      default: return <BellIcon className={`${className} text-slate-400`} />;
    }
  };

  const getPriorityVariant = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "destructive";
      case "HIGH": return "warning" as any;
      default: return "secondary";
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case "INVOICE_ISSUED": return "View Invoice";
      case "PAYMENT_CONFIRMED": return "View Payment History";
      case "RECEIPT_GENERATED": return "Download Receipt";
      case "LEASE_EXPIRY": return "Review Lease";
      case "RENEWAL_OFFER": return "View Renewal Offer";
      case "MAINTENANCE_UPDATE": return "View Maintenance Request";
      case "DOCUMENT_SHARED": return "Open Document";
      case "ANNOUNCEMENT_REMINDER": return "Read Announcement";
      default: return "View Details";
    }
  };

  // Ensure notification link is safe and scoped to /portal/*
  const getSafeTenantLink = (link?: string, type?: string) => {
    if (!link) return tenantRoutes.dashboard();
    if (link.startsWith("/portal/")) return link;
    // Map legacy or un-namespaced links to portal namespace
    if (link.startsWith("/invoices/")) return link.replace("/invoices/", "/portal/invoices/");
    if (link.startsWith("/payments")) return tenantRoutes.payments();
    if (link.startsWith("/receipts/")) return link.replace("/receipts/", "/portal/receipts/");
    if (link.startsWith("/documents")) return tenantRoutes.documents();
    if (link.startsWith("/lease")) return tenantRoutes.lease();
    if (link.startsWith("/maintenance/") || link.startsWith("/tickets/")) return link.replace(/^\/(maintenance|tickets)\//, "/portal/tickets/");
    if (link.startsWith("/announcements/")) return link.replace("/announcements/", "/portal/announcements/");

    return tenantRoutes.dashboard();
  };

  const safeLink = getSafeTenantLink(notification.link, notification.type);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-blue-600 p-0 font-bold">
           <Link href={tenantRoutes.notifications()}>
              <ChevronLeftIcon className="h-4 w-4 mr-1" />
              Back to Inbox
           </Link>
        </Button>
        <div className="flex items-center gap-2">
           {!notification.archivedAt && (
             <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 font-bold"
              onClick={handleArchive}
              disabled={isArchiving}
             >
                <ArchiveIcon className="h-3 w-3 mr-2" />
                Archive
             </Button>
           )}
        </div>
      </div>

      <Card className="shadow-lg border-2 overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50 p-8">
           <div className="flex items-center gap-4 mb-6">
              <div className="p-3 bg-white rounded-2xl border shadow-sm">
                {getIcon(notification.type)}
              </div>
              <div className="space-y-1">
                 <div className="flex items-center gap-2">
                    <Badge variant={getPriorityVariant(notification.priority)} className="text-[10px] font-bold uppercase px-2 py-0">
                      {notification.priority}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-bold uppercase px-2 py-0 text-slate-400">
                      {notification.type.replace(/_/g, " ")}
                    </Badge>
                 </div>
                 <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <ClockIcon className="h-3 w-3" />
                    {new Date(notification.createdAt).toLocaleString()}
                 </div>
              </div>
           </div>
           <CardTitle className="text-2xl font-extrabold text-slate-900 leading-tight">
              {notification.title}
           </CardTitle>
        </CardHeader>

        <CardContent className="p-8">
           <div className="text-lg text-slate-700 leading-relaxed whitespace-pre-wrap">
              {notification.message}
           </div>

           {notification.priority === 'CRITICAL' && (
             <div className="mt-8 p-4 bg-red-50 border border-red-100 rounded-xl flex gap-3 items-start">
                <AlertCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-800 font-medium">
                  This is a critical system notification. If you have any questions, please contact support immediately.
                </p>
             </div>
           )}
        </CardContent>

        <CardFooter className="bg-slate-50 border-t p-8">
           <Button className="w-full bg-blue-600 hover:bg-blue-700 font-bold text-base h-12 shadow-md hover:shadow-lg transition-all rounded-xl" asChild>
              <Link href={safeLink}>
                 {getActionLabel(notification.type)}
                 <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
           </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
