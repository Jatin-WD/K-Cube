# Product management and journey-card review

Local changes only; no production deployment. Existing catalog data was preserved.

## Admin workflow

Open `/admin`, sign in using an existing authorized admin, then choose **K-Food** in the commerce workspace. The existing workspace continues to hold product and commerce operations.

1. Create a product or select one to edit.
2. Enter English title (required), optional Korean/Hindi translations, slug/SKU, description and category. Blank slug is generated from the English title.
3. Set price, optional compare-at price, whole-number reward points and stock availability. Clearing compare-at price removes it. Publication and stock are independent.
4. Upload a cover, upload up to ten gallery images, or select existing files from Media library. Cover can also use an HTTPS image URL. Gallery supports removal, moving images left and promoting an image to cover.
5. Choose Draft or Published. Drafts never appear in the public catalog/product route. Featured published products take priority in homepage Today's Picks.
6. Save. Public homepage, shop listing and detail pages read the live API instead of hardcoded sample products. Listing views refresh on focus/storage changes and every 30 seconds while visible.
7. Deleting a product asks for confirmation. Deleting unused media also asks for confirmation; server rejects deletion if a saved draft/published product still references the file.

Media uploads accept PNG, JPEG and WebP up to 5 MB. The server checks signature/content type and decodes with Sharp (40 MP input cap), auto-rotates, strips metadata and re-encodes WebP within 2048px. SVG and malformed/oversized uploads are rejected. UUID filenames prevent filename/path traversal. Existing authorization and commerce scopes protect all write/library endpoints.

Badges and product contents now use one-item-per-line controls instead of asking admins to write JSON. Existing translations are retained when their English list item stays unchanged. Product media editing/uploading blocks save and selecting another product until it completes.

This is K-CUBE product management, not a claim that every WooCommerce feature exists: tax, shipping, variable-product inventory, coupons and payment workflows were not added or changed. External store destinations remain as before.

## Storage and integration

Fixed a real path bug: service previously resolved root/data/shop-products.json while the shipped catalog is backend/data/shop-products.json. Source and compiled service now both resolve backend/data correctly.

The existing JSON store is retained, with atomic replacement and serialized mutations within one Node process. It is not a multi-instance transactional database; use one application process for catalog writes or migrate storage before horizontal scaling.

`KCUBE_SHOP_DATA_DIR` can select an absolute persistent directory. It contains `shop-products.json` and `product-media/`. Back up the whole directory and preserve it during deploys. Uploaded runtime files are gitignored. Example environment files document this setting; actual .env files were not edited.

Frontend uses `KCUBE_API_ORIGIN` (origin only, no /api/v1 suffix), an absolute configured NEXT_PUBLIC_API_URL, or loopback backend/single-domain server. Internal targets are not derived from untrusted Host headers. Standalone Next proxies /api/v1 to the backend. The public listing is now API-backed; deleted/draft legacy slugs no longer fall back to static sample data.

Uploaded images are served publicly at /api/v1/shop/media/:filename; no user authentication is needed to view a published product photo. Library listing/uploads/deletion require commerce admin scope. App image CSP permits HTTPS images to support administrator-provided image URLs, without changing script policy. A production reverse proxy must allow at least 5 MB request bodies for the upload endpoint.

## Ticket refinement

The homepage journey card is now straight rather than tilted, with a compact K-CUBE JOURNEYS header, India/South Korea labels, a route line/plane and a separate programme CTA. No booking dates, fares, guaranteed tickets or invented reward mechanics were added.

## Files changed in this task

Backend:
- services/shopCatalogService.ts: path fix, gallery/publication/featured fields, validation, atomic/serialized storage and stable stock labels.
- controllers/productMediaController.ts (new): validated/optimized uploads, library, public serving and in-use deletion checks.
- routes/admin.ts and routes/shop.ts: protected media and public delivery endpoints.
- controllers/shopController.ts: public published-only filtering.
- app.ts: HTTPS image CSP support.
- package.json/package-lock.json: Sharp and repeatable product test command.
- .env.example/.env.hostinger.example: optional persistent storage documentation.
- tests/product-management.e2e.cjs (new): isolated real HTTP lifecycle tests.

