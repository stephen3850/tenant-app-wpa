import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { CommunicationDashboard } from "@/features/communication/components/comm-dashboard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquareIcon, MailIcon, BellIcon, MegaphoneIcon, FileTextIcon, SettingsIcon } from "lucide-react";

export default async function CommunicationPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const user = session.user as any;

  const links = [
    { title: "SMS History", href: "/dashboard/communication/sms", icon: MessageSquareIcon, description: "Track sent SMS messages" },
    { title: "Email History", href: "/dashboard/communication/email", icon: MailIcon, description: "Track sent emails" },
    { title: "Announcements", href: "/dashboard/communication/announcements", icon: MegaphoneIcon, description: "Manage broadcast messages" },
    { title: "Notifications", href: "/dashboard/communication/notifications", icon: BellIcon, description: "View system alerts" },
    { title: "Templates", href: "/dashboard/communication/templates", icon: FileTextIcon, description: "Manage message templates" },
    { title: "Automation", href: "/dashboard/communication/automation", icon: SettingsIcon, description: "Manage communication rules" },
  ];

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Communication Center</h2>
      </div>

      <CommunicationDashboard organizationId={user.organizationId} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 pt-4">
        {links.map((link) => (
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
