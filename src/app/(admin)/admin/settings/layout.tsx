import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="space-y-8 pb-12">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your personal Super Admin profile, security, and preferences.</p>
      </div>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            <Link href="/admin/settings/profile" className="px-4 py-2 text-sm font-bold rounded-lg hover:bg-slate-100 text-slate-900">
              Profile Overview
            </Link>
            <Link href="/admin/settings/security" className="px-4 py-2 text-sm font-bold rounded-lg hover:bg-slate-100 text-slate-900">
              Security & Password
            </Link>
            <Link href="/admin/settings/notifications" className="px-4 py-2 text-sm font-bold rounded-lg hover:bg-slate-100 text-slate-900">
              Notifications
            </Link>
            <Link href="/admin/settings/sessions" className="px-4 py-2 text-sm font-bold rounded-lg hover:bg-slate-100 text-slate-900">
              Active Sessions
            </Link>
            <Link href="/admin/settings/tokens" className="px-4 py-2 text-sm font-bold rounded-lg hover:bg-slate-100 text-slate-900">
              API Tokens
            </Link>
          </nav>
        </aside>
        <div className="flex-1 lg:max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
