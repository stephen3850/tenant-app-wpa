import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserCircle, Shield, History, Globe, Monitor } from "lucide-react";

export default function SecurityInvestigationsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Security Investigations</h1>
        <p className="text-slate-500 font-medium">Deep-dive into account activity and forensic analysis.</p>
      </div>

      <Card className="shadow-sm border-slate-200">
        <CardHeader className="bg-slate-50/50">
            <CardTitle className="text-lg font-bold">Start New Investigation</CardTitle>
            <CardDescription>Enter a User ID or Email to pull a full security profile.</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
            <div className="flex gap-4 max-w-2xl">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input placeholder="user@example.com or user_cuid..." className="pl-10 border-slate-200" />
                </div>
                <Button className="bg-slate-900 text-white font-bold px-8">Launch Forensic View</Button>
            </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 opacity-40 grayscale pointer-events-none">
          {/* Mock Investigation Profile */}
          <Card className="shadow-sm border-slate-200 col-span-1">
              <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Subject Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-200" />
                      <div>
                          <div className="font-bold text-slate-900">John Doe</div>
                          <div className="text-xs text-slate-500 font-medium">john@example.com</div>
                      </div>
                  </div>
              </CardContent>
          </Card>

          <Card className="shadow-sm border-slate-200 col-span-2">
              <CardHeader>
                  <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500">Security Timeline</CardTitle>
              </CardHeader>
              <CardContent className="h-64 flex items-center justify-center">
                  <span className="text-slate-400 font-bold">Investigative Timeline UI</span>
              </CardContent>
          </Card>
      </div>

      <div className="text-center py-12">
          <p className="text-slate-400 font-medium italic">Select a user to begin a forensic investigation.</p>
      </div>
    </div>
  );
}
