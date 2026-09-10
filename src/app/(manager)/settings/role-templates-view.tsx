"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronDown,
  ChevronRight,
  Users,
  Shield,
  Plus,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { createRoleTemplateAction, getRoleTemplatesAction } from "@/features/workspace/actions/role-template-actions";
import { toast } from "sonner";

const PERMISSION_GROUPS = [
  {
    id: "property_setup",
    label: "Property Setup",
    permissions: [
      { id: "view_properties", label: "View properties" },
      { id: "create_properties", label: "Create/edit properties" },
      { id: "validate_setup", label: "Validate property setup" },
      { id: "approve_setup", label: "Approve property setup" },
    ]
  },
  {
    id: "tenant_onboarding",
    label: "Tenant Onboarding",
    permissions: [
      { id: "view_tenants", label: "View tenants" },
      { id: "create_tenants", label: "Create tenants" },
      { id: "approve_tenants", label: "Approve tenants" },
    ]
  },
  {
    id: "lease_creation",
    label: "Lease Creation",
    permissions: [
      { id: "view_leases", label: "View leases" },
      { id: "create_leases", label: "Create/edit leases" },
      { id: "terminate_leases", label: "Terminate leases" },
    ]
  },
  {
    id: "invoicing",
    label: "Invoicing",
    permissions: [
      { id: "view_invoices", label: "View invoices" },
      { id: "create_invoices", label: "Create/generate invoices" },
      { id: "void_invoices", label: "Void invoices" },
    ]
  },
  {
    id: "payments_slips",
    label: "Payments & Slips",
    permissions: [
      { id: "view_payments", label: "View payments" },
      { id: "record_payments", label: "Record payments" },
      { id: "approve_refunds", label: "Approve refunds" },
    ]
  },
  {
    id: "collections_evictions",
    label: "Collections & Evictions",
    permissions: [
      { id: "view_collections", label: "View collections" },
      { id: "issue_notices", label: "Issue eviction notices" },
    ]
  },
  {
    id: "communications",
    label: "Communications",
    permissions: [
      { id: "send_sms", label: "Send bulk SMS" },
      { id: "send_emails", label: "Send bulk emails" },
      { id: "manage_templates", label: "Manage templates" },
    ]
  },
  {
    id: "vendor_bills",
    label: "Vendor Bills & Vouchers",
    permissions: [
      { id: "view_expenses", label: "View expenses" },
      { id: "create_expenses", label: "Record vendor bills" },
      { id: "approve_expenses", label: "Approve expenses" },
    ]
  },
  {
    id: "reports",
    label: "Reports",
    permissions: [
      { id: "view_financial_reports", label: "View financial reports" },
      { id: "view_operational_reports", label: "View operational reports" },
      { id: "export_reports", label: "Export reports" },
    ]
  },
  {
    id: "maintenance",
    label: "Maintenance Tickets",
    permissions: [
      { id: "view_tickets", label: "View tickets" },
      { id: "create_tickets", label: "Create/edit tickets" },
      { id: "assign_tickets", label: "Assign tickets" },
      { id: "close_tickets", label: "Close tickets" },
    ]
  },
  {
    id: "cases",
    label: "Cases",
    permissions: [
      { id: "view_cases", label: "View cases" },
      { id: "create_cases", label: "Create/edit cases" },
      { id: "resolve_cases", label: "Resolve cases" },
    ]
  },
  {
    id: "security_ops",
    label: "Security Ops",
    permissions: [
      { id: "view_logs", label: "View security logs" },
      { id: "record_incidents", label: "Record incidents" },
    ]
  },
  {
    id: "accounting_returns",
    label: "Accounting & Returns",
    permissions: [
      { id: "manage_ledger", label: "Manage ledger" },
      { id: "process_returns", label: "Process returns" },
    ]
  },
  {
    id: "audit_logs",
    label: "Audit Logs",
    permissions: [
      { id: "view_audit_logs", label: "View system audit logs" },
    ]
  },
  {
    id: "utilities",
    label: "Utilities",
    permissions: [
      { id: "record_readings", label: "Record meter readings" },
      { id: "approve_readings", label: "Approve readings" },
      { id: "bill_utilities", label: "Generate utility bills" },
    ]
  },
  {
    id: "payroll",
    label: "Payroll & Deductions",
    permissions: [
      { id: "manage_payroll", label: "Manage staff payroll" },
    ]
  }
];

