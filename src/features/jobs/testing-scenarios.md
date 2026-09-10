# Background Jobs Testing Scenarios

## 1. Monthly Invoice Fan-out
- **Scenario**: Master job is triggered via QStash CRON.
- **Expected**: `fanOutMonthlyInvoices` finds all active organizations and publishes one message per org to the `process-org` endpoint.
- **Validation**: Check `MpesaCallbackLog` (or relevant log) for multiple published messages.

## 2. Per-Org Invoice Generation
- **Scenario**: `process-org` is called with a specific `organizationId`.
- **Expected**: Invoices are generated for the current month. If invoices already exist, the job should skip them (Idempotency).
- **Validation**: Query `Invoice` table for the current month/year.

## 3. Signature Verification
- **Scenario**: Call a job endpoint without the `upstash-signature` header.
- **Expected**: Returns `401 Unauthorized`.
- **Validation**: Attempt a manual `curl` to `/api/jobs/overdue-processing`.

## 4. Retries & Dead Letters
- **Scenario**: A job endpoint returns a `500` error (e.g., database down).
- **Expected**: QStash should automatically retry the request based on the configured retry policy.
- **Validation**: Inspect QStash dashboard for retry attempts.

## 5. Idempotency (M-Pesa Reconciliation)
- **Scenario**: Two callbacks for the same `MpesaReceiptNumber` are queued.
- **Expected**: The first one creates the payment; the second one detects the existing payment and returns success without creating a duplicate.
- **Validation**: Check `Payment` table for unique `transactionRef`.
