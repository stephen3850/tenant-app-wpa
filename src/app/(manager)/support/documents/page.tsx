import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default async function SupportDocumentsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const supportDocs = [
    {
      category: "MANUAL",
      badge: "Support document",
      title: "RentalDesk Complete Manual",
      description: "A detailed product guide covering setup order, operating rules, roles, finance flows, portals, reports, troubleshooting, QA checks, and support handover.",
      link: "/help/support-documents/manual",
      buttonText: "Open Manual",
      variant: "default",
    },
    {
      category: "UTILITY TEAM",
      badge: "PDF guide",
      title: "Electricity Portal Guide",
      description: "A start-to-finish guide for electricity accounts, readings, bills, invoice generation, payments, imports, and QA checks.",
      link: "/help/support-documents/electricity-portal-guide",
      buttonText: "Open PDF",
      variant: "default",
    },
    {
      category: "ACCESS",
      badge: "Reference",
      title: "Role Access Guide",
      description: "Review the current role matrix for Business Owner, Operations, Landlord, Utility Team, Finance, and Property Manager users.",
      link: "/help/role-access",
      buttonText: "Open Guide",
      variant: "outline",
    }
  ];

  return (
    <div className="p-4 lg:p-12 space-y-10 animate-in fade-in duration-700 bg-white min-h-screen">
      <div className="space-y-2">
        <p className="text-[11px] font-bold text-[#56A600] uppercase tracking-[0.15em]">
          Business Owner
        </p>
        <h1 className="text-4xl font-black text-[#1F2937] tracking-tight">
          Support Documents
        </h1>
        <p className="text-sm font-medium text-[#667085] max-w-3xl leading-relaxed">
          Product reference guides for business owners and their teams. Use these documents when learning RentalDesk,
          checking setup order, reviewing permissions, or preparing for go-live.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {supportDocs.map((doc, index) => (
          <Card key={index} className="border-[#DCE3EA] shadow-none rounded-[2rem] p-8 bg-white hover:border-[#56A600] transition-all duration-300 flex flex-col justify-between group">
            <CardContent className="p-0 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#56A600] uppercase tracking-[0.15em]">
                  {doc.category}
                </span>
                <Badge variant="outline" className="rounded-full bg-[#F9FAFB] text-[#667085] border-[#DCE3EA] font-medium text-[10px] px-3 py-0.5">
                  {doc.badge}
                </Badge>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl font-black text-[#1F2937] tracking-tight leading-tight group-hover:text-[#56A600] transition-colors">
                  {doc.title}
                </h2>
                <p className="text-xs font-medium text-[#667085] leading-relaxed">
                  {doc.description}
                </p>
              </div>

              <p className="text-[11px] font-medium text-[#98A2B3] tracking-wide">
                {doc.link}
              </p>
            </CardContent>

            <div className="pt-8">
              <Button
                variant={doc.variant as any}
                className={cn(
                  "w-full md:w-auto min-w-[140px] font-bold h-11 rounded-xl shadow-none transition-all",
                  doc.variant === 'default'
                    ? "bg-[#3B82F6] hover:bg-[#2563EB] text-white"
                    : "border-[#DCE3EA] text-[#3B82F6] hover:bg-[#3B82F6]/5"
                )}
              >
                {doc.buttonText}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
