# Security Logbook Module Testing Strategy

## 1. Multi-Tenant Isolation
- **Test Case**: Access OB Entry from Org A using an Org B session.
- **Expected**: HTTP 404 or Unauthorized error.
- **Verification**: Ensure `organizationId` is present in all `where` clauses in `SecurityRepository`.

## 2. Occurrence Book (OB) Workflow
- **Test Case**: Create an incident, then update its status to `UNDER_INVESTIGATION` then `CLOSED`.
- **Verify**: `SecurityActivity` records each transition with the correct `oldValue` and `newValue`.
- **Verify**: `closedAt` timestamp is set upon closing.
- **Verify**: Log Number is auto-generated in sequence (e.g., OB-000001).

## 3. Visitor Management
- **Test Case**: Record visitor check-in, then perform check-out.
- **Verify**: `checkInTime` is set automatically. `checkOutTime` is null until check-out action.
- **Verify**: `On Site` status is correctly displayed in the UI for active visitors.

## 4. Patrol Logging
- **Test Case**: Start a patrol and record findings.
- **Verify**: Patrol record is created with the officer's user ID and current timestamp.

## 5. Shift Handover
- **Test Case**: Record a handover from Officer A to Officer B.
- **Verify**: Record includes shift notes, outstanding issues, and equipment handover details.
- **Verify**: Incoming and Outgoing officers are correctly linked.

## 6. RBAC Enforcement
- **Test Case**: User without `security:close` permission tries to close an OB entry.
- **Expected**: `checkPermission` throws an error.

## 7. Audit Accuracy
- **Test Case**: Update an incident's severity.
- **Verify**: `AuditLog` captures `oldData` (previous severity) and `newData` (new severity).
- **Verify**: Check-in and Check-out events are audited.
