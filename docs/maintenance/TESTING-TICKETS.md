# Tickets Module Testing Strategy

## 1. Multi-Tenant Isolation
- **Test Case**: Create a ticket in Org A and try to access it via Org B's session.
- **Expected**: System returns 404 or Unauthorized error.
- **Tools**: Vitest + Prisma Mocking or Integration Tests with separate DB schemas.

## 2. Status Workflows
- **Test Case**: Transitions from `OPEN` -> `ASSIGNED` -> `IN_PROGRESS` -> `RESOLVED` -> `CLOSED`.
- **Verify**: `TicketActivity` records every transition with correct `oldValue` and `newValue`.
- **Verify**: `closedAt` is populated only when status becomes `CLOSED`.

## 3. SLA Calculations
- **Test Case**: Create tickets with different priorities.
- **Verify**: `responseTimeTarget` and `resolutionTarget` match defined policy (e.g., EMERGENCY = 2h response).

## 4. RBAC Enforcement
- **Test Case**: User without `tickets:assign` permission tries to call `assignTicket` action.
- **Expected**: `checkPermission` throws Unauthorized error.

## 5. Audit Accuracy
- **Test Case**: Update a ticket's description.
- **Verify**: `AuditLog` entry is created with both `oldData` and `newData`.

## 6. Activity Feed
- **Test Case**: Add an internal comment and a public comment.
- **Verify**: Internal comment is marked as `isInternal: true` and only visible to staff (in UI logic).
