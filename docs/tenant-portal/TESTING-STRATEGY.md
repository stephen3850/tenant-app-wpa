# Tenant Portal Testing Strategy

## 1. Tenant Isolation (Security)
- **Scenario**: Tenant A attempts to view Tenant B's dashboard.
- **Test**: Authenticate as Tenant A. Attempt to access `/tenant/dashboard` and verify only Tenant A's data is returned.
- **Implementation**: Enforced by using the `userId` from the authenticated session to fetch the linked `Tenant` profile. All subsequent queries are scoped to this `tenantId`.

## 2. Dashboard Data Accuracy
- **Scenario**: A payment is made.
- **Test**: Verify the "Current Balance" on the dashboard updates immediately after a payment is recorded in the ledger.
- **Scenario**: A maintenance request is closed.
- **Test**: Verify the counts in the "Maintenance" widget update correctly.

## 3. Financial Summary
- **Verification**: 
    - Ensure `currentBalance` matches the latest entry in `TenantLedger`.
    - Ensure `latestInvoice` is truly the most recent one for that lease.

## 4. Mobile Responsiveness
- **Test**: View dashboard on small screen (375px width).
- **Expectation**: 
    - Banking-app style bottom navigation appears.
    - Grid columns collapse to 1 column.
    - Critical actions (Pay Now) remain accessible.

## 5. Audit Logging
- **Test**: View dashboard as a tenant.
- **Verification**: Check `audit_logs` table for `DASHBOARD_VIEW` entry with correct `userId` and `organizationId`.

## 6. Edge Cases
- **No Active Lease**: Ensure the dashboard shows a "No Active Lease" state without crashing.
- **No Payments**: Ensure tables show an empty state illustration/message.
- **Profile Setup**: Ensure users without a `Tenant` record see the "Dashboard Unavailable" message instead of a 500 error.
