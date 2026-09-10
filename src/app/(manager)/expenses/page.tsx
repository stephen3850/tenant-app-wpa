import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { expenseRepository } from "@/features/expenses/repositories/expense-repository";
import {
  Plus,
  ArrowRight,
  ChevronDown,
  Calendar as CalendarIcon,
  Play
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { format } from "date-fns";
import Link from "next/link";

export default async function ExpensesPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const organizationId = (session.user as any).organizationId;
  const expenses = await expenseRepository.findMany(organizationId);

  const totalAmount = expenses.reduce((acc, e) => acc + Number(e.totalAmount), 0);

  return (
    <div className="p-4 lg:p-6 space-y-4 bg-[#F9FAFB] min-h-screen">
      {/* Header Card */}
      <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-[10px] font-bold text-[#64748B] uppercase tracking-widest">OPERATIONS</p>
            <h1 className="text-xl font-black text-[#1E293B] tracking-tight">Expenses</h1>
            <p className="text-xs font-medium text-[#64748B] max-w-sm">
              Record costs, attach receipts, and keep owner deductions clean.
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <Button variant="outline" className="h-8 font-bold text-[12px] border-[#E2E8F0] text-[#1E293B] bg-white hover:bg-slate-50 shadow-sm rounded-md px-3">
                Bulk add expenses
              </Button>
              <Button variant="outline" className="h-8 font-bold text-[12px] border-[#E2E8F0] text-[#1E293B] bg-white hover:bg-slate-50 shadow-sm rounded-md px-3">
                Import
              </Button>
              <Button className="h-8 font-bold text-[12px] bg-[#10A34F] hover:bg-[#0D8A42] text-white gap-1.5 shadow-sm px-4 rounded-md">
                <Plus className="h-3.5 w-3.5" />
                Add expense
              </Button>
              <Button variant="outline" className="h-8 font-bold text-[12px] border-[#E2E8F0] text-[#1E293B] bg-white hover:bg-slate-50 shadow-sm rounded-md px-3">
                Recurring
              </Button>
              <Button variant="outline" className="h-8 font-bold text-[12px] border-[#E2E8F0] text-[#1E293B] bg-white hover:bg-slate-50 shadow-sm rounded-md px-3">
                Owner deductions
              </Button>
              <Button variant="outline" className="h-8 font-bold text-[12px] border-[#E2E8F0] text-[#1E293B] bg-white hover:bg-slate-50 shadow-sm rounded-md px-3">
                Categories
              </Button>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              <Button variant="outline" className="h-8 font-bold text-[12px] border-[#E2E8F0] text-[#1E293B] bg-white hover:bg-slate-50 shadow-sm rounded-md px-4">
                Expense report
              </Button>
              <Button variant="outline" className="h-8 font-bold text-[12px] border-[#E2E8F0] text-[#1E293B] bg-white hover:bg-slate-50 shadow-sm rounded-md px-3">
                Payment vouchers
              </Button>
              <Button variant="outline" className="h-8 font-bold text-[12px] border-[#E2E8F0] text-[#1E293B] bg-white hover:bg-slate-50 shadow-sm rounded-md px-3">
                Vendors
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-r border-slate-100">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">TOTAL AMOUNT</p>
          <p className="text-xl font-black text-slate-900 mt-0.5">KES {totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
        </div>
        <div className="p-4 border-r border-slate-100">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">ENTRIES</p>
          <p className="text-xl font-black text-slate-900 mt-0.5">{expenses.length}</p>
        </div>
        <div className="p-4">
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">CURRENT VIEW</p>
          <p className="text-xl font-black text-slate-900 mt-0.5 uppercase tracking-tight">ALL</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">CATEGORY</label>
            <div className="relative">
              <select className="w-full h-9 pl-3 pr-8 text-[12px] font-bold border border-slate-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#10A34F]/10 transition-all">
                <option>All categories</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">PROPERTY</label>
            <div className="relative">
              <select className="w-full h-9 pl-3 pr-8 text-[12px] font-bold border border-slate-200 rounded-lg bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#10A34F]/10 transition-all">
                <option>All properties</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">FROM</label>
            <div className="relative">
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                className="w-full h-9 pl-3 pr-8 text-[12px] font-bold border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#10A34F]/10 transition-all placeholder:text-slate-300"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-tight">TO</label>
            <div className="relative">
              <input
                type="text"
                placeholder="mm/dd/yyyy"
                className="w-full h-9 pl-3 pr-8 text-[12px] font-bold border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#10A34F]/10 transition-all placeholder:text-slate-300"
              />
              <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>
          <Button className="h-9 bg-[#10A34F] hover:bg-[#0D8A42] text-white px-6 font-black text-[12px] rounded-lg shadow-sm transition-all active:scale-95">
            Apply
          </Button>
        </div>
        <div className="mt-3">
          <button className="text-[11px] font-bold text-[#10A34F] hover:underline flex items-center gap-1 transition-all">
            <Play className="h-2 w-2 fill-current" /> More filters
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow className="border-b border-slate-100 hover:bg-transparent">
              <TableHead className="font-bold text-[11px] text-slate-500 py-3 h-11">Expense #</TableHead>
              <TableHead className="font-bold text-[11px] text-slate-500 h-11">Category</TableHead>
              <TableHead className="font-bold text-[11px] text-slate-500 h-11">Property</TableHead>
              <TableHead className="font-bold text-[11px] text-slate-500 h-11">Amount</TableHead>
              <TableHead className="font-bold text-[11px] text-slate-500 h-11">Date</TableHead>
              <TableHead className="font-bold text-[11px] text-slate-500 h-11">Status</TableHead>
              <TableHead className="text-right font-bold text-[11px] text-slate-500 h-11 pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-48 text-center">
                  <div className="flex flex-col items-center justify-center space-y-1">
                    <p className="text-sm font-bold text-slate-900">No expenses found</p>
                    <p className="text-[11px] text-slate-500">Try adjusting your filters or record a new expense.</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow key={expense.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors group">
                  <TableCell className="py-2.5">
                    <span className="text-[12px] font-black text-slate-900 uppercase tracking-tight">{expense.expenseNumber}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="text-[12px] font-bold text-slate-900 leading-tight">{expense.category.name}</span>
                      <span className="text-[9px] text-slate-500 font-medium uppercase tracking-wider">{expense.vendor.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] font-semibold text-slate-600">{expense.property.propertyName}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[12px] font-black text-slate-900 tabular-nums">KES {Number(expense.totalAmount).toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-[11px] font-bold text-slate-500">{format(new Date(expense.expenseDate), "MMM d, yyyy")}</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`font-bold text-[9px] rounded-full px-2 py-0 border-none ring-1 ring-inset ${
                      expense.status === 'PAID' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                      expense.status === 'REJECTED' ? 'bg-rose-50 text-rose-600 ring-rose-600/20' :
                      'bg-amber-50 text-amber-600 ring-amber-600/20'
                    }`}>
                      {expense.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <Button variant="ghost" size="sm" className="h-7 text-[#10A34F] font-bold text-[11px] gap-1 group-hover:translate-x-1 transition-all" asChild>
                      <Link href={`/expenses/${expense.id}`}>
                        Details <ArrowRight className="h-2.5 w-2.5" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
