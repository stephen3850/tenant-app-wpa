import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const dynamic = 'force-dynamic';

export default async function CommunicationAPIsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="p-4 lg:p-5 space-y-4 bg-[#F8F9FB] min-h-screen">
      {/* Header Card */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-[#E2E8F0] shadow-sm space-y-0.5">
        <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">API INTEGRATIONS</p>
        <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Communication APIs</h1>
        <p className="text-[11px] font-medium text-[#64748B]">Manage supported WhatsApp and text SMS providers for tenant, landlord, owner, and staff messaging.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
        {/* Card 1: Zivo WhatsApp Support */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="p-4 lg:p-5 space-y-4 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="text-[13px] font-black text-[#1E293B] leading-tight">Zivo WhatsApp Support</h3>
                <p className="text-[10px] text-[#64748B] leading-tight">Zivo API credentials and workspace metadata.</p>
              </div>
              <Badge className="bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] border-none text-[9px] font-bold px-1.5 py-0 rounded-full shrink-0">
                WhatsApp
              </Badge>
            </div>

            <div className="flex items-center space-x-2 py-1 border-y border-slate-50">
              <Checkbox id="enable-zivo" className="h-3.5 w-3.5" />
              <Label htmlFor="enable-zivo" className="text-[11px] font-black text-[#1E293B] cursor-pointer">Enable Zivo WhatsApp API</Label>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">API Base URL</Label>
                <Input placeholder="https://zivo.co.ke" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Partner ID</Label>
                  <Input placeholder="1014" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Workspace ID</Label>
                  <Input placeholder="43" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Send Path</Label>
                <Input placeholder="/api/zivo/..." className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Workspace Name</Label>
                <Input placeholder="Zivo" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Phone Number ID</Label>
                <Input placeholder="12015..." className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Sender ID</Label>
                <Input placeholder="Zivo" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">API Key</Label>
                <Input placeholder="Paste API key" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg bg-slate-50/50" />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="clear-zivo" className="h-3.5 w-3.5" />
                <Label htmlFor="clear-zivo" className="text-[10px] font-medium text-[#64748B] cursor-pointer">Clear saved key</Label>
              </div>
              <p className="text-[9px] text-[#64748B] italic">Secret status: No API key saved</p>
            </div>
          </div>
          <div className="p-4 lg:p-5 pt-0">
            <Button className="w-full h-8 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[12px] rounded-lg shadow-sm">
              Save Zivo API
            </Button>
          </div>
        </div>

        {/* Card 2: Email Delivery */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="p-4 lg:p-5 space-y-4 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="text-[13px] font-black text-[#1E293B] leading-tight">Email Delivery</h3>
                <p className="text-[10px] text-[#64748B] leading-tight">Business sender email and SMTP settings.</p>
              </div>
              <Badge className="bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] border-none text-[9px] font-bold px-1.5 py-0 rounded-full shrink-0">
                Email
              </Badge>
            </div>

            <div className="flex items-center space-x-2 py-1 border-y border-slate-50">
              <Checkbox id="enable-smtp" className="h-3.5 w-3.5" />
              <Label htmlFor="enable-smtp" className="text-[11px] font-black text-[#1E293B] cursor-pointer">Enable business SMTP email</Label>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">From name</Label>
                <Input placeholder="management" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">From email</Label>
                <Input placeholder="accounts@example.com" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">SMTP host</Label>
                <Input placeholder="smtp.zoho.com" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">SMTP port</Label>
                  <Input placeholder="587" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
                </div>
                <div className="space-y-1">
                  <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Encryption</Label>
                  <Input placeholder="TLS" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">SMTP username</Label>
                <Input placeholder="accounts@example.com" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">SMTP password</Label>
                <Input placeholder="Enter password" type="password" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg bg-slate-50/50" />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="clear-smtp" className="h-3.5 w-3.5" />
                <Label htmlFor="clear-smtp" className="text-[10px] font-medium text-[#64748B] cursor-pointer">Clear saved SMTP password</Label>
              </div>
            </div>
          </div>
          <div className="p-4 lg:p-5 pt-0">
            <Button className="w-full h-8 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[12px] rounded-lg shadow-sm">
              Save Business Email
            </Button>
          </div>
        </div>

        {/* Card 3: Text SMS */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="p-4 lg:p-5 space-y-4 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <h3 className="text-[13px] font-black text-[#1E293B] leading-tight">Text SMS</h3>
                <p className="text-[10px] text-[#64748B] leading-tight">TextSMS and Africa's Talking credentials.</p>
              </div>
              <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-none text-[9px] font-bold px-1.5 py-0 rounded-full shrink-0">
                SMS
              </Badge>
            </div>

            <div className="flex items-center space-x-2 py-1 border-y border-slate-50">
              <Checkbox id="enable-sms" className="h-3.5 w-3.5" />
              <Label htmlFor="enable-sms" className="text-[11px] font-black text-[#1E293B] cursor-pointer">Enable SMS sending</Label>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg border-2 border-amber-200 bg-amber-50/50 space-y-0.5 relative">
                <div className="absolute right-3 top-3 h-3.5 w-3.5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-600" />
                </div>
                <p className="text-[11px] font-black text-[#1E293B]">TextSMS</p>
                <p className="text-[9px] text-[#64748B]">Partner ID and API key setup.</p>
              </div>

              <div className="p-3 rounded-lg border border-[#E2E8F0] space-y-0.5 relative">
                <div className="absolute right-3 top-3 h-3.5 w-3.5 rounded-full border-2 border-slate-300" />
                <p className="text-[11px] font-black text-[#1E293B]">Africa's Talking</p>
                <p className="text-[9px] text-[#64748B]">Username and API key callbacks.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Username / Partner ID</Label>
                <Input className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">Sender ID / Shortcode</Label>
                <Input className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1">
                <Label className="text-[9px] font-black text-slate-500 uppercase tracking-tight">API Key</Label>
                <Input placeholder="Paste API key" className="h-8 text-[11px] font-bold border-[#E2E8F0] rounded-lg bg-slate-50/50" />
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="flex items-center space-x-2">
                <Checkbox id="clear-sms" className="h-3.5 w-3.5" />
                <Label htmlFor="clear-sms" className="text-[10px] font-medium text-[#64748B] cursor-pointer">Clear saved key</Label>
              </div>
              <p className="text-[9px] text-[#64748B] font-medium">Supported: TextSMS and Africa's Talking.</p>
            </div>
          </div>
          <div className="p-4 lg:p-5 pt-0">
            <Button className="w-full h-8 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[12px] rounded-lg shadow-sm">
              Save SMS API
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
