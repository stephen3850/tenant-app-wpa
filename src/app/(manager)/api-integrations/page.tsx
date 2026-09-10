import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { CreditCard, Mail, Wallet, ShieldCheck, Zap, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = 'force-dynamic';

export default async function IntegrationsOverviewPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const integrations = [
    {
      title: "Payment Method APIs",
      description: "Safaricom Daraja, STK Push, and automated M-Pesa reconciliation.",
      icon: CreditCard,
      href: "/api-integrations/payments",
      status: "ACTIVE",
      category: "Payments",
      color: "blue"
    },
    {
      title: "Communication APIs",
      description: "WhatsApp, Email (SMTP), and SMS (Africa's Talking / TextSMS).",
      icon: Mail,
      href: "/api-integrations/communications",
      status: "ACTIVE",
      category: "Messaging",
      color: "green"
    },
    {
      title: "Collection Accounts",
      description: "Manage bank accounts and Paybills for property-specific collections.",
      icon: Wallet,
      href: "/api-integrations/collections",
      status: "CONFIGURED",
      category: "Finance",
      color: "purple"
    },
    {
      title: "Security & Monitoring",
      description: "External security systems and monitoring service integrations.",
      icon: ShieldCheck,
      href: "#",
      status: "COMING SOON",
      category: "Security",
      color: "slate"
    },
    {
      title: "Utility Providers",
      description: "Direct integrations with water and power utility providers.",
      icon: Zap,
      href: "#",
      status: "COMING SOON",
      category: "Utilities",
      color: "amber"
    }
  ];

  return (
    <div className="p-4 lg:p-5 space-y-5 bg-[#F8F9FB] min-h-screen">
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm space-y-1">
        <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">ECOSYSTEM</p>
        <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Marketplace & Integrations</h1>
        <p className="text-[12px] font-medium text-[#64748B]">Connect external services to automate your property management workflows.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {integrations.map((item) => (
          <Link
            key={item.title}
            href={item.href}
            className="group bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-sm hover:shadow-md transition-all hover:border-blue-200 flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className={cn(
                  "h-10 w-10 rounded-lg flex items-center justify-center shadow-sm",
                  item.color === "blue" ? "bg-blue-50 text-blue-600" :
                  item.color === "green" ? "bg-green-50 text-green-600" :
                  item.color === "purple" ? "bg-purple-50 text-purple-600" :
                  item.color === "amber" ? "bg-amber-50 text-amber-600" :
                  "bg-slate-50 text-slate-600"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className={cn(
                  "text-[9px] font-bold",
                  item.status === "ACTIVE" ? "bg-green-50 text-green-700 border-green-100" :
                  item.status === "COMING SOON" ? "bg-slate-50 text-slate-500 border-slate-100" :
                  "bg-blue-50 text-blue-700 border-blue-100"
                )}>
                  {item.status}
                </Badge>
              </div>

              <div className="space-y-1">
                <h3 className="text-[14px] font-black text-[#1E293B] group-hover:text-blue-600 transition-colors">{item.title}</h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">{item.description}</p>
              </div>
            </div>

            <div className="mt-6 flex items-center text-[10px] font-bold text-blue-600 uppercase tracking-wider group-hover:translate-x-1 transition-transform">
              Configure
              <ArrowRight className="ml-2 h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function cn(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
