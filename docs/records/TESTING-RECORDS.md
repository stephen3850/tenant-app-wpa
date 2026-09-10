# Records Module Testing Strategy

## 1. Multi-Tenant Isolation
- **Test Case**: Search for a lease number from Org A while logged into Org B.
- **Expected**: Zero results returned.
- **Verification**: Check `searchRecords` method in `RecordsRepository` for mandatory `organizationId` filter.

## 2. Search Accuracy
- **Test Case**: Search for a tenant by phone number.
- **Verify**: The tenant record appears in the search results.

## 3. Access Auditing
- **Test Case**: View a record or perform a global search.
- **Verify**: Entry created in `RecordAccessLog` with correct `userId`, `action`, and `details`.

## 4. Retention Policies
- **Test Case**: Update retention policy for `INVOICE` to 7 years.
- **Verify**: Correct entry in `retention_policies` table and audit log record.

## 5. Compliance Records
- **Test Case**: Upload a new legal notice.
- **Verify**: Record appears in Compliance Hub with link to document.

## 6. RBAC Enforcement
- **Test Case**: User without `records:retention` permission tries to update policies.
- **Expected**: `checkPermission` throws Unauthorized error.
