import { getFeatureAdoptionAnalytics } from "@/actions/analytics";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  CreditCard,
  FileText,
  Tool,
  ShieldCheck,
  Smartphone,
  MessageSquare
} from "lucide-react";

export default async function FeatureAdoptionPage() {
  const data = await getFeatureAdoptionAnalytics();

  const features = [
    {
      name: "M-Pesa Automation",
      icon: <Smartphone className="w-5 h-5" />,
      adoption: data.adoptionRates.mpesa,
      count: data.completedPayments,
      unit: "Payments"
    },
    {
      name: "Digital Leasing",
      icon: <FileText className="w-5 h-5" />,
      adoption: data.adoptionRates.digitalLeasing,
      count: data.activeLeases,
      unit: "Active Leases"
    },
    {
      name: "Maintenance Tickets",
      icon: <Tool className="w-5 h-5" />,
      adoption: data.adoptionRates.maintenance,
      count: data.maintenanceTickets,
      unit: "Tickets"
    },
    {
      name: "Communications",
      icon: <MessageSquare className="w-5 h-5" />,
      adoption: 75, // Placeholder
      count: data.communications,
      unit: "Messages"
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Feature Adoption</h1>
        <p className="text-slate-500 font-medium">Tracking how organizations utilize the platform.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {features.map((feature) => (
          <Card key={feature.name} className="shadow-sm border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-slate-900 text-white rounded-lg">
                  {feature.icon}
                </div>
                <div>
                  <CardTitle className="text-lg font-bold">{feature.name}</CardTitle>
                  <CardDescription>Usage across active organizations</CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-slate-900">{feature.adoption.toFixed(1)}%</div>
                <div className="text-xs font-bold text-slate-400 uppercase">Adoption Rate</div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <Progress value={feature.adoption} className="h-2 bg-slate-100" />
              <div className="flex justify-between items-center text-sm font-medium">
                <span className="text-slate-500">Total Volume</span>
                <span className="text-slate-900 font-bold">{feature.count.toLocaleString()} {feature.unit}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
