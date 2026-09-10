# SaaS Subscription & Billing Testing Strategy

## 1. Multi-Tenant Isolation
- **Test Case**: Access Org A's billing invoices while logged into Org B.
- **Expected**: HTTP 404 or Unauthorized error.
- **Verification**: Ensure `organizationId` is enforced in `BillingInvoiceRepository`.

## 2. Plan Change (Upgrade/Downgrade)
- **Test Case**: Upgrade from "Basic" to "Pro" plan.
- **Verify**: `planId` in `subscriptions` table is updated.
- **Verify**: `AuditLog` captures `PLAN_CHANGED` with previous and new plan details.

## 3. Usage-Based Calculation
- **Test Case**: Add properties and units until limit is reached.
- **Verify**: System prevents adding more units once the plan limit (stored in `Plan.features`) is hit.
- **Verify**: Usage dashboard accurately reflects current unit/user counts.

## 4. Invoice Payment Flow
- **Test Case**: Record a manual payment for a `DRAFT` or `ISSUED` invoice.
- **Verify**: Invoice status changes to `PAID` once the total amount is reached.
- **Verify**: `BillingPayment` record is created with correct transaction reference.

## 5. Subscription Cancellation
- **Test Case**: Cancel a subscription.
- **Verify**: `cancelAtPeriodEnd` becomes `true` and `canceledAt` is populated.
- **Verify**: Organization still has access until `endDate`.

## 6. RBAC Enforcement
- **Test Case**: User without `billing:update` permission tries to change a plan.
- **Expected**: `checkPermission` throws.

## 7. Audit Accuracy
- **Test Case**: Verify all billing events (Invoice Issued, Payment Recorded, Plan Changed) appear in the global audit trail.
