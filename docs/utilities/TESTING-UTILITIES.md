# Utility Billing & Management Testing Strategy

## 1. Meter Management
- **Test Case**: Create a new unit meter.
- **Verify**: Meter is correctly linked to the property, unit, and organization.
- **Verify**: `meterNumber` must be unique across the organization.

## 2. Reading recording & Consumption Calculation
- **Test Case**: Record a new reading (Current: 100) for a meter with no previous readings.
- **Expected**: Consumption = 100.
- **Test Case**: Record a new reading (Current: 150) for a meter with previous reading of 100.
- **Expected**: Consumption = 50.
- **Test Case**: Attempt to record a reading (Current: 90) when previous was 100.
- **Expected**: Validation error (Current reading cannot be less than previous).

## 3. Approval Workflow & Automatic Billing
- **Test Case**: Approve a pending reading for a unit with an active lease.
- **Verify**: Reading status changes to `APPROVED` then `BILLED`.
- **Verify**: An invoice line item is generated on a DRAFT invoice for the current month.
- **Verify**: The amount calculated matches the billing rule (e.g., Consumption * Unit Price).

## 4. Multi-Tenant Isolation
- **Test Case**: Attempt to access or record a reading for a meter belonging to another organization.
- **Expected**: Unauthorized/Not Found error.

## 5. Billing Rule Logic
- **Test Case**: Test `FIXED` vs `CONSUMPTION` vs `TIERED` billing rules.
- **Verify**: `minimumCharge` is respected if consumption-based amount is lower.

## 6. Duplicate Prevention
- **Test Case**: Attempt to record two readings for the same meter on the same day.
- **Verify**: Business rules for reading frequency (e.g., daily/monthly limits).

## 7. Audit Accuracy
- **Test Case**: Record, approve, and void a reading.
- **Verify**: `AuditLog` captures all state changes and the user who performed them.
