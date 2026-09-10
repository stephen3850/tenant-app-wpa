import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Building2,
  Users,
  MapPin,
  Phone,
  Mail,
  ChevronLeft,
  FileText,
  Wallet,
  Download,
  MoreHorizontal,
  LayoutGrid,
  TrendingUp,
  History,
  MessageSquare,
  ShieldCheck,
  Plus,
  Edit,
  Briefcase,
  ExternalLink,
  PieChart,
  Calendar,
  User as UserIcon,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default async function LandlordProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const landlordId = id;
  const organizationId = (session.user as any).organizationId;

  const landlord = await db.user.findUnique({
    where: { id: landlordId },
    include: {
      ownedProperties: {
        where: { organizationId },
        include: {
          units: true,
          leases: {
            where: { status: "ACTIVE" }
          }
        }
      }
    }
  });

  if (!landlord) redirect("/landlords");

  const totalProperties = landlord.ownedProperties.length;
  const totalUnits = landlord.ownedProperties.reduce((acc, p) => acc + p.units.length, 0);
  const activeLeases = landlord.ownedProperties.reduce((acc, p) => acc + p.leases.length, 0);
  const occupancyRate = totalUnits > 0 ? Math.round((activeLeases / totalUnits) * 100) : 0;

  // Real Financials
  const monthlyRevenue = landlord.ownedProperties.reduce((acc, p) =>
    acc + p.leases.reduce((lAcc, lease) => lAcc + Number(lease.monthlyRent), 0), 0);

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-[#F8F9FB] min-h-screen font-inter">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5">
          <Link href="/landlords" className="flex items-center text-[10px] font-bold text-[#667085] hover:text-[#12B76A] transition-colors mb-1">
            <ChevronLeft className="h-3 w-3 mr-1" /> BACK TO PORTFOLIO
          </Link>
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-[#F0FDF4] border border-[#12B76A]/10 flex items-center justify-center text-[#12B76A] font-black text-lg">
              {landlord.name?.charAt(0) || "L"}
            </div>
            <div>
              <h1 className="text-xl font-black text-[#1F2B3E] tracking-tight">{landlord.name || "Unnamed Landlord"}</h1>
              <div className="flex items-center gap-2 mt-0.5">
                 <Badge className="bg-[#12B76A] text-white border-none font-bold text-[9px] px-1.5 py-0 rounded-md">ACTIVE OWNER</Badge>
                 <span className="text-[10px] font-medium text-[#667085] flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3 text-[#0EA5E9]" /> ID: {landlord.id.slice(-6).toUpperCase()}
                 </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2B3E] font-bold text-[10px] gap-1.5 px-3">
             <Mail className="h-3.5 w-3.5 text-[#0EA5E9]" /> Email
          </Button>
          <Button variant="outline" className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2B3E] font-bold text-[10px] gap-1.5 px-3">
             <Edit className="h-3.5 w-3.5 text-[#667085]" /> Edit
          </Button>
          <Button className="h-8 rounded-lg bg-[#12B76A] text-white font-bold text-[10px] gap-1.5 px-4 shadow-md shadow-[#12B76A]/10 transition-all">
             <Plus className="h-3.5 w-3.5" /> Assign Property
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
         <ProfileStat label="Properties" value={totalProperties.toString()} icon={Building2} color="blue" />
         <ProfileStat label="Units" value={totalUnits.toString()} icon={LayoutGrid} color="orange" />
         <ProfileStat label="Occupancy" value={`${occupancyRate}%`} icon={TrendingUp} color="green" />
         <ProfileStat label="Revenue" value={`KES ${monthlyRevenue.toLocaleString()}`} icon={Wallet} color="purple" />
         <ProfileStat label="Health" value={`${occupancyRate}%`} icon={ShieldCheck} color="blue" />
      </div>

      <Tabs defaultValue="overview" className="space-y-5">
        <TabsList className="bg-[#F2F4F7] p-1 rounded-xl h-auto flex flex-wrap gap-1 border border-[#DCE3EA] w-fit">
           <TabsTrigger value="overview" className="rounded-lg py-1.5 px-4 font-bold text-[10px] data-[state=active]:bg-white data-[state=active]:text-[#12B76A]">Overview</TabsTrigger>
           <TabsTrigger value="properties" className="rounded-lg py-1.5 px-4 font-bold text-[10px] data-[state=active]:bg-white data-[state=active]:text-[#12B76A]">Properties</TabsTrigger>
           <TabsTrigger value="units" className="rounded-lg py-1.5 px-4 font-bold text-[10px] data-[state=active]:bg-white data-[state=active]:text-[#12B76A]">Units</TabsTrigger>
           <TabsTrigger value="financials" className="rounded-lg py-1.5 px-4 font-bold text-[10px] data-[state=active]:bg-white data-[state=active]:text-[#12B76A]">Financials</TabsTrigger>
           <TabsTrigger value="statements" className="rounded-lg py-1.5 px-4 font-bold text-[10px] data-[state=active]:bg-white data-[state=active]:text-[#12B76A]">Statements</TabsTrigger>
           <TabsTrigger value="documents" className="rounded-lg py-1.5 px-4 font-bold text-[10px] data-[state=active]:bg-white data-[state=active]:text-[#12B76A]">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-5">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-8 space-y-5">
                 <Card className="border-[#DCE3EA] shadow-none rounded-xl bg-white overflow-hidden">
                    <CardHeader className="p-4 border-b border-[#F2F4F7]">
                       <CardTitle className="text-[11px] font-black text-[#1F2B3E] uppercase tracking-wider">Owner Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <InfoItem label="Full Name" value={landlord.name || "N/A"} icon={UserIcon} />
                          <InfoItem label="Email Address" value={landlord.email} icon={Mail} />
                          <InfoItem label="Phone Number" value={landlord.phone || "N/A"} icon={Phone} />
                       </div>
                       <div className="space-y-4">
                          <InfoItem label="Ownership Type" value="INDIVIDUAL" icon={Briefcase} />
                          <InfoItem label="Portfolio Value" value={`KES ${(totalUnits * 1500000).toLocaleString()}`} icon={Wallet} />
                          <InfoItem label="Status" value="ACTIVE" icon={ShieldCheck} />
                       </div>
                    </CardContent>
                 </Card>

                 <Card className="border-[#DCE3EA] shadow-none rounded-xl bg-white p-4">
                    <h3 className="text-[11px] font-black text-[#1F2B3E] uppercase tracking-wider mb-4">Properties Owned</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                       {landlord.ownedProperties.map((p) => (
                          <div key={p.id} className="p-3 rounded-lg border border-[#F2F4F7] bg-[#F9FAFB]/50 flex justify-between items-center">
                             <div>
                                <p className="text-[11px] font-bold text-[#1F2B3E]">{p.propertyName}</p>
                                <p className="text-[9px] font-medium text-[#667085]">{p.units.length} Units • {p.propertyType}</p>
                             </div>
                             <Link href={`/properties/${p.id}`} className="text-[#12B76A] hover:bg-[#F0FDF4] p-1.5 rounded-lg transition-colors">
                                <ExternalLink className="h-3.5 w-3.5" />
                             </Link>
                          </div>
                       ))}
                    </div>
                 </Card>
              </div>

              <div className="lg:col-span-4 space-y-5">
                 <Card className="border-[#DCE3EA] shadow-none rounded-xl bg-white p-4">
                    <h3 className="text-[11px] font-black text-[#1F2B3E] uppercase tracking-wider mb-4">Performance</h3>
                    <div className="space-y-4">
                       <HealthMetric label="Collection" value={100} />
                       <HealthMetric label="Occupancy" value={occupancyRate} />
                       <HealthMetric label="Statement Accuracy" value={100} />
                    </div>
                 </Card>

                 <div className="space-y-2.5">
                    <h3 className="text-[9px] font-black text-[#667085] uppercase tracking-widest pl-1">TOOLS</h3>
                    <div className="grid grid-cols-1 gap-2">
                       <ActionButton label="Generate Monthly Statement" icon={FileText} color="purple" />
                       <ActionButton label="Record Manual Payout" icon={Wallet} color="green" />
                       <ActionButton label="Upload Documents" icon={Download} color="blue" />
                    </div>
                 </div>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="properties">
           <Card className="border-[#DCE3EA] shadow-none rounded-xl bg-white overflow-hidden">
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-[#F9FAFB]">
                       <TableRow className="border-b border-[#F2F4F7]">
                          <TableHead className="text-[10px] font-black uppercase text-[#667085] pl-5">Property</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-[#667085]">Type</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-[#667085]">Units</TableHead>
                          <TableHead className="text-[10px] font-black uppercase text-[#667085]">Income</TableHead>
                          <TableHead className="text-right text-[10px] font-black uppercase text-[#667085] pr-5">Action</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {landlord.ownedProperties.map((prop) => {
                          const income = prop.leases.reduce((acc, l) => acc + Number(l.monthlyRent), 0);
                          return (
                          <TableRow key={prop.id} className="border-b border-[#F2F4F7] hover:bg-[#F9FAFB]/50 transition-colors">
                             <TableCell className="font-bold text-[#1F2B3E] text-[11px] pl-5">{prop.propertyName}</TableCell>
                             <TableCell className="text-[10px] font-medium text-[#667085]">{prop.propertyType}</TableCell>
                             <TableCell className="text-[11px] font-bold text-[#1F2B3E]">{prop.units.length}</TableCell>
                             <TableCell className="text-[11px] font-black text-[#1F2B3E]">KES {income.toLocaleString()}</TableCell>
                             <TableCell className="text-right pr-5">
                                <Button variant="ghost" size="sm" className="font-bold text-[10px] text-[#12B76A] hover:bg-[#F0FDF4] h-7 px-2" asChild>
                                   <Link href={`/properties/${prop.id}`}>View Details</Link>
                                </Button>
                             </TableCell>
                          </TableRow>
                       )})}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileStat({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-[#EFF8FF] text-[#175CD3]",
    green: "bg-[#ECFDF3] text-[#027A48]",
    orange: "bg-[#FFF9F5] text-[#C4320A]",
    purple: "bg-[#F9F5FF] text-[#6941C6]",
    red: "bg-[#FEF3F2] text-[#B42318]",
  };

  return (
    <div className="bg-white p-3.5 rounded-xl border border-[#DCE3EA] shadow-none flex items-center gap-3">
       <div className={cn("h-8 w-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm", colors[color])}>
          <Icon className="h-4 w-4" />
       </div>
       <div>
          <p className="text-[8.5px] font-black text-[#667085] uppercase tracking-wider mb-0.5">{label}</p>
          <h4 className="text-[14px] font-black text-[#1F2B3E] tracking-tight">{value}</h4>
       </div>
    </div>
  );
}

function InfoItem({ label, value, icon: Icon }: any) {
   return (
      <div className="flex items-center gap-2.5">
         <div className="h-7 w-7 rounded-lg bg-[#F9FAFB] flex items-center justify-center shrink-0 border border-[#F2F4F7]">
            <Icon className="h-3.5 w-3.5 text-[#667085]" />
         </div>
         <div className="min-w-0">
            <p className="text-[8.5px] font-black text-[#98A2B3] uppercase tracking-widest">{label}</p>
            <p className="text-[11px] font-bold text-[#1F2B3E] truncate">{value}</p>
         </div>
      </div>
   );
}

function HealthMetric({ label, value }: { label: string; value: number }) {
   return (
      <div className="space-y-1">
         <div className="flex justify-between text-[9px] font-bold uppercase">
            <span className="text-[#667085]">{label}</span>
            <span className="text-[#12B76A]">{value}%</span>
         </div>
         <div className="h-1.5 w-full bg-[#F2F4F7] rounded-full overflow-hidden">
            <div className="h-full bg-[#12B76A] transition-all" style={{ width: `${value}%` }} />
         </div>
      </div>
   );
}

function ActionButton({ label, icon: Icon, color }: any) {
   const colors: any = {
      purple: "hover:bg-[#F9F5FF] text-[#6941C6] border-[#F4EBFF]",
      green: "hover:bg-[#F0FDF4] text-[#027A48] border-[#D1FADF]",
      blue: "hover:bg-[#EFF8FF] text-[#175CD3] border-[#D1E9FF]",
   };
   return (
      <Button variant="outline" className={cn("w-full justify-start h-9 px-3 rounded-lg border font-bold text-[10px] gap-2.5 shadow-none transition-all", colors[color])}>
         <Icon className="h-3.5 w-3.5" />
         {label}
      </Button>
   );
}