export function RoleTemplatesView() {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["property_setup"]);
  const [formData, setFormData] = useState({
    name: "",
    baseRole: "Operations",
    description: "",
    permissions: {} as Record<string, boolean>
  });

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await getRoleTemplatesAction();
      setTemplates(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handlePermissionChange = (permId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [permId]: checked
      }
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Template name is required");
      return;
    }

    setSaving(true);
    try {
      const activePermissions = Object.entries(formData.permissions)
        .filter(([_, val]) => val)
        .map(([key, _]) => key);

      await createRoleTemplateAction({
        name: formData.name,
        baseRole: formData.baseRole,
        description: formData.description,
        permissions: activePermissions
      });

      toast.success("Role template created successfully");
      setFormData({
        name: "",
        baseRole: "Operations",
        description: "",
        permissions: {}
      });
      loadTemplates();
    } catch (error) {
      toast.error("Failed to create template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <Card className="border-slate-100 shadow-none bg-[#FFFFFF] rounded-xl p-5 border">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-[9px] font-bold text-[#12B76A] uppercase tracking-widest">ACCESS</p>
            <h2 className="text-[17px] font-bold text-slate-800 tracking-tight leading-tight">Role Templates</h2>
            <p className="text-[11px] text-slate-500 font-medium tracking-tight max-w-xl">
              Create Mary, Emma, Linet, accountant, billing clerk, utility officer, or any custom staff role template.
            </p>
          </div>
          <div className="flex items-center gap-2">
             <Button variant="outline" className="h-8 rounded-lg font-bold text-[10px] gap-2 border-slate-200">
                <Users className="h-3.5 w-3.5" />
                Users
             </Button>
             <Button variant="outline" className="h-8 rounded-lg font-bold text-[10px] gap-2 border-slate-200">
                <Shield className="h-3.5 w-3.5" />
                Fixed roles
             </Button>
          </div>
        </div>
      </Card>

      <Card className="border-slate-100 shadow-none bg-white rounded-xl overflow-hidden border">
        <div className="px-5 py-4 border-b border-slate-50 flex items-center justify-between">
            <div className="space-y-0.5">
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">CREATE</p>
                <h3 className="text-[13px] font-bold text-slate-800 tracking-tight">New template</h3>
            </div>
            <div className="bg-[#ECFDF3] text-[#12B76A] px-2.5 py-0.5 rounded-md text-[9px] font-bold border border-[#DCFCE7]">
                {templates.length} existing templates
            </div>
        </div>
        <CardContent className="p-5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">TEMPLATE NAME</Label>
                    <Input
                        placeholder="Emma - Billing Clerk"
                        className="h-8 text-[11px] border-slate-200 focus-visible:ring-[#12B76A] font-medium"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">BASE ROLE</Label>
                    <Select value={formData.baseRole} onValueChange={(v) => setFormData({ ...formData, baseRole: v })}>
                        <SelectTrigger className="h-8 text-[11px] border-slate-200 font-medium">
                            <SelectValue placeholder="Select base role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem className="text-[11px]" value="Operations">Operations</SelectItem>
                            <SelectItem className="text-[11px]" value="Management">Management</SelectItem>
                            <SelectItem className="text-[11px]" value="Finance">Finance</SelectItem>
                            <SelectItem className="text-[11px]" value="Security">Security</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-1.5">
                    <Label className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">DESCRIPTION</Label>
                    <Input
                        placeholder="Handles leases, slips, etc."
                        className="h-8 text-[11px] border-slate-200 focus-visible:ring-[#12B76A] font-medium"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>
            </div>

            <div className="space-y-2">
                {PERMISSION_GROUPS.map((group) => (
                    <div key={group.id} className="border border-slate-50 rounded-lg overflow-hidden">
                        <button
                            onClick={() => toggleGroup(group.id)}
                            className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 transition-colors"
                        >
                            {expandedGroups.includes(group.id) ? (
                                <ChevronDown className="h-3 w-3 text-slate-400" />
                            ) : (
                                <ChevronRight className="h-3 w-3 text-slate-400" />
                            )}
                            <span className="text-[11px] font-bold text-slate-800">{group.label}</span>
                        </button>

                        {expandedGroups.includes(group.id) && (
                            <div className="px-8 py-3 border-t border-slate-50 bg-[#F9FAFB]/30 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {group.permissions.map((perm) => (
                                    <div key={perm.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={perm.id}
                                            checked={formData.permissions[perm.id] || false}
                                            onCheckedChange={(checked) => handlePermissionChange(perm.id, !!checked)}
                                            className="h-3.5 w-3.5 border-slate-200 data-[state=checked]:bg-[#12B76A] data-[state=checked]:border-[#12B76A]"
                                        />
                                        <label
                                            htmlFor={perm.id}
                                            className="text-[10px] font-medium text-slate-600 leading-none cursor-pointer"
                                        >
                                            {perm.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="flex justify-end pt-2">
                <Button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="bg-[#12B76A] hover:bg-[#0E9355] text-white font-bold h-8 px-5 rounded-lg text-[10px] gap-2 shadow-sm shadow-[#12B76A]/10"
                >
                    {saving ? <Loader2 className="h-3 w-3 animate-spin" /> : <Plus className="h-3 w-3" />}
                    Create template
                </Button>
            </div>
        </CardContent>
      </Card>

      {templates.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {templates.map((template) => (
                  <Card key={template.id} className="border-slate-100 shadow-none bg-white rounded-xl p-4 border">
                      <div className="flex items-start justify-between mb-3">
                          <div className="h-8 w-8 rounded-lg bg-[#F0FDF4] flex items-center justify-center text-[#12B76A]">
                              <Shield className="h-4 w-4" />
                          </div>
                          <div className="flex items-center gap-1 text-[8px] font-bold text-[#12B76A] bg-[#ECFDF3] px-1.5 py-0.5 rounded-md border border-[#DCFCE7]">
                             <CheckCircle2 className="h-2.5 w-2.5" />
                             ACTIVE
                          </div>
                      </div>
                      <div className="space-y-0.5 mb-3">
                          <h4 className="text-[12px] font-bold text-slate-800 tracking-tight">{template.name}</h4>
                          <p className="text-[10px] font-medium text-slate-500 line-clamp-1">{template.description || 'No description provided.'}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[8px] font-bold text-slate-400 uppercase tracking-widest">
                          <span>{template.baseRole}</span>
                          <span className="text-slate-700 normal-case">{template.permissions?.length || 0} permissions</span>
                      </div>
                  </Card>
              ))}
          </div>
      )}
    </div>
  );
}
