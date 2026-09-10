import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ZapIcon, LayoutIcon, CreditCardIcon, WrenchIcon, FileIcon } from "lucide-react";

export function FeatureAdoption({ adoption }: any) {
  const features = [
    { label: "Tenant Portal", value: adoption.tenantPortal, icon: LayoutIcon, color: "text-blue-500" },
    { label: "Landlord Portal", value: adoption.landlordPortal, icon: LayoutIcon, color: "text-purple-500" },
    { label: "M-Pesa Payments", value: adoption.mpesaPayments, icon: CreditCardIcon, color: "text-green-500" },
    { label: "Maintenance", value: adoption.maintenanceRequests, icon: WrenchIcon, color: "text-orange-500" },
    { label: "Documents", value: adoption.documents, icon: FileIcon, color: "text-slate-500" },
  ];

  return (
    <Card className="border-none shadow-sm h-full">
      <CardHeader className="pb-2 border-b border-slate-50">
        <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-500 flex items-center gap-2">
          <ZapIcon className="h-4 w-4" /> Feature Adoption
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {features.map((feature) => (
            <div key={feature.label} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <feature.icon className={`h-4 w-4 ${feature.color}`} />
                  <span className="text-sm font-bold text-slate-700">{feature.label}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{feature.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                    className={`h-full rounded-full bg-slate-900`}
                    style={{ width: `${Math.min((feature.value / 1000) * 100, 100)}%` }} // Normalized for demo
                />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
