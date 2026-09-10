import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import {
  Building2,
  Users,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  FileText,
  Eye,
  Edit,
  Archive,
  Phone,
  Mail,
  Wallet,
  Download,
  CreditCard,
  LayoutGrid,
  TrendingUp,
  History,
  Briefcase,
  User,
  ArrowRight,
  TrendingDown,
  UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";

export default async function LandlordsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;

  // 1. FETCH ALL USERS WITH THE LANDLORD ROLE IN THIS ORG
  const landlordUsers = await db.user.findMany({
    where: {
      organizationId,
      status: "ACTIVE",
      userRoles: {
        some: {
          role: {
            name: "LANDLORD"
          }
        }
      }
    }
  });

  // 2. FETCH ACTIVE PROPERTIES TO ATTACH TO LANDLORDS
  const allProperties = await db.property.findMany({
    where: {
      organizationId,
      deletedAt: null,
      status: { not: "ARCHIVED" }
    },
    include: {
      landlord: true,
      units: {
        where: { deletedAt: null }
      },
      leases: {
        where: { status: "ACTIVE", deletedAt: null }
      }
    }
  });

  // 3. GROUP PROPERTIES AND ENSURE ALL USERS ARE IN THE LIST
  const landlordGroups: Record<string, any> = {};

  // Initialize with all landlord users found
  landlordUsers.forEach(user => {
    landlordGroups[user.id] = {
      id: user.id,
      name: user.name || "Unnamed User",
      email: user.email || "",
      phone: user.phone || "",
      properties: [],
      totalUnits: 0,
      occupiedUnits: 0,
      vacantUnits: 0,
      monthlyIncome: 0,
      expectedMonthlyIncome: 0,
    };
  });

  // Add properties to groups (handling unassigned or external landlords too)
  allProperties.forEach(prop => {
    let landlordKey = prop.landlordId || "unassigned";
    let landlordName = prop.landlord?.name || "Unassigned";

    // If no landlordId, try to extract from description
    if (!prop.landlordId && prop.description?.startsWith("Landlord: ")) {
       const extractedName = prop.description.replace("Landlord: ", "");
       landlordKey = `name_${extractedName}`;
       landlordName = extractedName;
    }

    if (!landlordGroups[landlordKey]) {
      landlordGroups[landlordKey] = {
        id: prop.landlordId,
        name: landlordName,
        email: prop.landlord?.email || "",
        phone: prop.landlord?.phone || "",
        properties: [],
        totalUnits: 0,
        occupiedUnits: 0,
        vacantUnits: 0,
        monthlyIncome: 0,
        expectedMonthlyIncome: 0,
      };
    }

    const group = landlordGroups[landlordKey];
    group.properties.push(prop);

    const propUnits = prop.units.length;
    const propOccupied = prop.leases.length;

    group.totalUnits += propUnits;
    group.occupiedUnits += propOccupied;
    group.vacantUnits += (propUnits - propOccupied);

    // Monthly income from active leases
    const propIncome = prop.leases.reduce((sum, lease) => sum + Number(lease.monthlyRent), 0);
    group.monthlyIncome += propIncome;

    // Expected monthly income from all units
    const propExpectedIncome = prop.units.reduce((sum, unit) => sum + Number(unit.monthlyRent), 0);
    group.expectedMonthlyIncome += propExpectedIncome;
  });

  const landlordList = Object.values(landlordGroups);

  // Global KPIs
  const totalLandlords = landlordList.length;
  const totalProperties = allProperties.length;
  const totalUnits = allProperties.reduce((acc, p) => acc + p.units.length, 0);
  const totalMonthlyIncome = landlordList.reduce((acc, l) => acc + l.monthlyIncome, 0);
  const totalExpectedIncome = landlordList.reduce((acc, l) => acc + l.expectedMonthlyIncome, 0);

  return (
    <div className="p-4 lg:p-6 space-y-6 animate-in fade-in duration-500 bg-[#F8F9FB] min-h-screen font-inter">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-black text-[#1F2B3E] tracking-tight">Owner Portfolio Command Center</h1>
          <p className="text-[11px] font-medium text-[#667085] mt-0.5">Manage property owners, portfolios, and financial performance.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2B3E] font-bold text-[10px] gap-1.5 px-3 shadow-sm">
             <FileText className="h-3.5 w-3.5 text-[#7C3AED]" /> Statements
          </Button>
          <Button variant="outline" className="h-8 rounded-lg border-[#DCE3EA] bg-white text-[#1F2B3E] font-bold text-[10px] gap-1.5 px-3 shadow-sm">
             <Wallet className="h-3.5 w-3.5 text-[#10B981]" /> Payouts
          </Button>
          <Button className="h-8 rounded-lg bg-[#12B76A] hover:bg-[#0E9355] text-white font-bold text-[10px] gap-1.5 px-4 shadow-md shadow-[#12B76A]/10 transition-all">
             <Plus className="h-3.5 w-3.5" /> Add Landlord
          </Button>
        </div>
      </div>

      {/* KPI Section - Updated to 5 columns on LG */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        <KPIItem label="LANDLORDS" value={totalLandlords.toString()} icon={Users} color="blue" />
        <KPIItem label="PROPERTIES" value={totalProperties.toString()} icon={Building2} color="green" />
        <KPIItem label="TOTAL UNITS" value={totalUnits.toString()} icon={LayoutGrid} color="orange" />
        <KPIItem label="MONTHLY INCOME" value={`KES ${totalMonthlyIncome.toLocaleString()}`} icon={CreditCard} color="purple" />
        <KPIItem label="EXPECTED INCOME" value={`KES ${totalExpectedIncome.toLocaleString()}`} icon={TrendingUp} color="green" />
      </div>

      {/* Search & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
         <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#98A2B3]" />
            <input
               type="text"
               placeholder="Search owners or properties..."
               className="h-9 w-full pl-9 pr-4 rounded-lg border border-[#DCE3EA] bg-white text-[11px] focus:outline-none focus:ring-2 focus:ring-[#12B76A]/10 transition-all shadow-sm"
            />
         </div>
         <div className="flex items-center gap-2">
            <Button variant="outline" className="h-9 rounded-lg border-[#DCE3EA] text-[#475467] font-bold text-[10px] gap-2 px-3 bg-white shadow-sm">
               <Filter className="h-3.5 w-3.5" /> Filters
            </Button>
         </div>
      </div>

      {/* LANDLORD CARDS - Grouped View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {landlordList.length === 0 ? (
          <div className="col-span-full py-20 bg-white border border-dashed border-[#DCE3EA] rounded-2xl flex flex-col items-center justify-center space-y-4">
             <div className="h-12 w-12 rounded-full bg-[#F9FAFB] flex items-center justify-center">
                <Users className="h-6 w-6 text-[#98A2B3]" />
             </div>
             <div className="text-center space-y-1">
                <h3 className="text-sm font-bold text-[#1F2B3E]">No landlords found</h3>
                <p className="text-[11px] text-[#667085] max-w-xs">Create your first landlord profile or assign properties to begin management.</p>
             </div>
             <Button className="h-9 bg-[#12B76A] text-white font-bold text-[11px] px-6 rounded-lg">Add First Landlord</Button>
          </div>
        ) : (
          landlordList.map((landlord, idx) => (
            <Card key={idx} className="border-[#DCE3EA] shadow-none rounded-2xl overflow-hidden bg-white hover:border-[#12B76A]/30 transition-all group">
              <CardContent className="p-0">
                {/* Card Top: Landlord Info */}
                <div className="p-4 border-b border-[#F2F4F7] bg-[#F9FAFB]/30">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                         <div className="h-10 w-10 rounded-xl bg-[#F0FDF4] border border-[#12B76A]/10 flex items-center justify-center text-[#12B76A] font-bold text-sm shadow-sm">
                            {landlord.name.charAt(0)}
                         </div>
                         <div className="min-w-0">
                            <h3 className="font-bold text-[#1F2B3E] text-[14px] leading-tight truncate">{landlord.name}</h3>
                            <div className="flex items-center gap-1.5 mt-0.5">
                               <div className="h-1.5 w-1.5 rounded-full bg-[#12B76A]" />
                               <span className="text-[10px] font-medium text-[#667085] truncate">{landlord.email || landlord.phone || "No contact info"}</span>
                            </div>
                         </div>
                      </div>
                      <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg text-[#98A2B3] hover:text-[#1F2B3E]">
                               <MoreHorizontal className="h-4 w-4" />
                            </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl border-[#DCE3EA] p-1.5">
                            <DropdownMenuItem className="rounded-lg gap-2 text-xs font-semibold py-2">
                               <Edit className="h-3.5 w-3.5" /> Edit Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-lg gap-2 text-xs font-semibold py-2">
                               <Wallet className="h-3.5 w-3.5" /> Record Payout
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="rounded-lg gap-2 text-xs font-semibold py-2 text-red-600">
                               <Archive className="h-3.5 w-3.5" /> Archive
                            </DropdownMenuItem>
                         </DropdownMenuContent>
                      </DropdownMenu>
                   </div>
                </div>

                {/* Card Middle: Property List */}
                <div className="px-4 py-3 space-y-2.5">
                   <p className="text-[9px] font-black text-[#98A2B3] uppercase tracking-widest">Portfolio Properties</p>
                   <div className="space-y-1.5">
                      {landlord.properties.map((p: any) => (
                        <div key={p.id} className="flex items-center justify-between text-[11px] font-bold text-[#1F2B3E] bg-[#F9FAFB] p-2 rounded-lg border border-[#F2F4F7]">
                           <div className="flex items-center gap-2 truncate">
                              <Building2 className="h-3 w-3 text-[#98A2B3] shrink-0" />
                              <span className="truncate">{p.propertyName}</span>
                           </div>
                           <Link href={`/properties/${p.id}`} className="text-[#12B76A] hover:underline shrink-0">
                              <ArrowRight className="h-3 w-3" />
                           </Link>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Card Stats: Income & Occupancy */}
                <div className="p-4 bg-[#F9FAFB]/50 border-t border-[#F2F4F7] grid grid-cols-2 gap-y-4 gap-x-4">
                   <div className="space-y-1">
                      <p className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Monthly Income</p>
                      <p className="text-[13px] font-black text-[#1F2B3E]">KES {landlord.monthlyIncome.toLocaleString()}</p>
                   </div>
                   <div className="space-y-1 text-right">
                      <p className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Expected</p>
                      <p className="text-[13px] font-black text-[#64748B]">KES {landlord.expectedMonthlyIncome.toLocaleString()}</p>
                   </div>
                   <div className="space-y-1 col-span-2">
                      <p className="text-[9px] font-bold text-[#667085] uppercase tracking-wider">Occupancy</p>
                      <div className="flex items-center gap-2">
                         <p className="text-[13px] font-black text-[#12B76A]">{landlord.totalUnits > 0 ? Math.round((landlord.occupiedUnits/landlord.totalUnits)*100) : 0}%</p>
                         <div className="h-1.5 flex-1 bg-[#EAECF0] rounded-full overflow-hidden">
                            <div className="h-full bg-[#12B76A]" style={{ width: `${landlord.totalUnits > 0 ? (landlord.occupiedUnits/landlord.totalUnits)*100 : 0}%` }} />
                         </div>
                      </div>
                   </div>
                </div>

                {/* Card Bottom: Detailed Stats */}
                <div className="px-4 py-3 flex items-center justify-between border-t border-[#F2F4F7]">
                   <div className="flex gap-4">
                      <div className="text-center">
                         <p className="text-[14px] font-black text-[#1F2B3E]">{landlord.occupiedUnits}</p>
                         <p className="text-[9px] font-bold text-[#667085] uppercase">With People</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[14px] font-black text-[#F38744]">{landlord.vacantUnits}</p>
                         <p className="text-[9px] font-bold text-[#667085] uppercase">Vacant</p>
                      </div>
                   </div>
                   <Button size="sm" className={cn("h-7 rounded-lg font-bold text-[10px] px-3", landlord.id ? "bg-[#12B76A]" : "bg-blue-600")} asChild>
                      {landlord.id ? (
                        <Link href={`/landlords/${landlord.id}`}>View Profile</Link>
                      ) : (
                        <div className="cursor-help flex items-center gap-1.5">
                           <UserPlus className="h-3 w-3" /> Link Profile
                        </div>
                      )}
                   </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

function KPIItem({ label, value, icon: Icon, color }: any) {
  const colors: any = {
    blue: "bg-[#EFF8FF] text-[#175CD3] ring-[#B2DDFF]",
    green: "bg-[#ECFDF3] text-[#027A48] ring-[#ABEFC6]",
    orange: "bg-[#FFF9F5] text-[#C4320A] ring-[#FEDAD0]",
    purple: "bg-[#F9F5FF] text-[#6941C6] ring-[#E9D7FE]",
  };

  return (
    <Card className="border-[#DCE3EA] shadow-none rounded-xl bg-white overflow-hidden hover:border-[#12B76A]/30 transition-all">
      <CardContent className="p-3.5">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-[9px] font-black text-[#667085] uppercase tracking-wider">{label}</p>
            <h4 className="text-[16px] font-black text-[#1F2B3E] tracking-tight">{value}</h4>
          </div>
          <div className={cn("h-7 w-7 rounded-lg flex items-center justify-center ring-1 shadow-sm", colors[color])}>
            <Icon className="h-3.5 w-3.5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
