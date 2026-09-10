# Tenant Lease Module Testing Strategy

## 1. Multi-Tenant Isolation
- **Scenario**: Tenant A tries to access Tenant B's lease timeline or notices.
- **Test**: Authenticate as Tenant A. Call `getLeaseDetails(TenantB_Lease_ID)`.
- **Expected**: System returns "Lease not found or access denied" (404/403).
- **Implementation**: Repository uses `where: { id, tenantId }` to ensure ownership.

## 2. Lease Timeline Integrity
- **Scenario**: A notice is issued to a tenant.
- **Test**: Issue a `LeaseNotice` via the Manager Portal.
- **Expected**: A new entry appears in the `LeaseEvent` table (Timeline) and the `LeaseNotice` table.
- **Verification**: Check if the tenant dashboard "Timeline" tab reflects the event correctly.

## 3. Renewal Workflow
- **Scenario**: A tenant accepts a renewal offer.
- **Test**: Call `acceptRenewalOffer(renewalId)`.
- **Expected**: 
    - `LeaseRenewal.status` updates to `ACCEPTED`.
    - `LeaseEvent` created for "RENEWAL_ACCEPTED".
    - `AuditLog` created for `RENEWAL_ACCEPTED`.
- **Validation**: Ensure `tenantResponse` and `respondedAt` are populated.

## 4. Notice Acknowledgment
- **Scenario**: Tenant views and acknowledges a compliance notice.
- **Test**: Click "Acknowledge" on a notice.
- **Expected**: 
    - `LeaseNotice.acknowledgedAt` is set to the current timestamp.
    - The notice UI changes color (from yellow-alert to neutral-slate).
    - `AuditLog` entry created.

## 5. Document Downloads
- **Scenario**: Download lease agreement.
- **Test**: Click "Download Agreement".
- **Expected**: 
    - `AuditLog` entry `LEASE_DOWNLOADED` created.
    - PDF opens in a new tab (if URL exists).

## 6. Mobile Responsiveness
- **Test**: View Lease page on a 375px width screen.
- **Expected**: 
    - Tabs remain accessible (scrollable or stacked).
    - Timeline cards collapse to full-width.
    - Overview cards stack vertically.
