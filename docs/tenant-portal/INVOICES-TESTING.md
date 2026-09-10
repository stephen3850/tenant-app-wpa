# Tenant Invoices Module Testing Strategy

## 1. Multi-Tenant Isolation (Security)
- **Scenario**: Tenant A tries to access Tenant B's invoice by URL.
- **Test**: Authenticate as Tenant A. Attempt to access `/invoices/[TenantB_Invoice_ID]`.
- **Expected**: System returns 404 (Not Found) or 403 (Forbidden) because the repository enforces `lease: { tenantId }` check.

## 2. Financial Accuracy
- **Scenario**: Verify line items and totals.
- **Test**: Compare the data in the database for a specific invoice with the rendered `InvoiceDetails` page.
- **Expected**: Subtotal, Tax, Total, Amount Paid, and Balance Due must match the database exactly.

## 3. Status Filtering
- **Scenario**: Filter by status "PAID".
- **Test**: Select "Paid" in the status filter on the Invoice List page.
- **Expected**: Only invoices with `status: 'PAID'` should be visible. Invoices with `DRAFT` status must never be visible to tenants.

## 4. Payment Call to Action
- **Scenario**: Fully paid invoice.
- **Test**: Open an invoice with `balanceDue: 0`.
- **Expected**: The "Pay Outstanding Balance" button should be hidden.

## 5. Audit Logging
- **Scenario**: View and Download invoice.
- **Test**: Open an invoice details page and click "Download PDF".
- **Verification**: Check `audit_logs` table for `INVOICE_VIEWED` and `INVOICE_DOWNLOADED` entries with the correct `entityId` and `userId`.

## 6. Responsive Design
- **Scenario**: View on mobile.
- **Test**: Use browser dev tools to simulate a mobile screen.
- **Expected**: Table should be scrollable or collapse gracefully into cards. The layout must remain functional and readable.
