import { auth } from "@/auth";
import { workspaceService } from "@/features/workspace/services/workspace-service";
import { SetupStatusClient } from "./setup-status-client";

export default async function SetupStatusPage() {
  const session = await auth();
  const organizationId = (session?.user as any)?.organizationId;

  const data = await workspaceService.getDashboardData(organizationId);

  return (
    <div className="p-4 lg:p-8 bg-[#F8FAFC] min-h-screen animate-in fade-in duration-700">
      <SetupStatusClient data={data} />
    </div>
  );
}
