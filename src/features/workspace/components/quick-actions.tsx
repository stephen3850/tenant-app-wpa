"use client";

import {
  PlusCircle,
  UserPlus,
  FilePlus,
  Receipt,
  FileSpreadsheet,
  LifeBuoy,
  Gavel,
  ShieldAlert,
  Archive,
  MessageSquare,
  Droplets,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export function QuickActions({ permissions }: { permissions: string[] }) {
  const hasPerm = (action: string, subject: string) =>
    permissions.includes(`${action}:${subject}`) || permissions.includes("manage:all");

  const actions = [
    { label: "Add Property", href: "/properties/new", icon: PlusCircle, show: hasPerm("create", "property") },
    { label: "Add Tenant", href: "/tenants/new", icon: UserPlus, show: hasPerm("create", "tenant") },
    { label: "Create Lease", href: "/leases/new", icon: FilePlus, show: hasPerm("create", "lease") },
    { label: "Record Payment", href: "/finance/payments/new", icon: Receipt, show: hasPerm("create", "payment") },
    { label: "Generate Invoices", href: "/finance/invoices/generate", icon: FileSpreadsheet, show: hasPerm("create", "invoice") },
    { label: "New Ticket", href: "/dashboard/tickets/new", icon: LifeBuoy, show: hasPerm("create", "ticket") },
    { label: "New Case", href: "/dashboard/cases/new", icon: Gavel, show: hasPerm("create", "case") },
    { label: "Record Incident", href: "/dashboard/security/ob/new", icon: ShieldAlert, show: hasPerm("create", "security") },
    { label: "View Records", href: "/dashboard/records", icon: Archive, show: hasPerm("view", "records") },
    { label: "Comm Center", href: "/dashboard/communication", icon: MessageSquare, show: hasPerm("view", "communications") },
    { label: "Utility Hub", href: "/dashboard/utilities", icon: Droplets, show: hasPerm("view", "utilities") },
    { label: "Manage Users", href: "/dashboard/users", icon: Settings, show: hasPerm("view", "users") },
  ];

  const visibleActions = actions.filter(a => a.show);

  if (visibleActions.length === 0) return null;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 gap-2">
        {visibleActions.map((action) => (
          <Button
            key={action.label}
            variant="ghost"
            size="sm"
            asChild
            className="justify-start h-10 hover:bg-primary/5 hover:text-primary transition-all border border-transparent hover:border-primary/20 group"
          >
            <Link href={action.href} className="flex items-center w-full">
              <div className="mr-3 p-1.5 rounded-md bg-muted group-hover:bg-primary/10 transition-colors">
                <action.icon className="h-4 w-4" />
              </div>
              <span className="font-semibold text-xs">{action.label}</span>
            </Link>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
