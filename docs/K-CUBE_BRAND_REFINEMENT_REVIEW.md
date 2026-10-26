# K-CUBE brand refinement review

Local changes only. No deployment performed.

## Audit

The frontend uses Next.js 16, React 19 and Tailwind v4 with `@import "tailwindcss"` and CSS variables in `frontend/src/app/globals.css`; no separate Tailwind theme configuration was found. Shared `Header`, `InternalFooter`, `KCubePage` and the `kc-button` classes consume legacy `--kc-blue-*` names. Public body overrides change these names to the current brand palette while administration and learning game modes keep their own palettes.

Hardcoded colors were inspected across the shared stylesheet, header/menu, homepage, carousel, festival archive and certificate components. They serve different roles: category pastels, image overlays, decorative lettering, controls and text. A blanket color replacement would remove useful category distinctions. Admin/game/map colors were deliberately left outside this refinement.

The shared stylesheet contains compact, overlapping historical public-color overrides, including `!important` text rules. Footer-specific text roles avoid these rules changing light footer text to muted body text. New semantic tokens retain compatibility aliases for existing components.

Existing responsive rules include 370, 600, 700, 768, 900, 1024, 1050, 1100, 1250 and 1440px conditions. Grid, spacing, dimensions and breakpoints were preserved in this pass.

## Files changed in this pass

- `frontend/src/app/globals.css`: semantic palette, compatible aliases, shared control states, public navigation/footer colors, pastel surfaces, focus and reduced-motion rules.
- `frontend/src/components/home/OfficialRepresentationSection.tsx`: styling classes for orange labels, timeline icon and border markers only.
- `frontend/src/components/FestivalArchive.tsx`: scoped styling hook and orange calendar icon class only.
- This review document.

Earlier working-tree edits (logo, contact page, routes, contact details and other user work) were preserved.

## Palette before and after

| Role | Before this pass | Updated |
| --- | --- | --- |
| Primary action | Berry #BD1E62 | Muted rose #B84B60 |
| Action hover | #9D1756 | #9D3B50 |
| Brand orange | #E9AA37 | #F5A623 |
| Main canvas | #FFFBF8 | Warm cream #FFF8F1 |
| Main text | #382735 | Cocoa #493534 |
| Secondary text | #62505D | #66514F |
| Muted text | #705A67 | #765E5B |
| Lavender | #EEE6FA | #EDE3F8 |
| Peach | #FFE9D7 | #FFE9D7, preserved |
| Shopping pink | #FCE2E7 | #FCE2E9 |
| Events mint | #E0F1E8 | Preserved |
| Footer | Berry gradient | Solid deeper rose #893B50 |

Orange is decorative brand color, not the default text color. Small orange labels use darker #925500 for contrast. White cards, hero images and carousel image overlays remain. Club rose artwork and yellow lettering remain; its gradient becomes a solid rose. Navigation keeps its rose identity with an orange divider/expanded-item indicator. Primary controls use rose/white and consistent hover/focus treatments without changing their dimensions. Festival/certificate content, dates, links and completed statuses are unchanged.

## Accessibility checks

Calculated sRGB contrast for explicit solid-color pairs:

| Pair | Ratio |
| --- | --- |
| White / primary rose | 4.98:1 |
| Deep rose / cream | 7.91:1 |
| Cocoa / cream | 10.83:1 |
| Muted text / lavender | 4.81:1 |
| Footer copy / deeper rose | 6.93:1 |
| Footer gold / deeper rose | 5.86:1 |
| Dark orange label / white | 5.96:1 |

These checks exceed WCAG AA normal-text contrast for the listed pairs; they are not a full browser accessibility audit. Focus uses a visible outline; navigation and footer use light focus outlines on rose. Existing reduced-motion handling is preserved and extended to shared controls.

## Verification and limitations

- Standalone TypeScript check passed before webpack generated its stricter route types.
- Full ESLint: zero errors, five warnings in existing files (one unused variable and four native img warnings).
- Targeted lint for both touched TSX files: passed with no warnings.
- Diff whitespace checks: passed.
- Local HTTP checks: Home, Contact, Shop and About returned 200.
- Default Turbopack production build compiled and passed TypeScript, then failed prerendering `/_global-error` with Next.js `Expected workStore to be initialized` invariant.
- Webpack production build compiled, then failed generated route type validation on existing `/signin` searchParams: synchronous object props do not satisfy Next.js Promise-based PageProps. Authentication files were not changed.
- No frontend test script is defined. No dependencies were added.
- Browser visual/interaction checks at desktop, tablet and mobile sizes could not be completed: Computer Use stopped because it could not confidently identify the current Windows Chrome URL. Responsive CSS was reviewed statically; no claim is made that runtime hover, carousel, focus, overflow or layout checks passed.
- Existing product images/content were not replaced. Any pre-existing remote image failures remain outside this color-only pass.

Production remains unchanged. Resolve the build blockers and complete responsive browser review before release.
