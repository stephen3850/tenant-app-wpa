# Tenant Receipts Module Testing Strategy

## 1. Tenant Isolation (Security)
- **Scenario**: Tenant A tries to access Tenant B's receipt by URL.
- **Test**: Authenticate as Tenant A. Attempt to access `/receipts/[TenantB_Receipt_ID]`.
- **Expected**: System returns 404 (Not Found) or 403 (Forbidden) because the repository enforces `payment: { tenantId }` check.

## 2. Receipt Accuracy
- **Scenario**: Verify receipt details match payment and allocations.
- **Test**: Open a receipt and verify:
    - Amount received matches `Payment.amount`.
    - Reference matches `Payment.transactionRef`.
    - Allocations match `PaymentAllocation` records (invoice number, amount).
- **Expected**: Data must match the database exactly.

## 3. Financial Integrity
- **Scenario**: Verify receipt status.
- **Test**: Check if receipts for failed or pending payments are accessible.
- **Expected**: Only receipts for `COMPLETED` payments should be generated and visible.

## 4. Download & Printing
- **Scenario**: Print/Download receipt.
- **Test**: Click "Download PDF" or "Print Receipt".
- **Expected**: 
    - The document should be formatted for printing (minimal clutter, high contrast).
    - `RECEIPT_DOWNLOADED` audit log is created.

## 5. Audit Logging
- **Scenario**: View and Download receipt.
- **Test**: Open a receipt details page and click "Download PDF".
- **Verification**: Check `audit_logs` table for `RECEIPT_VIEWED` and `RECEIPT_DOWNLOADED` entries with the correct `entityId` and `userId`.

## 6. UI/UX
- **Scenario**: Mobile view.
- **Test**: Simulate mobile device.
- **Expected**: Receipt list should be scrollable, and details should be responsive (stacking info where necessary).
