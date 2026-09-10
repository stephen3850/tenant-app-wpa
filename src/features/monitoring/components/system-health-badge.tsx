"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Activity } from "lucide-react";

export function SystemHealthBadge() {
  const [status, setStatus] = useState<"healthy" | "degraded" | "loading">("loading");

  useEffect(() => {
    fetch("/api/health")
      .then((res) => (res.ok ? setStatus("healthy") : setStatus("degraded")))
      .catch(() => setStatus("degraded"));
  }, []);

  if (status === "loading") return null;

  return (
    <Badge variant={status === "healthy" ? "outline" : "destructive"} className="flex items-center gap-1.5 px-2 py-1">
      <Activity className={`h-3 w-3 ${status === "healthy" ? "text-emerald-500" : "text-white animate-pulse"}`} />
      <span className="text-[10px] uppercase font-bold tracking-wider">
        System {status}
      </span>
    </Badge>
  );
}
