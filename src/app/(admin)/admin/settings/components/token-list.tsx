"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { revokeSuperAdminApiToken } from "@/features/admin-profile/actions/admin-profile-actions";
import { toast } from "sonner";
import { Trash2, RefreshCw, Clock, Shield } from "lucide-react";
import { formatDate } from "@/lib/utils";

export function TokenList({ tokens }: { tokens: any[] }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleRevoke = async (id: string) => {
    if (!confirm("Are you sure you want to revoke this token? Any applications using it will lose access.")) return;
    setLoading(id);
    try {
      await revokeSuperAdminApiToken(id);
      toast.success("Token revoked successfully");
    } catch (error) {
      toast.error("Failed to revoke token");
    } finally {
      setLoading(null);
    }
  };

  return (
    <Table>
      <TableHeader className="bg-slate-50">
        <TableRow>
          <TableHead className="font-black text-slate-900 uppercase text-xs pl-6">Token Name</TableHead>
          <TableHead className="font-black text-slate-900 uppercase text-xs">Scopes</TableHead>
          <TableHead className="font-black text-slate-900 uppercase text-xs">Last Used</TableHead>
          <TableHead className="font-black text-slate-900 uppercase text-xs text-right pr-6">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tokens.length === 0 && (
          <TableRow>
            <TableCell colSpan={4} className="h-32 text-center">
              <div className="flex flex-col items-center gap-2 text-slate-500">
                <Shield className="h-8 w-8 text-slate-200" />
                <p className="font-medium italic">No personal API tokens created yet.</p>
              </div>
            </TableCell>
          </TableRow>
        )}
        {tokens.map((token) => (
          <TableRow key={token.id} className="hover:bg-slate-50/50">
            <TableCell className="pl-6 font-black text-slate-900">{token.name}</TableCell>
            <TableCell>
              <div className="flex flex-wrap gap-1">
                {token.scopes.map((scope: string) => (
                  <Badge key={scope} variant="outline" className="font-bold text-[10px] uppercase border-slate-200">
                    {scope}
                  </Badge>
                ))}
              </div>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                <Clock className="h-4 w-4" />
                {token.lastUsedAt ? formatDate(token.lastUsedAt) : "Never used"}
              </div>
            </TableCell>
            <TableCell className="text-right pr-6">
              <Button
                variant="ghost"
                size="icon"
                className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-full"
                onClick={() => handleRevoke(token.id)}
                disabled={loading === token.id}
              >
                {loading === token.id ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
