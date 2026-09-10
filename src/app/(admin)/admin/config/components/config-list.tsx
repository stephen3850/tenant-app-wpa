"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Save, RefreshCw } from "lucide-react";
import { updateConfiguration } from "@/features/features/actions/config-actions";
import { toast } from "sonner";
import { useState } from "react";

export function ConfigList({ configs }: { configs: any[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    configs.reduce((acc, c) => ({ ...acc, [c.key]: JSON.stringify(c.value, null, 2) }), {})
  );
  const [loading, setLoading] = useState<string | null>(null);

  const handleSave = async (key: string, category: any) => {
    setLoading(key);
    try {
      const parsedValue = JSON.parse(values[key]);
      await updateConfiguration(key, parsedValue, category);
      toast.success(`${key} updated successfully`);
    } catch (error) {
      toast.error("Invalid JSON or server error");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {configs.length === 0 && (
        <Card className="col-span-full border-2 border-dashed p-12 text-center text-slate-500 font-medium">
          No configurations found in this category.
        </Card>
      )}
      {configs.map((config) => (
        <Card key={config.id} className="border-2 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <CardTitle className="text-lg font-black text-slate-900 flex items-center gap-2">
                  {config.key}
                  {config.isSensitive && <Shield className="h-4 w-4 text-rose-500" />}
                </CardTitle>
                <CardDescription className="font-medium">{config.description}</CardDescription>
              </div>
              {config.isSensitive && (
                <Badge variant="destructive" className="font-bold text-[10px]">SENSITIVE</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative group">
              <textarea
                className="w-full h-32 p-3 font-mono text-sm bg-slate-50 border-2 border-slate-100 rounded-xl focus:border-slate-900 focus:outline-none transition-all"
                value={values[config.key]}
                onChange={(e) => setValues({ ...values, [config.key]: e.target.value })}
              />
              <Button
                size="sm"
                className="absolute right-3 bottom-3 font-bold bg-slate-900"
                onClick={() => handleSave(config.key, config.category)}
                disabled={loading === config.key}
              >
                {loading === config.key ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
