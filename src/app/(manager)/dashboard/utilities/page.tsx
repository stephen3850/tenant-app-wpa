import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { UtilityDashboard } from "@/features/utilities/components/utility-dashboard";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusIcon, ClipboardListIcon, CheckSquareIcon, SettingsIcon, FileTextIcon, GaugeIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default async function UtilitiesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;

  const quickLinks = [
    { title: "Meter Management", href: "/dashboard/utilities/meters", icon: GaugeIcon, description: "Register and track utility meters" },
    { title: "Reading Entry", href: "/dashboard/utilities/readings", icon: ClipboardListIcon, description: "Record and bulk upload readings" },
    { title: "Approval Queue", href: "/dashboard/utilities/approvals", icon: CheckSquareIcon, description: "Review and approve utility readings" },
    { title: "Billing Rules", href: "/dashboard/utilities/rules", icon: SettingsIcon, description: "Configure consumption rates and tiers" },
    { title: "Utility Reports", href: "/dashboard/utilities/reports", icon: FileTextIcon, description: "Consumption and billing analytics" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Utility Billing & Management</h2>
        <Button asChild>
          <Link href="/dashboard/utilities/readings/new">
            <PlusIcon className="mr-2 h-4 w-4" /> New Reading
          </Link>
        </Button>
      </div>

      <UtilityDashboard organizationId={user.organizationId} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
        {quickLinks.map((link) => (
          <Card key={link.title} className="hover:bg-muted/50 transition-colors">
            <Link href={link.href}>
              <CardHeader className="flex flex-row items-center gap-2 space-y-0">
                <link.icon className="h-5 w-5" />
                <CardTitle className="text-lg">{link.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{link.description}</CardDescription>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}
