import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Landmark, Plus, Trash2, ExternalLink } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function CollectionAccountsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  // In a real app, fetch these from DB
  const accounts = [
    { id: "1", name: "Main Paybill", type: "MPESA_PAYBILL", identifier: "522522", description: "Default rent collection", isDefault: true },
    { id: "2", name: "Security Deposit Account", type: "BANK_ACCOUNT", identifier: "0110....321", description: "KCB Bank", isDefault: false },
  ];

  return (
    <div className="p-4 lg:p-5 space-y-4 bg-[#F8F9FB] min-h-screen">
      {/* Header Card */}
      <div className="bg-white p-4 lg:p-5 rounded-xl border border-[#E2E8F0] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-[#64748B] uppercase tracking-widest">API INTEGRATIONS</p>
          <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Collection Accounts</h1>
          <p className="text-[11px] font-medium text-[#64748B]">Manage bank accounts and mobile money paybills used for automated reconciliation.</p>
        </div>
        <Button className="h-9 bg-[#3B82F6] hover:bg-[#2563EB] text-white font-bold text-[12px] rounded-lg shadow-sm px-6 gap-2">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-5">
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-wider h-10">Account Name</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-wider h-10">Type</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-wider h-10">Identifier</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-wider h-10">Status</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-wider h-10 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accounts.map((account) => (
                <TableRow key={account.id} className="hover:bg-slate-50/30">
                  <TableCell className="py-3">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-[#1E293B]">{account.name}</span>
                      <span className="text-[10px] text-[#64748B]">{account.description}</span>
                    </div>
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-tight">
                      {account.type.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 font-mono text-[11px] font-bold">{account.identifier}</TableCell>
                  <TableCell className="py-3">
                    {account.isDefault ? (
                      <Badge className="bg-[#DCFCE7] text-[#166534] border-none text-[9px] font-bold px-2 py-0.5 rounded-full">
                        Business Default
                      </Badge>
                    ) : (
                      <span className="text-[10px] text-[#64748B] font-medium">Secondary</span>
                    )}
                  </TableCell>
                  <TableCell className="py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-[#64748B] hover:text-[#1E293B]">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-rose-500 hover:bg-rose-50">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
