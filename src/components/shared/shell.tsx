"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getDashboardDataAction } from "@/features/workspace/actions/workspace-actions";
import { useTenant } from "@/providers/tenant-provider";
import {
  Building2,
  LayoutDashboard,
  Users,
  Home,
  FileText,
  Wallet,
  BarChart3,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  Zap,
  CreditCard,
  Mail,
  TrendingDown,
  Briefcase,
  ShieldCheck,
  Ticket,
  FolderOpen,
  Archive,
  ClipboardList,
  UserCog,
  LifeBuoy,
  Lock,
  Receipt,
  ChevronDown,
  ChevronRight,
  Plus,
  PanelLeftClose,
  PanelLeft,
  AlertTriangle,
  MessageSquare,
  Calculator,
  Code2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { UserNav } from "./user-nav";
import { Footer } from "./footer";
import { Button } from "@/components/ui/button";

interface ShellProps {
  children: React.ReactNode;
  user: any;
  organizationStatus?: string;
}

export function Shell({ children, user, organizationStatus }: ShellProps) {
  const pathname = usePathname();
  const { organizationId } = useTenant();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);
  const [stats, setStats] = React.useState<any>(null);

  const isSuspended = organizationStatus === "SUSPENDED";

  // When suspended, only specific items are active
  const allowedInSuspension = ["Billing Invoices", "Support Documents", "Settings"];

  const [expandedGroups, setExpandedGroups] = React.useState<string[]>([
    "OVERVIEW", "TEAM", "PORTFOLIO", "FINANCE", "OPERATIONS", "RECORDS", "API INTEGRATIONS", "SYSTEM"
  ]);

  React.useEffect(() => {
    async function loadStats() {
      if (organizationId) {
        try {
          const data = await getDashboardDataAction();
          setStats(data);
        } catch (error) {
          console.error("Failed to load sidebar stats:", error);
        }
      }
    }
    loadStats();

    // Listen for custom data change events to refresh stats immediately
    window.addEventListener("refresh-sidebar-stats", loadStats);
    return () => window.removeEventListener("refresh-sidebar-stats", loadStats);
  }, [organizationId, pathname]); // Refresh stats when organization or page changes

  const toggleGroup = (label: string) => {
    setExpandedGroups(prev =>
      prev.includes(label)
        ? prev.filter(g => g !== label)
        : [...prev, label]
    );
  };

  const isSetupIncomplete = (stats?.progress?.percentage || 0) < 100;

  const navGroups = [
    {
      label: "OVERVIEW",
      items: [
        { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        ...(isSetupIncomplete ? [{ name: "Setup Status", href: "/onboarding/setup", icon: ClipboardList }] : []),
        { name: "Reports", href: "/reports", icon: BarChart3 },
      ],
    },
    {
      label: "PORTFOLIO",
      items: [
        { name: "Properties", href: "/properties", icon: Building2, count: stats?.stats?.propertyCount },
        { name: "Units", href: "/units", icon: Home, count: stats?.stats?.unitCount },
        { name: "Tenants", href: "/tenants", icon: Users, count: stats?.stats?.tenantCount },
        { name: "Landlords", href: "/landlords", icon: Briefcase, count: stats?.stats?.landlordCount },
        { name: "Leases", href: "/leases", icon: FileText, count: stats?.stats?.leaseCount },
      ],
    },
    {
      label: "FINANCE",
      items: [
        { name: "Invoices", href: "/invoices", icon: FileText },
        { name: "Collections", href: "/collections", icon: Wallet },
        { name: "Payments", href: "/payments", icon: CreditCard },
        { name: "Finance", href: "/finance", icon: Calculator },
        { name: "Utility & Readings", href: "/dashboard/utilities/readings", icon: Zap },
        { name: "Expenses", href: "/expenses", icon: TrendingDown },
      ],
    },
    {
      label: "TEAM",
      items: [
        { name: "Field Officers", href: "/field-officers", icon: Users },
      ],
    },
    {
      label: "OPERATIONS",
      items: [
        { name: "Tickets", href: "/tickets", icon: Ticket, count: stats?.openMaintenanceRequests },
        { name: "Security Logbook", href: "/security", icon: ShieldCheck },
        { name: "Communications", href: "/communications", icon: Mail },
        { name: "Cases", href: "/cases", icon: Briefcase },
        { name: "Tasks", href: "/tasks", icon: ClipboardList },
      ],
    },
    {
      label: "RECORDS",
      items: [
        { name: "Documents", href: "/documents", icon: FolderOpen },
        { name: "Archive", href: "/archive", icon: Archive },
        { name: "Audit Logs", href: "/logbook", icon: ShieldCheck },
      ],
    },
    {
      label: "API INTEGRATIONS",
      items: [
        { name: "Communication APIs", href: "/api-integrations/communications", icon: Code2 },
        { name: "Payment Method APIs", href: "/api-integrations/payments", icon: CreditCard },
        { name: "Collection Accounts", href: "/api-integrations/collections", icon: Wallet },
      ],
    },
    {
      label: "SYSTEM",
      items: [
        { name: "Users", href: "/users", icon: UserCog },
        { name: "Roles & Access", href: "/roles", icon: Lock },
        { name: "Billing Invoices", href: "/billing", icon: Receipt },
        { name: "Support Documents", href: "/support/documents", icon: LifeBuoy },
        { name: "Notifications", href: "/notifications", icon: Bell },
        { name: "Settings", href: "/settings", icon: Settings },
      ],
    },
  ];


  return (
    <div className="flex min-h-screen bg-[#F5F7FA]">
      {/* Sidebar - Desktop */}
      <aside className={cn(
        "hidden flex-col border-r bg-white transition-all duration-300 lg:flex h-screen sticky top-0 shrink-0 print:hidden",
        isCollapsed ? "w-20" : "w-64"
      )}>
          <div className="flex h-16 items-center justify-between border-b px-6 shrink-0">
            <Link href="/dashboard" className="flex items-center gap-2" onClick={() => setIsCollapsed(false)}>
              {!isCollapsed && (
                <div className="flex items-center gap-3">
                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#56A600] shadow-lg shadow-[#56A600]/20">
                      <Home className="h-5 w-5 text-white" />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-sm font-black tracking-[0.1em] text-[#1F2937]">TMS</span>
                      <span className="text-[8px] font-bold tracking-[0.05em] text-[#98A2B3] uppercase">Property Management System</span>
                   </div>
                </div>
              )}
              {isCollapsed && (
                <div className="h-10 w-10 rounded-xl bg-[#56A600] flex items-center justify-center text-white mx-auto shadow-lg shadow-[#56A600]/20">
                   <Home className="h-6 w-6" />
                </div>
              )}
            </Link>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCollapsed(true)}
                className="h-8 w-8"
              >
                <Menu className="h-5 w-5 text-[#667085]" />
              </Button>
            )}
          </div>

        <div className="flex-1 overflow-y-auto py-4">
          {navGroups.map((group) => (
            <div key={group.label} className="mb-4">
              {!isCollapsed && (
                <button
                  onClick={() => toggleGroup(group.label)}
                  className="flex w-full items-center justify-between px-6 py-2 text-small-label text-[#98A2B3] hover:text-[#1F2937]"
                >
                  {group.label}
                  {expandedGroups.includes(group.label) ? (
                    <ChevronDown className="h-3 w-3" />
                  ) : (
                    <ChevronRight className="h-3 w-3" />
                  )}
                </button>
              )}
              {(expandedGroups.includes(group.label) || isCollapsed) && (
                <nav className={cn("space-y-1 px-3", !isCollapsed && "mt-1")}>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                    const isDisabled = isSuspended && !allowedInSuspension.includes(item.name);

                    return (
                      <Link
                        key={item.name}
                        href={isDisabled ? "#" : item.href}
                        onClick={(e) => {
                           if (isDisabled) e.preventDefault();
                        }}
                        className={cn(
                          "group flex items-center rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-all",
                          isActive
                            ? "bg-[#F0FDF4] text-[#12B76A] ring-1 ring-[#12B76A]/10 shadow-sm"
                            : "text-[#667085] hover:bg-[#F9FAFB] hover:text-[#1F2937]",
                          isCollapsed && "justify-center px-2",
                          isDisabled && "opacity-50 cursor-not-allowed grayscale"
                        )}
                      >
                        <item.icon className={cn(
                          "h-3.5 w-3.5 flex-shrink-0 transition-colors",
                          isActive ? "text-[#12B76A]" : "text-[#98A2B3] group-hover:text-[#1F2937]",
                          !isCollapsed && "mr-2.5"
                        )} />
                        {!isCollapsed && (
                          <div className="flex flex-1 items-center justify-between">
                            <span>{item.name}</span>
                            {(item as any).count !== undefined && (item as any).count >= 0 && (
                              <span className={cn(
                                "ml-2 flex h-4 w-4 items-center justify-center rounded-full text-[8px] font-bold transition-colors",
                                isActive ? "bg-[#12B76A]/20 text-[#12B76A]" : "bg-[#F0FDF4] text-[#12B76A]"
                              )}>
                                {(item as any).count}
                              </span>
                            )}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </nav>
              )}
            </div>
          ))}
        </div>

        <div className="border-t p-4 shrink-0">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start text-muted-foreground hover:text-foreground hover:bg-[#F9FAFB] rounded-xl",
              isCollapsed && "justify-center px-0"
            )}
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <PanelLeft className="h-5 w-5" />
            ) : (
              <>
                <PanelLeftClose className="mr-3 h-5 w-5" />
                <span className="font-bold text-xs">Collapsed View</span>
              </>
            )}
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex h-16 items-center justify-between border-b bg-white px-4 lg:px-8 print:hidden">
          <div className="flex items-center lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <div className="ml-4 flex items-center gap-2.5">
               <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#56A600] shadow-md">
                  <Home className="h-4 w-4 text-white" />
               </div>
               <span className="text-base font-black tracking-tight text-[#1F2937]">TMS</span>
            </div>
          </div>

          <div className="hidden flex-1 items-center lg:flex">
             <div className="flex w-full max-w-2xl items-center gap-0">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Search tenant or unit"
                    className="h-10 w-full rounded-l-md border border-[#DCE3EA] bg-white pl-3 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#56A600]/20"
                  />
                </div>
                <Button className="h-10 rounded-l-none rounded-r-md bg-[#56A600] hover:bg-[#4a8e00] px-4">
                  <Search className="h-4 w-4 text-white" />
                </Button>
             </div>
          </div>

          <div className="flex items-center gap-3">
            <Button className="hidden h-10 items-center gap-1.5 rounded-lg bg-[#12B76A] text-white hover:bg-[#0E9355] px-4 text-sm font-bold md:flex shadow-sm transition-all">
              <Plus className="h-4 w-4" />
              <span>Create new</span>
            </Button>

            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative h-9 w-9 text-[#667085]">
                <Bell className="h-5 w-5" />
                {stats?.stats?.unreadNotifications > 0 && (
                  <span className="absolute right-2 top-2 h-3.5 w-3.5 rounded-full bg-[#DC2626] border-2 border-white flex items-center justify-center text-[9px] text-white font-bold">
                    {stats.stats.unreadNotifications}
                  </span>
                )}
              </Button>
            </Link>

            <div className="ml-1">
              <UserNav user={user} />
            </div>
          </div>
        </header>

        {/* Tab Navigation & Breadcrumb */}
        <div className="flex h-12 items-center justify-between border-b bg-white px-4 lg:px-8 print:hidden">
          <div className="flex h-full items-center overflow-x-auto no-scrollbar">
            {(navGroups.find(group =>
              group.items.some(item => pathname === item.href || pathname.startsWith(item.href + "/"))
            ) || navGroups[0]).items.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex h-full items-center gap-1.5 border-b-2 px-4 text-[11px] font-bold transition-all whitespace-nowrap",
                    isActive
                      ? "border-[#56A600] text-[#1F2937]"
                      : "border-transparent text-[#667085] hover:text-[#1F2937]"
                  )}
                >
                  <item.icon className={cn("h-3.5 w-3.5", isActive ? "text-[#56A600]" : "text-[#667085]")} />
                  {item.name}
                </Link>
              );
            })}
          </div>
          <div className="hidden items-center gap-1 text-[10px] font-medium text-[#667085] md:flex uppercase tracking-wider shrink-0 ml-4">
            <span>Portal</span>
            <ChevronRight className="h-2.5 w-2.5" />
            <span className="font-bold text-[#1F2937]">
              {pathname === "/dashboard" ? "Dashboard" :
               pathname.split("/")[1].charAt(0).toUpperCase() + pathname.split("/")[1].slice(1)}
            </span>
          </div>
        </div>

        {/* Status Banners */}
        {organizationStatus === "PAYMENT_DUE" && (
           <div className="bg-amber-50 border-b border-amber-200 px-8 py-2 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-amber-800 text-xs font-bold uppercase tracking-tight">
                 <AlertTriangle className="h-4 w-4" />
                 <span>Payment Due: Please settle your outstanding balance to maintain full service.</span>
              </div>
              <Link href="/billing" className="text-amber-900 text-xs font-bold underline">Pay Now</Link>
           </div>
        )}
        {isSuspended && (
           <div className="bg-rose-50 border-b border-rose-200 px-8 py-2 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center gap-2 text-rose-800 text-xs font-bold uppercase tracking-tight">
                 <AlertTriangle className="h-4 w-4" />
                 <span>Account Suspended: Access to operational modules is restricted.</span>
              </div>
              <Link href="/support" className="text-rose-900 text-xs font-bold underline">Contact Support</Link>
           </div>
        )}

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#F5F7FA]">
          <div className="min-h-[calc(100vh-10rem)]">
            {children}
          </div>
          <div className="print:hidden">
            <Footer />
          </div>
        </main>

        {/* Live Chat Widget */}
        <button className="fixed bottom-6 right-6 flex items-center gap-2 rounded-full bg-[#56A600] px-6 py-3 text-white shadow-xl shadow-[#56A600]/30 hover:bg-[#4a8e00] transition-all active:scale-95 z-50 print:hidden">
           <MessageSquare className="h-5 w-5" />
           <span className="font-bold">Live Chat</span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <aside className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl animate-in fade-in-0 slide-in-from-left-full duration-300 flex flex-col">
            <div className="flex h-16 items-center justify-between border-b px-6 shrink-0">
              <Link href="/dashboard" className="flex items-center gap-3" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#56A600] shadow-lg shadow-[#56A600]/20">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg font-black tracking-[0.05em] text-[#1F2937]">TMS</span>
                  <span className="text-[9px] font-bold tracking-[0.05em] text-[#98A2B3] uppercase">Property Management System</span>
                </div>
              </Link>
              <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => setIsMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex-1 overflow-y-auto space-y-4 px-4 py-6">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-[#98A2B3] mb-2">{group.label}</p>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className={cn(
                            "flex items-center rounded-xl px-4 py-3 text-sm font-bold transition-all",
                            isActive
                              ? "bg-[#F0FDF4] text-[#12B76A] ring-1 ring-[#12B76A]/10 shadow-sm"
                              : "text-[#667085] hover:bg-[#F9FAFB] hover:text-[#1F2937]"
                          )}
                        >
                          <item.icon className={cn(
                              "mr-3 h-5 w-5",
                              isActive ? "text-[#12B76A]" : "text-[#98A2B3]"
                          )} />
                          {item.name}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
            <div className="border-t p-4 shrink-0">
               <div className="flex items-center gap-3 px-2">
                  <div className="h-10 w-10 rounded-full bg-[#56A600]/10 flex items-center justify-center text-[#56A600] font-bold">
                    {user.name?.charAt(0)}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-[#1F2937]">{user.name}</span>
                    <span className="text-[10px] text-[#667085] truncate max-w-[150px]">{user.email}</span>
                  </div>
               </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
