# Tenant Payments Module Testing Strategy

## 1. Multi-Tenant Isolation (Security)
- **Scenario**: Tenant A tries to access Tenant B's payment details.
- **Test**: Authenticate as Tenant A. Attempt to access `/api/payments/[TenantB_Payment_ID]` or use `getMpesaPaymentStatus` with a CheckoutID belonging to Tenant B.
- **Expected**: System returns "Transaction not found" or "Unauthorized".

## 2. M-Pesa STK Push Flow
- **Scenario**: Tenant initiates an STK Push.
- **Test**: Use a valid phone number and amount in the Payment Center.
- **Expected**: 
    - `PAYMENT_INITIATED` audit log is created.
    - `MpesaTransaction` record is created with `status: PENDING`.
    - STK Push is received on the phone.
    - UI enters "Awaiting Confirmation" state with progress bar.

## 3. Callback Processing & Real-time Update
- **Scenario**: Tenant completes payment on their phone.
- **Test**: Simulate/Receive M-Pesa callback.
- **Expected**:
    - `MpesaTransaction` status becomes `SUCCESS`.
    - `Payment` record is created.
    - `TenantLedger` entry is created.
    - Invoice balances are updated.
    - UI polling detects `SUCCESS` and shows success message.

## 4. Payment History & Reconciliation
- **Scenario**: View all past transactions.
- **Test**: Open "Transaction History" tab.
- **Expected**: All payments (M-Pesa, Bank, Manual) are listed correctly. M-Pesa transactions show their Receipt Number after completion.

## 5. Mobile Responsiveness
- **Scenario**: Pay rent on a smartphone.
- **Test**: Simulate mobile view (375px width).
- **Expected**: 
    - Forms stack vertically.
    - Progress bar and polling state are clearly visible.
    - Bottom navigation remains accessible.

## 6. Audit Accuracy
- **Verify**: Audit logs are generated for:
    - `PAYMENT_INITIATED`
    - `PAYMENT_SUCCESS` (via callback logic)
    - `PAYMENT_FAILED` (via callback or polling timeout)
