import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArchiveIcon, FileTextIcon, ShieldIcon, HistoryIcon } from "lucide-react";
import Link from "next/link";

export function RecordsDashboard() {
  const categories = [
    { title: "Central Archive", description: "Global search across all records", icon: ArchiveIcon, href: "/dashboard/records/search", color: "text-blue-600" },
    { title: "Compliance Hub", description: "Legal and regulatory documents", icon: ShieldIcon, href: "/dashboard/records/compliance", color: "text-orange-600" },
    { title: "Access History", description: "Who viewed and exported records", icon: HistoryIcon, href: "/dashboard/records/history", color: "text-green-600" },
    { title: "Retention Settings", description: "Data archival and cleanup policies", icon: FileTextIcon, href: "/dashboard/records/settings", color: "text-purple-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {categories.map((cat) => (
        <Card key={cat.title} className="hover:bg-muted/50 transition-colors">
          <Link href={cat.href}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{cat.title}</CardTitle>
              <cat.icon className={`h-4 w-4 ${cat.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{cat.description}</p>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
}
