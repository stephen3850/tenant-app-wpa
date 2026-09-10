"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, ArrowLeft, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 text-center animate-in fade-in duration-700">
      <div className="mb-8 relative">
        <div className="absolute inset-0 bg-[#56A600]/10 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative bg-white p-6 rounded-3xl shadow-xl ring-1 ring-[#56A600]/10">
          <Rocket className="h-16 w-16 text-[#56A600]" />
        </div>
      </div>

      <h2 className="text-3xl font-black tracking-tight text-[#1F2937] mb-3">
        {title} Coming Soon
      </h2>

      <p className="text-sm font-medium text-[#667085] max-w-md mb-10 leading-relaxed">
        {description || "This workspace is currently being finalized. Your existing data and permissions remain intact while we prepare this module for production."}
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Button asChild className="bg-[#56A600] hover:bg-[#4a8e00] text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-[#56A600]/20 transition-all hover:scale-105 active:scale-95">
          <Link href="/dashboard">
            Return to Dashboard
          </Link>
        </Button>
        <Button variant="ghost" asChild className="font-bold text-[#667085] hover:text-[#1F2937] h-11 px-8 rounded-xl transition-all">
          <button onClick={() => window.history.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </button>
        </Button>
      </div>

      <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 opacity-40">
        <div className="h-1 bg-[#DCE3EA] rounded-full" />
        <div className="h-1 bg-[#DCE3EA] rounded-full" />
        <div className="h-1 bg-[#DCE3EA] rounded-full" />
        <div className="h-1 bg-[#DCE3EA] rounded-full" />
      </div>
    </div>
  );
}
