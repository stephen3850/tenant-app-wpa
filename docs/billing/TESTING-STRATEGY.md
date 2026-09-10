# SaaS Billing Module Testing Strategy

## 1. Multi-Tenant Isolation
- **Scenario**: Org A and Org B both have active subscriptions.
- **Test**: Log in as Org A Manager. Attempt to access `/api/billing/invoices` for Org B.
- **Expected**: System returns 403 Forbidden or 404 Not Found.
- **Implementation**: Enforced via `checkPermission` and Prisma query filters in Repositories.

## 2. Subscription Lifecycle
- **Scenario**: Change plan from "Basic" to "Pro".
- **Test**: Trigger `changePlan` server action.
- **Expected**: 
    - `subscription.planId` updates in DB.
    - `AuditLog` entry created with `PLAN_CHANGED` action.
    - Dashboard reflects new plan limits.
- **Scenario**: Cancel subscription.
- **Test**: Trigger `cancelSubscription`.
- **Expected**: `cancelAtPeriodEnd` set to true, `canceledAt` timestamp recorded.

## 3. Invoice Generation & Accuracy
- **Scenario**: Monthly billing cycle ends.
- **Test**: Run `generateMonthlyInvoice` for an organization with usage overages.
- **Expected**:
    - Invoice generated with base price + overage line items.
    - Tax (VAT) calculated correctly (16%).
    - Unique `invoiceNumber` assigned.
- **Validation**: Compare `amount` with `usageMetrics` to ensure overage logic is correct.

## 4. Payment Processing
- **Scenario**: Pay an outstanding invoice via M-Pesa.
- **Test**: Trigger `recordBillingPayment` with method `MPESA`.
- **Expected**:
    - `BillingPayment` record created.
    - `BillingInvoice.status` updated to `PAID`.
    - `paidAt` timestamp set.
    - `AuditLog` entry created.

## 5. Usage Tracking
- **Scenario**: Add a new Unit to a property.
- **Test**: Call `getUsageStats`.
- **Expected**: `activeUnits` count increases immediately.
- **Scenario**: Send 50 SMS messages.
- **Test**: Call `getUsageStats`.
- **Expected**: `smsSent` reflects the new count from the `Communication` table.

## 6. RBAC Verification
- **Test**: User with `staff` role (no billing permissions) attempts to view billing page.
- **Expected**: Middleware or Server Component redirects to dashboard with error.
- **Test**: User with `billing:view` but not `billing:pay` attempts to record a payment.
- **Expected**: Server action throws "Unauthorized".
