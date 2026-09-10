import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PaymentApiForm } from "./payment-api-form";
import { getMpesaCredentials } from "@/actions/integrations";
import { serialize } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Landmark, Globe } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function PaymentMethodAPIsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const credentials = await getMpesaCredentials();

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-[#F8F9FB] min-h-screen">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm space-y-1">
        <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">API INTEGRATIONS</p>
        <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Payment Method APIs</h1>
        <p className="text-[12px] font-medium text-[#64748B]">Configure automated payment collection and reconciliation services.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Main Configuration - M-Pesa */}
        <div className="xl:col-span-8">
          <PaymentApiForm initialData={serialize(credentials)} />
        </div>

        {/* Side Info & Other Providers */}
        <div className="xl:col-span-4 space-y-6">
          {/* Bank Integration Placeholder */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm">
                <Landmark className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-100 text-[9px] font-bold">
                COMING SOON
              </Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-[14px] font-black text-[#1E293B]">Direct Bank Feed</h3>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Connect your business bank accounts via API for real-time transaction reconciliation.
              </p>
            </div>
          </div>

          {/* Stripe/Global Placeholder */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-4">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-sm">
                <Globe className="h-5 w-5" />
              </div>
              <Badge variant="outline" className="bg-slate-50 text-slate-500 border-slate-100 text-[9px] font-bold">
                COMING SOON
              </Badge>
            </div>
            <div className="space-y-1">
              <h3 className="text-[14px] font-black text-[#1E293B]">Stripe & Cards</h3>
              <p className="text-[11px] text-[#64748B] leading-relaxed">
                Accept international credit/debit cards and wallet payments via Stripe integration.
              </p>
            </div>
          </div>

          {/* Help Card */}
          <div className="bg-[#1E293B] rounded-xl p-6 text-white shadow-sm space-y-3">
             <h3 className="text-sm font-bold">Need help with Daraja?</h3>
             <p className="text-[11px] text-slate-400 leading-relaxed">
               Our technical team can help you set up your Safaricom G2 portal and go-live process.
             </p>
             <button className="text-[10px] font-black uppercase tracking-wider text-blue-400 hover:text-blue-300 transition-colors">
               Contact Integration Support
             </button>
          </div>
        </div>
      </div>
    </div>
  );
}
