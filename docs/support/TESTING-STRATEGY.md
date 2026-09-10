# Support Documents Module Testing Strategy

## 1. Multi-Tenant Isolation
- **Scenario**: Org A and Org B both have their own knowledge base articles.
- **Test**: Log in as Org A Manager. Attempt to access `/api/support/articles/[OrgB_Article_ID]`.
- **Expected**: System returns 404 or "Article not found" because it's scoped to `organizationId`.
- **Implementation**: Enforced via `organizationId` in `SupportArticleRepository.findById`.

## 2. Article Versioning & Rollback
- **Scenario**: An article is edited multiple times.
- **Test**: 
    1. Create article v1.
    2. Edit to create v2.
    3. Trigger `rollbackVersion` to v1.
- **Expected**: 
    - `SupportArticleVersion` records exist for v1, v2, and v3 (the rollback).
    - `SupportArticle.currentVersion` is 3.
    - Content of the article matches v1 content.
- **Validation**: Check `support_article_versions` table and Audit Logs.

## 3. Publication Workflow
- **Scenario**: A draft article is published.
- **Test**: Call `publishArticle` server action.
- **Expected**: 
    - `status` updates to `PUBLISHED`.
    - `publishedAt` is set to current date.
    - Article appears in the main Knowledge Base view (which filters for `PUBLISHED`).

## 4. Download Center & Tracking
- **Scenario**: A user downloads a lease template.
- **Test**: Trigger `recordDownload` and open the file.
- **Expected**: 
    - `DownloadLog` entry created with `userId` and `documentId`.
    - `SupportDocument._count.downloadLogs` incremented.
    - Audit Log `DOCUMENT_DOWNLOADED` created.

## 5. RBAC & Visibility
- **Test**: User with `support:view` but not `support:create` attempts to create an article.
- **Expected**: Server action throws "Unauthorized: Missing required permission".
- **Test**: Restrict article view by department (Future enhancement).

## 6. Search & Filters
- **Test**: Search for keywords in article title and content.
- **Expected**: Results correctly filtered by `contains` (case-insensitive).
- **Test**: Filter by Category.
- **Expected**: Only articles matching `categoryId` are returned.

## 7. Audit Accuracy
- **Verify**: Every article mutation (`CREATE`, `UPDATE`, `PUBLISH`, `ARCHIVE`) and document download creates an `AuditLog` entry with correct `entity` and `entityId`.
