import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { caseRepository } from "../repositories/case-repository";
import { CaseStatusBadge } from "./case-status-badge";
import { CaseSeverityBadge } from "./case-severity-badge";

export async function CasesDashboard({ organizationId }: { organizationId: string }) {
  const stats = await caseRepository.getDashboardStats(organizationId);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Escalated Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.escalatedCases}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Resolution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgResolutionTime} days</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>By Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.byStatus.map((s) => (
                <div key={s.status} className="flex items-center justify-between">
                  <CaseStatusBadge status={s.status} />
                  <span className="text-sm font-medium">{s._count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>By Severity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats.bySeverity.map((s) => (
                <div key={s.severity} className="flex items-center justify-between">
                  <CaseSeverityBadge severity={s.severity} />
                  <span className="text-sm font-medium">{s._count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
