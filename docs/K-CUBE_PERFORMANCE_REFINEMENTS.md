# Lighthouse follow-up — 26 October 2026

The supplied online report identifies image delivery (~39 KiB estimated savings), legacy JavaScript (~13.4 KiB), render-blocking requests, two back/forward-cache failure reasons and one long task. The two cache reasons and long-task attribution were not supplied, so these causes remain unconfirmed.

## Changes

- Added intermediate responsive image widths (360, 480 and 560px, plus 1440px) to avoid the previous 640px minimum device-width jump for certificate previews.
- Corrected the certificate preview `sizes` to its capped container and mobile gutter. Kept quality 75 for readable certificate text and retained the full-resolution modal.
- Updated hero image sizes to the actual capped two-column layout and mobile gutters, and editorial photo sizes to their 45% share of each card. Used quality 70 for these photos, explicitly allowlisted alongside 75 in Next configuration.
- Scoped Leaflet CSS to CommunityMapPanel instead of importing it on every page.
- Removed the unused Geist Mono font registration. The existing CSS monospace stack already uses system fonts; Geist Sans is retained.

## Verification

Frontend type-check, targeted lint and production build passed. Local production HTTP checks verified:

- Homepage stylesheets contain no `.leaflet-container` rules; admin community-map stylesheets retain them.
- Homepage CSS no longer includes the unused Geist Mono font variable.
- Certificate srcset includes 480px, with corrected sizes metadata.
- A real `/_next/image` request for 480px returned HTTP 200 and a valid 480px WebP.
- With the same WebP quality of 75, local certificate encoding measured 42,580 bytes at 640px and 28,434 bytes at 480px (about 33% less). Device pixel ratio can legitimately require larger variants; this is not a guarantee that every device downloads the 480px version.

The live chunk identified in the report was read and includes guarded compatibility implementations for the reported Array/Object/String methods. Those were retained to preserve browser compatibility. [Next browser support documentation](https://nextjs.org/docs/architecture/supported-browsers) describes its compatibility policy.

The live homepage currently returns `private, no-cache, no-store, max-age=0, must-revalidate`. This alone does not prove the reported cache failures: [Chrome's no-store/bfcache documentation](https://developer.chrome.com/docs/web-platform/bfcache-ccns) describes conditional eligibility. No global caching override was added to authenticated or live-data responses. The report's expanded bfcache reasons are needed for a precise follow-up.

No fresh Lighthouse score or Core Web Vitals result is claimed. No production deployment was performed.
