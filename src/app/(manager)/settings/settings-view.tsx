"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Settings,
  Bell,
  X,
  Shield,
  FileText,
  Printer,
  PenTool,
  Layout,
  Lock,
  List,
  Tag,
  Users,
  UserCog,
  CreditCard
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { RoleTemplatesView } from "./role-templates-view";
import { RolesPermissionsView } from "./roles-permissions-view";
import { ExpenseCategoriesView } from "./expense-categories-view";
import { CollectionAccountsView } from "./collection-accounts-view";
import { ServicesView } from "./services-view";
import { SecurityLoginView } from "./security-login-view";
import { CollectionsView } from "./collections-view";
import { StatementsView } from "./statements-view";
import { LeaseTemplateView } from "./lease-template-view";
import { PrintPdfView } from "./print-pdf-view";
import { MonthlyInvoicesView } from "./monthly-invoices-view";
import { DepositSetupView } from "./deposit-setup-view";
import { BusinessProfileView } from "./business-profile-view";

interface SettingsViewProps {
  subscription: any;
  organization: any;
}

export function SettingsView({ subscription, organization }: SettingsViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab") || "general";
  const [activeTab, setActiveTab] = useState(initialTab);

  const navItems = [
    { id: "general", label: "Business profile", icon: Building2 },
    { id: "deposits", label: "Deposits", icon: Shield },
    { id: "invoices", label: "Invoices", icon: FileText },
    { id: "print", label: "Print & PDF", icon: Printer },
    { id: "lease", label: "Lease agreement", icon: PenTool },
    { id: "statements", label: "Statements", icon: Layout },
    { id: "collections", label: "Collections", icon: Bell },
    { id: "security", label: "Security and login", icon: Lock },
    { id: "services", label: "Services", icon: List },
    { id: "accounts", label: "Collection Accounts", icon: CreditCard },
    { id: "expenses", label: "Expense Categories", icon: Tag },
    { id: "roles", label: "Role & Permissions", icon: Users },
    { id: "templates", label: "Role Templates", icon: UserCog },
  ];

  return (
    <div className="flex h-[calc(100vh-2rem)] bg-white rounded-xl overflow-hidden shadow-sm m-4 border border-slate-100">
      {/* Sidebar */}
      <aside className="w-56 bg-[#F8FAFC] border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-3">
          <button onClick={() => router.back()} className="hover:bg-slate-200 p-1 rounded-md transition-colors">
            <X className="h-3 w-3 text-slate-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-1 space-y-0.5 custom-scrollbar">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] transition-all duration-150",
                activeTab === item.id
                  ? "bg-[#EDF2F7] text-[#1A202C] font-bold shadow-sm"
                  : "text-slate-600 hover:bg-slate-100/80 font-medium"
              )}
            >
              <item.icon className={cn("h-3.5 w-3.5", activeTab === item.id ? "text-slate-900" : "text-slate-500")} />
              {item.label}
            </button>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-white flex flex-col">
        {(activeTab !== "collections" && activeTab !== "statements" && activeTab !== "lease" && activeTab !== "print" && activeTab !== "invoices" && activeTab !== "deposits") && (
          <header className="px-6 py-4 flex items-start justify-between border-b border-slate-50">
            <div className="space-y-0">
              <h1 className="text-lg font-bold text-slate-800 tracking-tight leading-tight">Settings</h1>
              <p className="text-[11px] text-slate-500 font-medium tracking-tight">Manage system configurations.</p>
            </div>
            <Button
              onClick={() => setActiveTab("general")}
              className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-4 h-9 rounded-lg gap-2 font-bold text-[11px] shadow-md transition-all active:scale-95"
            >
                <Building2 className="h-4 w-4" />
                Business profile
            </Button>
          </header>
        )}

        <div className={cn("pb-20 max-w-4xl space-y-6", (activeTab === "collections" || activeTab === "statements" || activeTab === "lease" || activeTab === "print" || activeTab === "invoices" || activeTab === "deposits") ? "p-10" : "p-6")}>
          {activeTab === "general" && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <BusinessProfileView organization={organization} />

              <Card className="border-slate-100 shadow-none bg-[#FFFFFF] rounded-xl p-6 border">
                <div className="space-y-0.5 mb-6 text-left">
                  <h3 className="text-[15px] font-bold text-slate-800 tracking-tight leading-none">Subscription Plan</h3>
                  <p className="text-[11px] text-slate-500 font-medium tracking-tight">Your current plan and subscription status.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                    <div className="space-y-1.5">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">SELECTED PLAN</p>
                        <p className="text-[14px] font-bold text-slate-700">{subscription?.plan?.name || "Not selected"}</p>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">BILLED AT</p>
                        <div className="space-y-0.5">
                            <p className="text-[14px] font-bold text-slate-700">Starter Plan</p>
                            <p className="text-[11px] text-slate-500 font-medium leading-none">KES 5,000 / month</p>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">STATUS</p>
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-2 rounded-full bg-slate-300" />
                            <p className="text-[14px] font-bold text-slate-700">Inactive</p>
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest leading-none">VALID UNTIL</p>
                        <p className="text-[14px] font-bold text-slate-700">-</p>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    <Button variant="outline" className="border-slate-200 text-slate-700 px-6 rounded-lg font-bold text-[11px] h-9">Change plan</Button>
                    <Button variant="outline" className="border-slate-200 text-slate-700 px-6 rounded-lg font-bold text-[11px] h-9">View billing invoices</Button>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ModuleCard title="Services" desc="Update available service types." action="Manage Services" onClick={() => setActiveTab("services")} />
                  <ModuleCard title="Role & Permissions" desc="Rename role labels and manage role capability access." action="Manage Role Access" onClick={() => setActiveTab("roles")} />
                  <ModuleCard title="Role Templates" desc="Create reusable staff permission templates for business users." action="Manage Role Templates" onClick={() => setActiveTab("templates")} />
                  <ModuleCard title="Collection Accounts" desc="Manage global and property-specific paybills, tills, banks, and payment accounts." action="Manage Accounts" onClick={() => setActiveTab("accounts")} />
                  <ModuleCard title="Expense Categories" desc="Customize reusable expense categories for forms, bulk entry, and imports." action="Manage Categories" onClick={() => setActiveTab("expenses")} />
                  <ModuleCard title="Deposit Invoice Setup" desc="Create separate deposit invoices when leases are added." action="Open Setup" onClick={() => setActiveTab("deposits")} />
              </div>
            </div>
          )}

          {activeTab === "roles" && (
            <div className="animate-in fade-in duration-300">
              <RolesPermissionsView onBack={() => setActiveTab("general")} onOpenTemplates={() => setActiveTab("templates")} />
            </div>
          )}

          {activeTab === "templates" && (
            <div className="animate-in fade-in duration-300">
              <RoleTemplatesView />
            </div>
          )}

          {activeTab === "expenses" && (
            <div className="animate-in fade-in duration-300">
              <ExpenseCategoriesView onBack={() => setActiveTab("general")} />
            </div>
          )}

          {activeTab === "accounts" && (
            <div className="animate-in fade-in duration-300">
              <CollectionAccountsView onBack={() => setActiveTab("general")} />
            </div>
          )}

          {activeTab === "services" && (
            <div className="animate-in fade-in duration-300">
              <ServicesView onBack={() => setActiveTab("general")} />
            </div>
          )}

          {activeTab === "invoices" && (
            <div className="animate-in fade-in duration-300">
                <MonthlyInvoicesView onOpenProfile={() => setActiveTab("general")} />
            </div>
          )}

          {activeTab === "deposits" && (
            <div className="animate-in fade-in duration-300">
                <DepositSetupView onOpenProfile={() => setActiveTab("general")} />
            </div>
          )}

          {activeTab === "print" && (
            <div className="animate-in fade-in duration-300">
              <PrintPdfView onOpenProfile={() => setActiveTab("general")} />
            </div>
          )}

          {activeTab === "lease" && (
            <div className="animate-in fade-in duration-300">
              <LeaseTemplateView onOpenProfile={() => setActiveTab("general")} />
            </div>
          )}

          {activeTab === "statements" && (
            <div className="animate-in fade-in duration-300">
              <StatementsView onOpenProfile={() => setActiveTab("general")} />
            </div>
          )}

          {activeTab === "security" && (
            <div className="animate-in fade-in duration-300">
              <SecurityLoginView />
            </div>
          )}

          {activeTab === "collections" && (
            <div className="animate-in fade-in duration-300">
              <CollectionsView onOpenProfile={() => setActiveTab("general")} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function ModuleCard({ title, desc, action, onClick }: any) {
    return (
        <Card className="bg-white border-slate-100 shadow-none rounded-lg p-5 flex flex-col justify-between min-h-[140px] border">
            <div className="space-y-1">
                <h4 className="text-[12px] font-bold text-slate-800 tracking-tight leading-none">{title}</h4>
                <p className="text-[10px] text-slate-500 font-medium leading-relaxed line-clamp-2">{desc}</p>
            </div>
            <div className="mt-3">
                <Button
                    className="bg-[#2D3748] hover:bg-[#1A202C] text-white font-bold h-7 px-3.5 rounded-md text-[9px]"
                    onClick={onClick}
                >
                    {action}
                </Button>
            </div>
        </Card>
    )
}
