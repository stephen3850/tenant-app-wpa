# Cases Module Testing Strategy

## 1. Multi-Tenant Isolation
- **Test Case**: Access Case from Org A using an Org B session.
- **Expected**: HTTP 404 or Unauthorized error.
- **Verification**: Ensure `organizationId` is present in all `where` clauses in `CaseRepository`.

## 2. Status Workflows
- **Test Case**: Advance case from `OPEN` to `INVESTIGATING` to `CLOSED`.
- **Verify**: `CaseActivity` records the transition and user who performed it.
- **Verify**: `closedAt` timestamp is set upon closing.

## 3. Evidence Handling
- **Test Case**: Attach a file to a case.
- **Verify**: Entry created in `CaseEvidence` with correct `url`, `type`, and `uploadedById`.

## 4. Decision Recording
- **Test Case**: Record a decision with financial impact.
- **Verify**: `CaseDecision` record exists and `CaseActivity` shows the decision was made.

## 5. RBAC Enforcement
- **Test Case**: User without `cases:archive` permission tries to archive a case.
- **Expected**: `checkPermission` throws.

## 6. Audit Accuracy
- **Test Case**: Update case severity.
- **Verify**: `AuditLog` captures `oldData` (previous severity) and `newData` (new severity).
