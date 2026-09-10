"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  createCategoryAction,
  getCategoriesAction,
  deleteCategoryAction
} from "@/features/expenses/actions/category-actions";
import { cn } from "@/lib/utils";

interface ExpenseCategoriesViewProps {
  onBack: () => void;
}

export function ExpenseCategoriesView({ onBack }: ExpenseCategoriesViewProps) {
  const [name, setName] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await getCategoriesAction();
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setFetching(false);
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Category name is required");
      return;
    }

    setLoading(true);
    try {
      await createCategoryAction(name);
      toast.success("Category added successfully");
      setName("");
      loadCategories();
    } catch (error) {
      toast.error("Failed to add category");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      await deleteCategoryAction(id);
      toast.success("Category deleted");
      loadCategories();
    } catch (error) {
      toast.error("Failed to delete category. System categories cannot be deleted.");
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start justify-between bg-white p-5 rounded-xl border border-slate-100 shadow-none">
        <div className="space-y-0.5">
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">EXPENSE SETUP</p>
          <h2 className="text-[18px] font-bold text-slate-800 tracking-tight leading-tight">Expense Categories</h2>
          <p className="text-[11px] text-slate-500 font-medium tracking-tight">Manage the categories used by single, bulk, and imported expenses.</p>
        </div>
        <Button
          variant="outline"
          onClick={onBack}
          className="h-8 px-4 rounded-md border-slate-200 text-[11px] font-bold text-slate-700 gap-2"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to expenses
        </Button>
      </div>

      {/* Form Card */}
      <Card className="border-slate-100 shadow-none bg-white rounded-xl p-5 border">
        <div className="flex items-end gap-4">
          <div className="flex-1 space-y-1.5">
            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CATEGORY NAME</label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Repairs & Maintenance"
              className="h-9 text-[12px] border-slate-200 focus-visible:ring-[#12B76A]"
            />
          </div>
          <div className="flex items-center gap-2 mb-2">
            <Checkbox
              id="active"
              checked={isActive}
              onCheckedChange={(v) => setIsActive(!!v)}
              className="h-4 w-4 border-slate-200 data-[state=checked]:bg-[#12B76A] data-[state=checked]:border-[#12B76A]"
            />
            <label htmlFor="active" className="text-[12px] font-bold text-slate-700 cursor-pointer">Active</label>
          </div>
          <Button
            onClick={handleAdd}
            disabled={loading}
            className="bg-[#12B76A] hover:bg-[#0E9355] text-white font-bold h-9 px-6 rounded-md text-[11px] gap-2 mb-0.5 shadow-sm"
          >
            {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Add category
          </Button>
        </div>
      </Card>

      {/* List Card */}
      <Card className="border-slate-100 shadow-none bg-white rounded-xl overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F9FAFB] border-b border-slate-50">
              <th className="px-6 py-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">NAME</th>
              <th className="px-6 py-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest">STATUS</th>
              <th className="px-6 py-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right">ACTION</th>
            </tr>
          </thead>
          <tbody>
            {fetching ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center">
                  <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-300" />
                </td>
              </tr>
            ) : categories.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-6 py-12 text-center text-[11px] text-slate-400 font-medium">
                  No custom categories yet.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3.5">
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-slate-700">{cat.name}</span>
                      {cat.isSystem && <span className="text-[9px] text-slate-400">System Category</span>}
                    </div>
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={cn(
                      "text-[9px] font-bold px-2 py-0.5 rounded-md border",
                      cat.isSystem || isActive // For now, system or newly added are active
                        ? "text-[#12B76A] bg-[#F0FDF4] border-[#DCFCE7]"
                        : "text-slate-400 bg-slate-50 border-slate-100"
                    )}>
                      {cat.isSystem || isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-right">
                    {!cat.isSystem && (
                      <Button
                        variant="ghost"
                        onClick={() => handleDelete(cat.id)}
                        className="h-8 w-8 p-0 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      {/* Bottom spacing for scrolling */}
      <div className="h-10" />
    </div>
  );
}
