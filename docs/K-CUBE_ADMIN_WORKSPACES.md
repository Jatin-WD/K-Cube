# Admin website workflow and community map

## Workspace order

The default `/admin` view is Overview. Navigation now follows:

1. Overview
2. Send Email
3. Submissions
4. Apply for Manpower (also a header shortcut)
5. Users
6. Points
7. Community Map
8. Explore
9. Events
10. Activities
11. K-Food
12. Cosmetics
13. Rewards
14. Korean Learning
15. About

Festival applications, class attendance, chapters, upload moderation, advanced CMS, announcements, calendar, reports and account settings remain available in supporting groups. Existing server scope checks are preserved. Scoped admins no longer send the initial requests for workspaces they cannot access. Small screens have a collapsible navigation overlay.

## Controls available

| Area | Controls |
| --- | --- |
| Users | Existing profile, access and status management; removed the silent 300-account list cap |
| Points | Searchable, server-paginated member balances, including zero-point accounts; add/deduct with an audit reason; existing transaction ledger |
| Explore | Existing live detail-page catalog, CMS pages, translated content blocks and static-content sync |
| Events | Existing events, dates, capacity, archive and attendance management; translated page introduction and cards |
| Activities | Translated page introduction/cards; direct access to activity CMS pages and upload review |
| K-Food | Existing product images, gallery, publishing, stock, pricing, import, claims and fulfillment; translated landing-page content |
| Cosmetics | Separate beauty product list and create/edit form with the existing media/gallery/publish/price/stock controls; a new form defaults to beauty |
| Rewards | Existing reward catalog; translated introduction, main action and cards |
| Korean Learning | Existing track and question management; translated learning hub introduction and optional main action |
| About | Translated main heading, label, subtitle, description, primary action and page cards |
| Manpower | Signed-in application form, account-linked contact/location details, admin search and review status/note; page introduction/action editing |

Page editors use existing `cms_pages` and `cms_blocks` records. The `page-settings` block uses the existing `hero` block type. Other blocks and translations are preserved. Publishing is an explicit admin action. Public components accept text and structured cards, and constrain action destinations to supported URL schemes.

The website's layout, theme CSS, navigation definitions, certificate artwork, homepage campaign composition and decorative graphics remain maintained in frontend code. These changes do not turn those elements into a drag-and-drop page builder.

## Points integrity

`GET /admin/points/users` is commerce-scoped and returns pages of 40 member accounts with totals. Adjustments use the existing authenticated `/admin/points/adjust` endpoint and existing ledger service.

The service locks the user row before checking the balance. Admin deductions exceeding the current balance return HTTP 409 instead of clamping the balance to zero while recording an inaccurate deduction. The admin ID and reason are recorded. Existing reward/XP calculations are retained.

## Community geography

Email registration now collects and persists country, state/region and city/town in the existing user columns. Country and state names/ISO codes are normalized for the map. Suggestions and map coordinates use the server-only [country-state-city dataset](https://github.com/harpreetkhalsagtbit/country-state-city), pinned at version 3.2.1; city data is not bundled into the browser.

The map reads current users directly from MySQL, without a separate manually synchronized member list. It refreshes every minute while visible and on window focus, and provides manual refresh. Requests are cancelled when replaced or unmounted. Retrying after an error remounts the map correctly.

Country → state → city aggregation uses matched administrative centres. A pin does **not** represent a person's precise street address or live GPS position. Ambiguous or unmatched towns never get fabricated city coordinates. Their saved details remain available in the hierarchy/member list, with broader country/state coverage where available. Missing states are inferred only from an unambiguous city match. Searchable, paginated member details include name, account ID, email, phone, saved location, points, status and joining date, protected by user-management scope.

Existing accounts missing location need profile completion; no historical locations were fabricated or bulk-written. Non-email account creation paths retain their existing behavior and can complete location through the profile screen.

## Manpower persistence

The public application endpoint requires a signed-in account and uses that account's ID, ignoring supplied identity fields. Role and experience are validated. Submissions appear in the main submission feed and the dedicated workspace. Reviews require submissions scope and record the reviewer.

An additive `manpower_applications` table is defined in `database/schema.sql` and created by the existing startup bootstrap on older databases. A production database user needs permission to create this table; if migrations are handled separately, apply this table definition through that process. No local or production database was migrated during this task.

## Verification and limits

- Backend TypeScript compilation passed.
- Frontend TypeScript and targeted ESLint checks passed.
- Production frontend build passed, generating all 17 static pages and the existing dynamic routes.
- Admin workspace HTTP integration: 9 tests passed, using real Express routes, JWT middleware and controllers with isolated database fixtures. Covers signup → map, scope enforcement, unknown towns, zero balances, audited point changes, overdraw rejection, CMS publishing and manpower review.
- Geography: 4 tests passed, including country/state aliases, worldwide cities and inconsistent-location rejection.
- Rate-limit/database diagnostic checks: 8 tests passed.
- Existing product/media lifecycle: 10 tests passed in API-only mode.
- Existing homepage motion: 7 tests passed.

The integration tests do not substitute for a live MySQL migration or concurrency test. Authenticated local desktop/mobile browser verification is still pending; an existing production map was observed read-only, and it is running the previous code. No production deploy, Git push, real test registration, real points adjustment or email was performed.
