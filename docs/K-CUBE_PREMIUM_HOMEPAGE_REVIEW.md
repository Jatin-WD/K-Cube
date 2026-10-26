# K-CUBE premium homepage enhancement

Local review, 26 October 2026. No production deployment.

## Audit and priorities

The route inventory and shared frontend architecture were reviewed: Next.js app routes, public header/mega-menu/footer, homepage and carousel, catalog data, archive/certificate sections, global CSS, providers, layout and build configuration. This is a targeted public UI pass, not a claim that every administration/business-flow component has been functionally tested.

The supplied desktop/mobile/tablet screenshots are the visual baseline. The existing information hierarchy, pastel categories, original campaign artwork and community composition work well. Main issues were 8-11px labels, small carousel controls, variable product image proportions, a broken topokki image, and hover behavior without equivalent keyboard emphasis. Several historical global palette overrides require carefully scoped refinements. The carousel already pauses on hover/focus, but did not respond to reduced-motion preference changes or document visibility changes while running.

| Priority | Finding | Action |
| --- | --- | --- |
| P0 | Failed product image displays browser broken-image output | Preserve original source and show an explicit neutral image-unavailable state on failure |
| P0 | Small labels and controls on mobile | Larger product/category/hero text and practical target sizes |
| P0 | Motion preference changes not observed | Subscribe to reduced-motion and page visibility changes; clean up listeners |
| P1 | Product image ratios and price/status layout inconsistent | Square reserved media, responsive delivery, wrapping price/status |
| P1 | Crowded mobile feature text | Responsive headings, readable descriptions, room reserved beside Hangul |
| P1 | Carousel has multiple h1s | One visually hidden homepage h1, campaign titles use h2; banner text unchanged |
| P2 | Brand palette and interaction consistency | Shared requested colors, restrained diamond marks, short transform transitions |
| P2 | Editorial Korean context | ??? ? paired with Today's picks; existing category Hangul preserved |
| P3 | Replacement product photography, new benefits or major flows | Not implemented; requires separately approved content/scope |

## Changed files in this pass

- `frontend/src/app/globals.css`: signature rose #BE4B70, cream #FFF6F1, peach #FFE8D6, mint #DDF0E8; existing aliases retained. Banner heading selectors follow the semantic h2 change.
- `frontend/src/app/home-refinements.css` (new): scoped responsive typography, focus/hover states, diamond heading accents, card media, timeline details, touch and reduced-motion rules.
- `frontend/src/app/layout.tsx`: imports the refinement stylesheet after global styles. No route or metadata changes.
- `frontend/src/components/home/CultureHome.tsx`: semantic homepage heading; bilingual editorial label; responsive optimized images using the same sources; accessible decorative marks; explicit image dimensions.
- `frontend/src/components/home/HomeCampaignBanner.tsx`: same banner assets through Next Image; responsive image sizes, eager first slide/lazy second; motion/visibility listeners; semantic h2 titles; pause-state accessibility.
- `frontend/src/components/home/ProductDiscoveryImage.tsx` (new): optimized responsive product image and neutral error fallback, with reserved image area.
- `frontend/next.config.ts`: permits optimization only for HTTPS images.unsplash.com sources already in the catalog. No broad wildcard host permission.
- This review report.

Earlier working-tree edits are preserved. Authentication, APIs, checkout, catalog prices/stock/reward values, certificate claims/artwork and historical events were not changed.

## UX, culture and motion

The discovery path and all existing links remain. Product categories, names, prices, rewards and stock statuses are preserved; an unavailable image does not hide the product or invent its appearance. The supplied topokki source could not be validated: direct network access failed with a connection error, so no replacement photograph was selected.

Category focus and restrained arrow/Hangul movements encourage exploration. The Club retains its rose/yellow identity; its graphic responds gently only on hover-capable devices. Diamond geometry is confined to small section-heading accents. Korean remains contextual: ??, ???, ???, ?? and ??? ?. Korean fallback fonts use installed Noto Sans KR/Malgun Gothic/Pretendard without adding font downloads.

Hover timings are 180-300ms. Motion uses transforms and respects reduced motion, including live preference changes. No scroll reveals, parallax, intrusive popups, testimonials or speculative features were added.

## Accessibility and responsive review

Calculated solid-color contrast:

- White on #BE4B70: 4.74:1.
- Cocoa on cream: 10.70:1.
- Secondary copy on peach: 6.22:1.
- Category Korean text: lavender 5.18:1, peach 4.83:1, pink 4.99:1, mint 4.59:1.

These specific pairs exceed AA normal-text contrast; this is not a complete WCAG audit. Category links have explicit focus outlines; decorative Hangul is excluded from link names. Pause uses aria-pressed; inactive carousel slides remain inert. Semantic headings and unavailable-image labels improve screen-reader output.

Static responsive review covered 360/390/430/768/1024/1440px requirements against existing and added CSS. Two-column mobile product/category layouts, mobile feature stacking, tablet hero features, reserved image dimensions and footer columns are preserved. Tiny mobile product status/category labels were enlarged. Mobile footer links remain stacked. Header search uses 16px input text to avoid mobile focus zoom. No browser screenshots or real viewport geometry measurements were available: the browser tool returned no attached browsers. Hover, focus traversal, real cropping and overflow still require browser QA at those widths.

## Verification

- Standalone TypeScript: passed after the default build refreshed generated types.
- Full ESLint: zero errors, one existing unused-variable warning in KCubePage.tsx. Homepage native-image warnings were removed by using Next Image.
- Whitespace checks: passed.
- Local HTTP: Home, Contact, Shop, Events and Learning returned 200.
- Homepage HTML: one h1; optimized image markup and bilingual editorial label present.
- Local responsive banner optimizer endpoint: requested successfully (no shell exception).
- Production build: compiled successfully and passed TypeScript, then failed prerendering /_global-error with Next.js invariant 'Expected workStore to be initialized'. This matches the earlier build blocker and remains unresolved.
- No frontend automated-test script exists; no test framework/dependencies were added.
- Live carousel interactions, fallback rendering and responsive layouts are code-reviewed but not browser-verified.
- LCP, INP, CLS and Lighthouse were not measured; targets are not claimed as achieved.

## Performance and remaining release checks

Next Image now provides responsive variants and lazy delivery for below-fold product/feature imagery; campaign dimensions remain reserved, with the first banner eager/high priority. Original images are retained. Third-party product optimization still depends on upstream availability; the explicit fallback handles failures without introducing substitute photos. No animation library or additional dependency was introduced.

Before production release: resolve the existing Next.js build issue; attach a browser and capture desktop/mobile before-and-after screenshots; test menus, carousel controls, focus traversal, remote-image failure and certificate preview at requested widths; measure Core Web Vitals on a representative device/network. Verify an authentic topokki asset with the catalog owner if the source remains unavailable.


## Production build blocker resolved (26 October 2026)

`npm run build --prefix frontend` now passes all 17 static pages and route optimization. Earlier commands used the root Next runtime while frontend had its own installed Next copy, producing the workStore invariant. `server.js` now resolves Next from frontend so build and runtime use the same instance. The local production preview is on 127.0.0.1:3100 (next start, not next dev). Homepage HTML has no dev/HMR markers; all nine rendered homepage image source requests returned 200. The corrected single-domain server was smoke-tested on temporary port 3102: homepage, public catalog, shop and product detail returned 200; that temporary server was stopped. No remote deployment or Lighthouse score claim. Re-run Lighthouse on a fresh local production page for current measurements.