Frontend:
- ProductMediaEditor.tsx, ProductGallery.tsx, LiveProductGrid.tsx (new).
- AdminControlCenter.tsx: media editor, simpler fields, publication/featured controls, busy/error handling and delete confirmation.
- home/CultureHome.tsx and home/ProductDiscoveryImage.tsx: API-backed product grid; uploaded images no longer labelled lifestyle photos; journey card markup.
- ShopCatalogPage.tsx/ShopCatalogProductPage.tsx: live listing, gallery and live related products.
- app/page.tsx, app/shop/page.tsx, app/shop/[slug]/page.tsx: server-side live catalog data; no static detail fallback.
- lib/shopApi.ts, lib/shopServer.ts (new), lib/shopCatalog.ts: API resolution and extended data types.
- next.config.ts: local/single-domain API proxy.
- app/home-refinements.css: boarding-pass presentation.
- app/signin/page.tsx: async searchParams compatibility for installed Next.js; authentication behavior unchanged.
- Root .gitignore: runtime product uploads excluded.

## Verification results

**Passed:**
- Backend TypeScript build.
- Frontend standalone TypeScript.
- Full frontend ESLint: zero errors, one existing unused-variable warning in KCubePage.tsx.
- Product test suite: nine passing tests including parent suite (eight subtests).
- Motion regression suite: eight passing tests.
- Local proxy returned 200 and 36 existing published catalog entries; homepage rendered an existing catalog product.
- Whitespace checks.

Product HTTP tests use actual Express routes, JWT middleware and file persistence in a temporary isolated directory. They cover role/scope rejection, valid image optimization/serving, corrupt/oversized file rejection, media listing, draft creation, invalid price/URL and duplicate slug rejection, publication, gallery/featured persistence, stock/price edits, in-use media deletion, no static fallback for a legacy draft, concurrent writes, product/media deletion and 404s. The real catalog hash is asserted unchanged; fixture media/catalog are cleaned up.

A run with `KCUBE_FRONTEND_TEST_URL=http://127.0.0.1:3100` also asserted real SSR HTML on homepage/shop/product detail, uploaded cover and gallery URLs, and 404s after hiding/deletion. This was done before starting the regular preview API on port 4000. Subsequent API-only runs use an ephemeral port and report that scope explicitly.

**Limitations:**
- No attached browser session was returned. Real admin sign-in, file-picker clicks, gallery interactions, cross-tab refresh timing, keyboard traversal and responsive visual QA were not browser-verified. No real database user/auth records or production data were mutated for the tests; tests use isolated signed identities.
- Both Turbopack and webpack compiled frontend code and passed TypeScript, then failed the pre-existing Next.js /_global-error prerender invariant: Expected workStore to be initialized. Production build is not green and deployment has not been attempted.
- npm reported 15 dependency audit advisories during installation. These were not fully triaged or force-fixed in this product task.

## Repeat tests

API-only, with regular preview backend allowed to keep running:

    npm run test:products --prefix backend

For API + storefront SSR assertions, keep Next preview on 3100, stop the regular backend occupying 4000, then in PowerShell:

    $env:KCUBE_FRONTEND_TEST_URL = 'http://127.0.0.1:3100'
    npm run test:products --prefix backend

That command temporarily owns port 4000 with isolated data and closes it afterward. Restart the regular backend after the run. Do not run this fixture proxy against a public production frontend.


## Production build blocker resolved (26 October 2026)

`npm run build --prefix frontend` now passes all 17 static pages and route optimization. Earlier commands used the root Next runtime while frontend had its own installed Next copy, producing the workStore invariant. `server.js` now resolves Next from frontend so build and runtime use the same instance. The local production preview is on 127.0.0.1:3100 (next start, not next dev). Homepage HTML has no dev/HMR markers; all nine rendered homepage image source requests returned 200. The corrected single-domain server was smoke-tested on temporary port 3102: homepage, public catalog, shop and product detail returned 200; that temporary server was stopped. No remote deployment or Lighthouse score claim. Re-run Lighthouse on a fresh local production page for current measurements.
