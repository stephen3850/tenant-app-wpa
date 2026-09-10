# Communications Module Testing Strategy

## 1. Multi-Tenant Isolation
- **Test Case**: Send an SMS from Org A and verify it's not visible in Org B's history.
- **Verification**: Check `CommunicationRepository` for mandatory `organizationId` filters on all queries.

## 2. Delivery Tracking
- **Test Case**: Send an email and verify status changes from `PENDING` to `SENT`.
- **Verify**: `sentAt` is populated upon successful send simulation.

## 3. Template Rendering
- **Test Case**: Render the `PAYMENT_CONFIRMATION` template with variables.
- **Verify**: `{{tenantName}}` and `{{amount}}` are correctly replaced with real data.

## 4. In-App Notifications
- **Test Case**: Create a notification for a user and mark it as read.
- **Verify**: `readAt` is updated in the database.

## 5. Announcements
- **Test Case**: Create a broadcast announcement targeting "ALL".
- **Verify**: Entry appears in the `announcements` table with correct `targetType`.

## 6. RBAC Enforcement
- **Test Case**: User without `communications:send` permission tries to send an SMS.
- **Expected**: `checkPermission` throws an Unauthorized error.

## 7. Audit Accuracy
- **Test Case**: Send an email.
- **Verify**: `AuditLog` captures the recipient, subject, and body metadata.
