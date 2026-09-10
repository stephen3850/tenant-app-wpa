"use client";

import React, { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface TenantContextType {
  organizationId: string | null;
  organizationStatus: string | null;
  roles: string[];
  permissions: string[];
  isLoading: boolean;
}

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  const value = {
    organizationId: (session?.user as any)?.organizationId || null,
    organizationStatus: (session?.user as any)?.organizationStatus || null,
    roles: (session?.user as any)?.roles || [],
    permissions: (session?.user as any)?.permissions || [],
    isLoading: status === "loading",
  };

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error("useTenant must be used within a TenantProvider");
  }
  return context;
}
