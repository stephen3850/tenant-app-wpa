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
    <div className="p-4 lg:p-6 space-y-4 bg-[#F8F9FB] min-h-screen">
      {/* Header Card */}
      <div className="bg-white p-6 rounded-xl border border-[#E2E8F0] shadow-sm space-y-1">
        <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">API INTEGRATIONS</p>
        <h1 className="text-2xl font-black text-[#1E293B] tracking-tight">Communication APIs</h1>
        <p className="text-[12px] font-medium text-[#64748B]">Manage supported WhatsApp and text SMS providers for tenant, landlord, owner, and staff messaging.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Zivo WhatsApp Support */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="p-6 space-y-6 flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-[14px] font-black text-[#1E293B]">Zivo WhatsApp Support</h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">Zivo API credentials and workspace metadata.</p>
              </div>
              <Badge className="bg-[#DCFCE7] text-[#166534] hover:bg-[#DCFCE7] border-none text-[10px] font-bold px-2 py-0.5 rounded-full">
                WhatsApp
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="enable-zivo" />
              <Label htmlFor="enable-zivo" className="text-[12px] font-black text-[#1E293B] cursor-pointer">Enable Zivo WhatsApp API</Label>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">API Base URL</Label>
                <Input placeholder="https://zivo.co.ke" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">Partner ID</Label>
                <Input placeholder="1014" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">Send Path</Label>
                <Input placeholder="/api/zivo/zchat/services/sendwhatsapp" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">Workspace ID</Label>
                <Input placeholder="43" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">Workspace Name</Label>
                <Input placeholder="Zivo" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">Phone Number ID</Label>
                <Input placeholder="1201520769712709" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">Sender ID</Label>
                <Input placeholder="Zivo" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">API Key</Label>
                <Input placeholder="Paste API key" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg bg-slate-50/50" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="clear-zivo" />
                <Label htmlFor="clear-zivo" className="text-[11px] font-medium text-[#64748B] cursor-pointer">Clear saved Zivo API key</Label>
              </div>
              <p className="text-[10px] text-[#64748B] italic">Secret status: No API key saved</p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <Button className="w-full h-10 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[13px] rounded-xl shadow-sm">
              Save Zivo API
            </Button>
          </div>
        </div>

        {/* Card 2: Email Delivery */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="p-6 space-y-6 flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-[14px] font-black text-[#1E293B]">Email Delivery</h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">Business sender email and SMTP settings for communication.</p>
              </div>
              <Badge className="bg-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] border-none text-[10px] font-bold px-2 py-0.5 rounded-full">
                Email
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="enable-smtp" />
              <Label htmlFor="enable-smtp" className="text-[12px] font-black text-[#1E293B] cursor-pointer">Enable business SMTP email</Label>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">From name</Label>
                <Input placeholder="management" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">From email</Label>
                <Input placeholder="accounts@example.com" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">SMTP host</Label>
                <Input placeholder="smtp.zoho.com" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">SMTP port</Label>
                <Input placeholder="587" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">Encryption</Label>
                <Input placeholder="TLS" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">SMTP username</Label>
                <Input placeholder="accounts@example.com" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">SMTP password</Label>
                <Input placeholder="Enter password or app password" type="password" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg bg-slate-50/50" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="clear-smtp" />
                <Label htmlFor="clear-smtp" className="text-[11px] font-medium text-[#64748B] cursor-pointer">Clear saved SMTP password</Label>
              </div>
            </div>
          </div>
          <div className="p-6 pt-0">
            <Button className="w-full h-10 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[13px] rounded-xl shadow-sm">
              Save Business Email
            </Button>
          </div>
        </div>

        {/* Card 3: Text SMS */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col">
          <div className="p-6 space-y-6 flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <h3 className="text-[14px] font-black text-[#1E293B]">Text SMS</h3>
                <p className="text-[11px] text-[#64748B] leading-relaxed">TextSMS and Africa\u0027s Talking credentials.</p>
              </div>
              <Badge className="bg-[#FEF3C7] text-[#92400E] hover:bg-[#FEF3C7] border-none text-[10px] font-bold px-2 py-0.5 rounded-full">
                SMS
              </Badge>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="enable-sms" />
              <Label htmlFor="enable-sms" className="text-[12px] font-black text-[#1E293B] cursor-pointer">Enable SMS sending</Label>
            </div>

            <div className="space-y-3">
              <div className="p-4 rounded-xl border-2 border-amber-200 bg-amber-50/50 space-y-1 relative">
                <div className="absolute right-4 top-4 h-4 w-4 rounded-full border-2 border-blue-600 flex items-center justify-center">
                  <div className="h-2 w-2 rounded-full bg-blue-600" />
                </div>
                <p className="text-[12px] font-black text-[#1E293B]">TextSMS</p>
                <p className="text-[10px] text-[#64748B]">Partner ID, API key, and shortcode setup.</p>
              </div>

              <div className="p-4 rounded-xl border border-[#E2E8F0] space-y-1 relative">
                <div className="absolute right-4 top-4 h-4 w-4 rounded-full border-2 border-slate-300" />
                <p className="text-[12px] font-black text-[#1E293B]">Africa\u0027s Talking</p>
                <p className="text-[10px] text-[#64748B]">Username, API key, sender ID, and delivery callbacks.</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">Username / Partner ID</Label>
                <Input className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">Sender ID / Shortcode</Label>
                <Input className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[10px] font-black text-slate-500 uppercase">API Key</Label>
                <Input placeholder="Paste API key" className="h-9 text-[12px] font-bold border-[#E2E8F0] rounded-lg bg-slate-50/50" />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <div className="flex items-center space-x-2">
                <Checkbox id="clear-sms" />
                <Label htmlFor="clear-sms" className="text-[11px] font-medium text-[#64748B] cursor-pointer">Clear saved SMS API key</Label>
              </div>
              <p className="text-[10px] text-[#64748B] font-medium">Supported: TextSMS and Africa\u0027s Talking.</p>
            </div>
          </div>
          <div className="p-6 pt-0">
            <Button className="w-full h-10 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[13px] rounded-xl shadow-sm">
              Save SMS API
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
