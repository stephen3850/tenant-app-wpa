import { Separator } from "@/components/ui/separator";
import { ProfileNav } from "./components/profile-nav";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="space-y-0.5">
        <h2 className="text-3xl font-black tracking-tight text-slate-900">Account Settings</h2>
        <p className="text-slate-500 font-medium">
          Manage your landlord account, security preferences, and notifications.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <ProfileNav />
        </aside>
        <div className="flex-1 lg:max-w-4xl">{children}</div>
      </div>
    </div>
  );
}
