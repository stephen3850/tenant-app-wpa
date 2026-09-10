"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  FileTextIcon,
  CreditCardIcon,
  KeyIcon,
  WrenchIcon,
  BellIcon,
  ArchiveIcon,
  CheckIcon,
  ChevronRightIcon,
  AlertTriangleIcon,
  ShieldIcon,
  MegaphoneIcon,
  ClockIcon
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { markNotificationAsRead, archiveNotification } from "@/actions/tenant-notifications";
import { useRouter } from "next/navigation";

export function NotificationItem({ notification }: { notification: any }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const isRead = !!notification.readAt;

  const handleMarkRead = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await markNotificationAsRead(notification.id);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      await archiveNotification(notification.id);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "INVOICE_ISSUED": return <FileTextIcon className="h-5 w-5 text-blue-600" />;
      case "PAYMENT_CONFIRMED": return <CreditCardIcon className="h-5 w-5 text-green-600" />;
      case "RECEIPT_GENERATED": return <FileTextIcon className="h-5 w-5 text-emerald-600" />;
      case "LEASE_EXPIRY": return <KeyIcon className="h-5 w-5 text-orange-600" />;
      case "MAINTENANCE_UPDATE": return <WrenchIcon className="h-5 w-5 text-purple-600" />;
      case "SECURITY_NOTICE": return <ShieldIcon className="h-5 w-5 text-red-600" />;
      case "ANNOUNCEMENT_REMINDER": return <MegaphoneIcon className="h-5 w-5 text-slate-600" />;
      default: return <BellIcon className="h-5 w-5 text-slate-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "CRITICAL": return "bg-red-500";
      case "HIGH": return "bg-orange-500";
      case "NORMAL": return "bg-blue-500";
      default: return "bg-slate-400";
    }
  };

  return (
    <div className="relative group">
      <Link href={`/notifications/${notification.id}`}>
        <Card className={`transition-all hover:shadow-md border-l-4 ${!isRead ? 'border-blue-500 bg-blue-50/20' : 'border-slate-200'} ${notification.priority === 'CRITICAL' ? 'border-red-500' : ''}`}>
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className={`p-2.5 rounded-xl border bg-white shadow-sm flex-shrink-0`}>
                {getIcon(notification.type)}
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4 className={`text-sm font-bold truncate ${!isRead ? 'text-slate-900' : 'text-slate-600'}`}>
                      {notification.title}
                    </h4>
                    {notification.priority === 'CRITICAL' && (
                       <AlertTriangleIcon className="h-3 w-3 text-red-500 flex-shrink-0 animate-pulse" />
                    )}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
                    {formatDate(notification.createdAt)}
                  </span>
                </div>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {notification.message}
                </p>

                <div className="flex items-center gap-3 pt-1">
                   <div className="flex items-center gap-1.5">
                      <div className={`h-1.5 w-1.5 rounded-full ${getPriorityColor(notification.priority)}`} />
                      <span className="text-[10px] font-bold uppercase text-slate-400 tracking-tighter">
                        {notification.priority}
                      </span>
                   </div>
                   {notification.type !== "SYSTEM" && (
                      <span className="text-[10px] font-bold uppercase text-slate-300">
                        •
                      </span>
                   )}
                   <span className="text-[10px] font-bold uppercase text-slate-400 truncate">
                      {notification.type.replace(/_/g, " ")}
                   </span>
                </div>
              </div>

              <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 {!isRead && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      onClick={handleMarkRead}
                      disabled={loading}
                    >
                       <CheckIcon className="h-4 w-4" />
                    </Button>
                 )}
                 {!notification.archivedAt && (
                   <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    onClick={handleArchive}
                    disabled={loading}
                   >
                      <ArchiveIcon className="h-4 w-4" />
                   </Button>
                 )}
              </div>

              <div className="flex items-center h-12 flex-shrink-0 ml-1">
                 <ChevronRightIcon className="h-4 w-4 text-slate-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
