"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DownloadIcon, FileBarChartIcon, HomeIcon, SettingsIcon, Loader2Icon } from "lucide-react";
import { downloadOwnerStatement } from "@/actions/landlord-dashboard";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export function LandlordWelcome({ name }: { name: string }) {
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadOwnerStatement();
      toast({
        title: "Statement Generated",
        description: "Your owner statement has been generated and is ready for download.",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to generate statement. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 py-6 border-b border-slate-100">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
           Welcome back, {name}
        </h1>
        <div className="flex items-center gap-3 mt-2">
           <Badge variant="outline" className="bg-slate-900 text-white border-slate-800 font-bold uppercase tracking-widest text-[10px] px-3">
              Executive Portfolio
           </Badge>
           <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">
              Last Portfolio Update: {new Date().toLocaleDateString()}
           </span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
         <Button variant="outline" size="sm" className="font-bold gap-2">
            <FileBarChartIcon className="h-4 w-4" /> Financial Reports
         </Button>
         <Button
          variant="outline"
          size="sm"
          className="font-bold gap-2"
          onClick={handleDownload}
          disabled={downloading}
         >
            {downloading ? <Loader2Icon className="h-4 w-4 animate-spin" /> : <DownloadIcon className="h-4 w-4" />}
            Download Owner Statement
         </Button>
         <Button className="bg-blue-600 hover:bg-blue-700 font-bold gap-2">
            <SettingsIcon className="h-4 w-4" /> Account Settings
         </Button>
      </div>
    </div>
  );
}
