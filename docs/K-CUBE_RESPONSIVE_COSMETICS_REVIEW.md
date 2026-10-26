# Cosmetics navigation and shared public alignment

Local changes only. Production frontend build passed and preview restarted on port 3100.

## Cosmetics

- Shared navItems now includes Cosmetics in desktop and mobile navigation.
- Destination: /shop?category=beauty. The existing /shop?store=moa_beauty shortcut also selects this view.
- Cosmetics view shows published beauty-category or moa_beauty-store products only; it does not invent inventory.
- Added All products / Cosmetics & K-Beauty links in the shopping catalog and a footer Cosmetics link.
- Admin can add a product with category beauty and publish it. New beauty products without an explicit store use the existing Moabeauty destination; explicit external product URLs remain supported.
- The empty state is explicit when no cosmetic products are published.

## Width audit and implementation

Previously public components used 1180/1184/1200/1240/1256/1320/1440/1480/1500/1600/1760px limits, often combined with unrelated per-section padding. Homepage hero/community/editorial sections and header/footer did not share an alignment edge.

New responsive-layout.css centralizes a 1320px content cap, clamp(16px,3vw,32px) page gutters, padded shells and page frames. Replaced large hardcoded public layout classes in 33 components, plus public route wrappers. Small text widths, forms and dialogs are retained, not stretched to monitor width. Administration and game surfaces are excluded from the shared public CSS contract.

Homepage hero, category/product grids, editorial sections, Club, festival/certificate, journey, values, header/mega-menu and footer use the shared outer geometry. Page-specific padded cards keep their inner spacing intentionally. Full-width background bands remain allowed.

Tablet navigation switches to the existing expandable menu below 1200px to accommodate the new item. The toggle and mobile-menu breakpoints match, and expanded menus are height-bounded and scrollable. Three-column detail layouts become two columns with a full-row aside from 1024 to 1279px. Large content grid children can shrink and long copy wraps.

### Static geometry targets (not browser measurements)

| Viewport | Shared gutter | Maximum content available |
| --- | --- | --- |
| 360 | 16 | 328 |
| 390 | 16 | 358 |
| 430 | 16 | 398 |
| 768 | 23.04 | 721.92 |
| 1024 | 30.72 | 962.56 |
| 1440 | 32 | 1320 |
| 1920 and wider | 32 | 1320 |

These are calculations from the CSS tokens. They do not prove actual geometry, absence of overflow or interactive rendering at each viewport.

## Primary changed files

- app/responsive-layout.css (new), imported after global/refinement styles by app/layout.tsx.
- lib/kcubeContent.ts and components/header/Header.tsx for navigation and responsive menu behavior.
- components/LiveProductGrid.tsx, ShopCatalogPage.tsx, InternalFooter.tsx and app/shop/page.tsx for cosmetic discovery/filtering.
- Public component large containers migrated to kc-content/kc-shell; KCubePage uses kc-page-frame. DetailPage and ShopCatalogProductPage get scoped responsive grid hooks.
- Public contact and festival information route wrappers use the shared classes.
- backend/services/shopCatalogService.ts for the default destination of new beauty products.
- backend/tests/product-management.e2e.cjs for real cosmetics filter/storefront assertions.

## Verified

- Frontend production build: passed, all 17 static pages and route optimization completed.
- Frontend/backend TypeScript checks: passed.
- Full frontend lint: zero errors, one existing unused-variable warning in KCubePage.tsx.
- Product/media API plus real storefront SSR suite: 10 tests passed, including creating a cosmetic product and asserting it appears on the beauty view while the food test product does not. Temporary data/media cleaned up; real catalog hash unchanged.
- Motion regression suite: 7 passed.
- Diff whitespace checks passed.

## Remaining visual QA

Browser inventory contained Chrome, but Computer Use refused the selected K-CUBE window because it could not confidently determine the current URL. UI automation stopped; no bypass was attempted. Actual viewport screenshots, menu clicks, focus traversal, edge alignment and horizontal overflow at all listed widths are therefore not verified. No claim of perfection on every possible device is made. Review those sizes in the browser before production release. Production was not deployed.
