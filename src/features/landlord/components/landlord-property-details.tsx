"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  BuildingIcon, MapPinIcon, HomeIcon, UsersIcon,
  TrendingUpIcon, WalletIcon, WrenchIcon, KeyIcon,
  FileTextIcon, DownloadIcon, ChevronLeftIcon,
  CalendarIcon, UserIcon, PercentIcon, DollarSignIcon
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export function LandlordPropertyDetails({
  property,
  performance,
  units,
  documents,
  tenancy,
  maintenance
}: {
  property: any;
  performance: any;
  units: any[];
  documents: any[];
  tenancy: any;
  maintenance: any;
}) {
  const getOccupancyStatusBadge = (status: string) => {
    switch (status.toUpperCase()) {
      case "OCCUPIED": return <Badge className="bg-emerald-500">Occupied</Badge>;
      case "VACANT": return <Badge variant="outline" className="text-orange-500 border-orange-500">Vacant</Badge>;
      case "RESERVED": return <Badge className="bg-blue-500">Reserved</Badge>;
      case "MAINTENANCE": return <Badge className="bg-slate-500">Maintenance</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link href="/landlord/properties" className="flex items-center text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors mb-2">
            <ChevronLeftIcon className="h-4 w-4 mr-1" /> Back to Portfolio
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{property.propertyName}</h1>
            <Badge className="bg-emerald-500">{property.status}</Badge>
          </div>
          <p className="text-slate-500 font-medium flex items-center gap-1">
            <MapPinIcon className="h-4 w-4" /> {property.address}, {property.city}, {property.county}
          </p>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" className="font-bold">Download Statement</Button>
           <Button className="font-bold bg-blue-600 hover:bg-blue-700">Property Settings</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase">Revenue (MTD)</CardTitle>
            <WalletIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">KES {performance.revenue.toLocaleString()}</div>
            <p className="text-xs text-emerald-600 font-bold flex items-center gap-1 mt-1">
              <TrendingUpIcon className="h-3 w-3" /> +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase">Occupancy</CardTitle>
            <UsersIcon className="h-4 w-4 text-indigo-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">{performance.occupancyRate.toFixed(1)}%</div>
            <p className="text-xs text-slate-500 font-medium mt-1">{tenancy.vacancies} units vacant</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase">Net Income</CardTitle>
            <TrendingUpIcon className="h-4 w-4 text-emerald-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">KES {performance.netIncome.toLocaleString()}</div>
            <p className="text-xs text-slate-500 font-medium mt-1">After expenses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase">Arrears</CardTitle>
            <DollarSignIcon className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-slate-900">KES {performance.arrears.toLocaleString()}</div>
            <p className="text-xs text-red-600 font-bold mt-1">Requires attention</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-8">
        <TabsList className="bg-slate-100/50 p-1 rounded-xl h-auto flex flex-wrap gap-1 border border-slate-200/50 w-fit">
           <TabsTrigger value="overview" className="rounded-lg py-2 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
              Overview
           </TabsTrigger>
           <TabsTrigger value="units" className="rounded-lg py-2 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
              Unit Breakdown
           </TabsTrigger>
           <TabsTrigger value="tenancy" className="rounded-lg py-2 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
              Tenancy
           </TabsTrigger>
           <TabsTrigger value="maintenance" className="rounded-lg py-2 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
              Maintenance
           </TabsTrigger>
           <TabsTrigger value="documents" className="rounded-lg py-2 px-6 font-bold flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600">
              Documents
           </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8">
           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="lg:col-span-2">
                 <CardHeader>
                    <CardTitle className="text-xl font-bold">Property Information</CardTitle>
                    <CardDescription>General details about the asset.</CardDescription>
                 </CardHeader>
                 <CardContent className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-2 rounded-lg"><BuildingIcon className="h-5 w-5 text-slate-600" /></div>
                          <div>
                             <p className="text-xs font-black text-slate-400 uppercase">Property Type</p>
                             <p className="font-bold text-slate-900">{property.propertyType}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-2 rounded-lg"><CalendarIcon className="h-5 w-5 text-slate-600" /></div>
                          <div>
                             <p className="text-xs font-black text-slate-400 uppercase">Acquisition Date</p>
                             <p className="font-bold text-slate-900">{property.acquisitionDate ? format(new Date(property.acquisitionDate), "MMMM dd, yyyy") : "N/A"}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-2 rounded-lg"><PercentIcon className="h-5 w-5 text-slate-600" /></div>
                          <div>
                             <p className="text-xs font-black text-slate-400 uppercase">Ownership</p>
                             <p className="font-bold text-slate-900">{property.ownershipPercentage}%</p>
                          </div>
                       </div>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-2 rounded-lg"><UserIcon className="h-5 w-5 text-slate-600" /></div>
                          <div>
                             <p className="text-xs font-black text-slate-400 uppercase">Property Manager</p>
                             <p className="font-bold text-slate-900">{property.manager?.name || "Unassigned"}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-3">
                          <div className="bg-slate-100 p-2 rounded-lg"><DollarSignIcon className="h-5 w-5 text-slate-600" /></div>
                          <div>
                             <p className="text-xs font-black text-slate-400 uppercase">Market Value</p>
                             <p className="font-bold text-slate-900">KES {property.propertyValue?.toLocaleString() || "N/A"}</p>
                          </div>
                       </div>
                    </div>
                    <div className="col-span-full pt-4 border-t border-slate-100">
                       <p className="text-xs font-black text-slate-400 uppercase mb-2 tracking-widest">Description</p>
                       <p className="text-slate-600 text-sm leading-relaxed">{property.description || "No description provided."}</p>
                    </div>
                 </CardContent>
              </Card>

              <div className="space-y-8">
                 <Card>
                    <CardHeader>
                       <CardTitle className="text-lg font-bold">Manager Performance</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-500">Response Time</span>
                          <span className="text-sm font-bold text-slate-900">4.2h</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-500">Rent Collection</span>
                          <span className="text-sm font-bold text-emerald-600">98%</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-500">Ticket Resolution</span>
                          <span className="text-sm font-bold text-slate-900">92%</span>
                       </div>
                       <Button variant="outline" className="w-full font-bold mt-2" size="sm">Contact Manager</Button>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </TabsContent>

        <TabsContent value="units">
           <Card>
              <CardHeader>
                 <CardTitle className="text-xl font-bold">Unit Inventory</CardTitle>
                 <CardDescription>Detailed list of all units in this property.</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-slate-50">
                       <TableRow>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Unit #</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest">Type</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest">Rent (KES)</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest">Size</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest">Status</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Action</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {units.map((unit) => (
                          <TableRow key={unit.id} className="hover:bg-slate-50/50 transition-colors">
                             <TableCell className="font-bold text-slate-900 pl-6">{unit.unitNumber}</TableCell>
                             <TableCell className="text-sm font-medium text-slate-600">{unit.unitType}</TableCell>
                             <TableCell className="font-bold text-slate-900">{unit.monthlyRent.toLocaleString()}</TableCell>
                             <TableCell className="text-sm font-medium text-slate-500">{unit.squareFootage?.toString() || "N/A"} sqft</TableCell>
                             <TableCell>{getOccupancyStatusBadge(unit.occupancyStatus)}</TableCell>
                             <TableCell className="text-right pr-6">
                                <Button variant="ghost" size="sm" className="font-bold text-blue-600">View History</Button>
                             </TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="tenancy" className="space-y-6">
           <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-blue-50/30 border-blue-100">
                 <CardContent className="pt-6">
                    <div className="text-2xl font-black text-blue-900">{tenancy.activeLeases.length}</div>
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider">Active Leases</p>
                 </CardContent>
              </Card>
              <Card className="bg-orange-50/30 border-orange-100">
                 <CardContent className="pt-6">
                    <div className="text-2xl font-black text-orange-900">{tenancy.expiringLeases.length}</div>
                    <p className="text-xs font-bold text-orange-700 uppercase tracking-wider">Expiring (30d)</p>
                 </CardContent>
              </Card>
              <Card className="bg-indigo-50/30 border-indigo-100">
                 <CardContent className="pt-6">
                    <div className="text-2xl font-black text-indigo-900">{tenancy.renewalsPending}</div>
                    <p className="text-xs font-bold text-indigo-700 uppercase tracking-wider">Renewals Pending</p>
                 </CardContent>
              </Card>
              <Card className="bg-emerald-50/30 border-emerald-100">
                 <CardContent className="pt-6">
                    <div className="text-2xl font-black text-emerald-900">{tenancy.vacancies}</div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider">Current Vacancies</p>
                 </CardContent>
              </Card>
           </div>

           <Card>
              <CardHeader>
                 <CardTitle className="text-xl font-bold">Active Leases</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-slate-50">
                       <TableRow>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Tenant</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest">Unit</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest">Start Date</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest">End Date</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest">Monthly Rent</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {tenancy.activeLeases.map((lease: any) => (
                          <TableRow key={lease.id}>
                             <TableCell className="font-bold text-slate-900 pl-6">{lease.tenant.firstName} {lease.tenant.lastName}</TableCell>
                             <TableCell className="font-medium text-slate-600">{lease.unit.unitNumber}</TableCell>
                             <TableCell className="text-sm text-slate-500">{format(new Date(lease.startDate), "MMM dd, yyyy")}</TableCell>
                             <TableCell className="text-sm text-slate-500">{lease.endDate ? format(new Date(lease.endDate), "MMM dd, yyyy") : "Ongoing"}</TableCell>
                             <TableCell className="font-bold text-slate-900">KES {lease.monthlyRent.toLocaleString()}</TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-6">
           <div className="grid md:grid-cols-3 gap-6">
              <Card>
                 <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-500 uppercase">Open Tickets</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="text-3xl font-black text-slate-900">{maintenance.openTickets}</div>
                    {maintenance.emergencyTickets > 0 && (
                       <Badge variant="destructive" className="mt-2 animate-pulse">{maintenance.emergencyTickets} Emergency</Badge>
                    )}
                 </CardContent>
              </Card>
              <Card>
                 <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-500 uppercase">Maint. Costs (Total)</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="text-3xl font-black text-slate-900">KES {maintenance.maintenanceCosts.toLocaleString()}</div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Lifecycle total for property</p>
                 </CardContent>
              </Card>
              <Card>
                 <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-bold text-slate-500 uppercase">Vendors Used</CardTitle>
                 </CardHeader>
                 <CardContent>
                    <div className="text-3xl font-black text-slate-900">{maintenance.vendorCount}</div>
                    <p className="text-xs text-slate-500 font-medium mt-1">Qualified service providers</p>
                 </CardContent>
              </Card>
           </div>

           <Card className="bg-slate-50/50 border-dashed">
              <CardContent className="py-12 flex flex-col items-center text-center">
                 <WrenchIcon className="h-12 w-12 text-slate-300 mb-4" />
                 <h3 className="text-lg font-bold text-slate-900">Detailed Maintenance History</h3>
                 <p className="text-slate-500 max-w-sm mt-2 font-medium">
                    This view provides high-level maintenance insights. For specific ticket details, please contact your property manager.
                 </p>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="documents">
           <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                 <div>
                    <CardTitle className="text-xl font-bold">Property Documents</CardTitle>
                    <CardDescription>Owner statements, insurance, and compliance certificates.</CardDescription>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-slate-50">
                       <TableRow>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest pl-6">Document Name</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest">Category</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest">Date Uploaded</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest">Size</TableHead>
                          <TableHead className="font-black text-[10px] uppercase tracking-widest text-right pr-6">Action</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {documents.map((doc) => (
                          <TableRow key={doc.id}>
                             <TableCell className="pl-6">
                                <div className="flex items-center gap-3">
                                   <div className="bg-blue-50 p-2 rounded-lg"><FileTextIcon className="h-4 w-4 text-blue-600" /></div>
                                   <span className="font-bold text-slate-900">{doc.name}</span>
                                </div>
                             </TableCell>
                             <TableCell>
                                <Badge variant="secondary" className="font-bold">{doc.category.replace("_", " ")}</Badge>
                             </TableCell>
                             <TableCell className="text-sm text-slate-500">{format(new Date(doc.createdAt), "MMM dd, yyyy")}</TableCell>
                             <TableCell className="text-sm text-slate-500">{(doc.fileSize / 1024 / 1024).toFixed(2)} MB</TableCell>
                             <TableCell className="text-right pr-6">
                                <Button variant="ghost" size="sm" className="font-bold text-blue-600 flex items-center gap-2 ml-auto">
                                   <DownloadIcon className="h-4 w-4" /> Download
                                </Button>
                             </TableCell>
                          </TableRow>
                       ))}
                       {documents.length === 0 && (
                          <TableRow>
                             <TableCell colSpan={5} className="py-12 text-center text-slate-500 font-medium">
                                No documents available for this property.
                             </TableCell>
                          </TableRow>
                       )}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
