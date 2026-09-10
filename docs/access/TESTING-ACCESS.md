# Users & Access Management Testing Strategy

## 1. Multi-Tenant Isolation
- **Test Case**: Access User Profile from Org A using Org B session.
- **Expected**: HTTP 404 or Unauthorized.
- **Verification**: Check `UserRepository` for mandatory `organizationId` filter.

## 2. User Lifecycle
- **Test Case**: Invite a user -> Suspend them -> Activate them.
- **Verify**: `status` field in `users` table updates correctly.
- **Verify**: Audit logs are generated for `USER_INVITED`, `USER_SUSPENDED`, and `USER_ACTIVATED`.

## 3. Permission Enforcement
- **Test Case**: User with `Finance Officer` role tries to create a new property.
- **Verify**: If `properties:create` is not in the bundle, `checkPermission` must throw.

## 4. Approval Workflows
- **Test Case**: Submit an expense.
- **Verify**: The correct `ApprovalStep` is identified and user with required role can see it in `Approval Center`.

## 5. Access Reviews
- **Test Case**: Perform an access review of all staff members.
- **Verify**: `AccessReview` record created with findings and reviewer ID.

## 6. Audit Accuracy
- **Test Case**: Assign a new role to a user.
- **Verify**: `AuditLog` captures the `ROLE_ASSIGNED` action with `newData` containing the role ID.
