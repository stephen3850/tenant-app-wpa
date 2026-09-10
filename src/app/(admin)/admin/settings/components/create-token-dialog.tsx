"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { createSuperAdminApiToken } from "@/features/admin-profile/actions/admin-profile-actions";
import { toast } from "sonner";
import { Plus, Key, Copy, Check, AlertCircle } from "lucide-react";

export function CreateTokenDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [name, setName] = useState("");
  const [selectedScopes, setSelectedScopes] = useState<string[]>(["read:all"]);

  const scopes = [
    { id: "read:all", label: "Read Platform Data" },
    { id: "write:billing", label: "Manage Billing" },
    { id: "write:users", label: "Manage Users" },
    { id: "write:incidents", label: "Manage Incidents" },
  ];

  const handleCreate = async () => {
    if (!name) {
      toast.error("Please provide a token name");
      return;
    }
    setLoading(true);
    try {
      const result = await createSuperAdminApiToken(name, selectedScopes);
      setNewToken(result.secret);
      toast.success("Token created successfully");
    } catch (error) {
      toast.error("Failed to create token");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (newToken) {
      navigator.clipboard.writeText(newToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("Token copied to clipboard");
    }
  };

  const reset = () => {
    setOpen(false);
    setNewToken(null);
    setName("");
    setSelectedScopes(["read:all"]);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-slate-900 font-black">
          <Plus className="mr-2 h-4 w-4" />
          Create Token
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] border-4 border-slate-900 rounded-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black">Generate API Token</DialogTitle>
          <DialogDescription className="font-medium text-slate-500">Create a secure personal access token for the platform API.</DialogDescription>
        </DialogHeader>

        {!newToken ? (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label className="font-bold">Token Name</Label>
              <Input
                placeholder="e.g. CI/CD Script, Backup Service"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 font-medium"
              />
            </div>

            <div className="space-y-3">
              <Label className="font-bold">Select Scopes</Label>
              <div className="grid grid-cols-2 gap-4">
                {scopes.map((scope) => (
                  <div key={scope.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={scope.id}
                      checked={selectedScopes.includes(scope.id)}
                      onCheckedChange={(checked) => {
                        if (checked) setSelectedScopes([...selectedScopes, scope.id]);
                        else setSelectedScopes(selectedScopes.filter(s => s !== scope.id));
                      }}
                    />
                    <Label htmlFor={scope.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {scope.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <div className="bg-rose-50 border-2 border-rose-100 p-4 rounded-2xl flex gap-3 text-rose-700">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p className="text-xs font-bold">Make sure to copy your personal access token now. You won't be able to see it again!</p>
            </div>

            <div className="relative">
              <Input
                readOnly
                value={newToken}
                className="bg-slate-50 font-mono text-sm border-2 pr-12 h-12 rounded-xl"
              />
              <Button
                size="icon"
                variant="ghost"
                className="absolute right-2 top-2 h-8 w-8"
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        <DialogFooter>
          {!newToken ? (
            <Button className="w-full bg-slate-900 font-black h-11" onClick={handleCreate} disabled={loading}>
              {loading ? "Generating..." : "Generate Token"}
            </Button>
          ) : (
            <Button className="w-full bg-slate-900 font-black h-11" onClick={reset}>
              I've copied the token
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
