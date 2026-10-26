# K-CUBE motion prototype review

## Scope and audit

Implemented locally; not deployed. This pass is the requested initial prototype, not a full rollout.

Reviewed CultureHome, the existing responsive refinement stylesheet, public layout, carousel, category and Club markup, reduced-motion rules, package dependencies and frontend agent instructions. Existing hover transforms and focus outlines were retained. Framer Motion and GSAP are installed, but neither is imported for this prototype: native Intersection Observer, Web Animations and requestAnimationFrame are sufficient.

## Files modified

- frontend/src/components/home/HomeMotion.tsx (new): progressive enhancement root with one observer, one-shot entrances, focus cancellation and scoped parallax lifecycle.
- frontend/src/lib/homeMotion.ts (new): central duration, stagger, distance, easing and responsive preferences; bounded parallax calculation.
- frontend/src/components/home/CultureHome.tsx: replaces the existing root div with HomeMotion, which renders the same root div/class; adds one decorative Hangul/diamond span in discovery.
- frontend/src/app/home-refinements.css: isolated prototype decoration and responsive/reduced-motion rules; category Hangul hover displacement refined to 5px.
- frontend/tests/home-motion.test.mjs (new): seven behavior tests using Node's test runner, TypeScript transpilation and a mocked DOM/observer environment, without installing dependencies.
- This report.

## Prototype effects

1. Category discovery: once-per-mount 480ms entrances with 12px displacement and 80ms stagger. Existing card/arrow hover states remain; Hangul lifts 5px on hover-capable devices.
2. K-CUBE Club: short, once-only heart lift, star turn and staggered copy entrance. No infinite animation, palette change or altered CTA.
3. Discovery background: one oversized ?? (discovery) at 6% opacity, alongside a small outlined logo-inspired diamond. It is aria-hidden, non-interactive and behind the section content. Desktop scroll displacement is bounded to +/-12px (24px total).

No new product imagery, cultural stereotypes or fabricated features were introduced. Hero product imagery, certificate, festival dates/status, footer, routes and business logic are untouched by this prototype. No new animation dependencies or deployment configuration changes.

## Accessibility and performance behavior

All content is fully visible in server-rendered HTML and without animation support; there is no initial hidden CSS state or delayed access gate. Entrance keyframes start at 78% opacity, so content never disappears. Animation never controls link availability.

Reduced-motion users receive no entrance, floating, stagger or parallax animation. Live preference changes cancel Web Animations and remove parallax styles/listeners. Keyboard focus cancels motion on the focused card/copy container. Background tabs cancel active motion. Observers, listeners, queued frames and animation handles are cleaned up on unmount.

Parallax runs only at >=1024px and only while its decorative target intersects the viewport. Scroll events are passive and coalesced into one requested frame. The handler batches geometry reads before style writes and measures the stationary parent to avoid transform feedback. There is no continuous requestAnimationFrame loop, global scroll hijack, content parallax or permanent will-change allocation.

At 360/390/430/768px, the static smaller Hangul decoration remains but scroll-linked processing is disabled. At 1024px and larger, desktop activation is eligible. Responsive media rules were statically inspected; actual browser geometry and smoothness have not been measured.

## Verification

- Seven lifecycle/behavior tests passed: displacement clamp; reduced-motion visibility; one-shot reveal and preference-change cancellation; mobile parallax disabled; offscreen/unmount listener cleanup; focus cancellation; background-tab cancellation.
- Command: node --test --test-isolation=none frontend/tests/home-motion.test.mjs. Default isolated test execution is blocked by sandbox child-process EPERM, so the built-in in-process mode is used.
- TypeScript check passed.
- Full ESLint: zero errors, one existing KCubePage unused-variable warning.
- Whitespace checks passed.
- Homepage HTTP 200; server HTML includes the decorative hook and no hidden prototype state.
- Production build attempted: stopped with Windows EPERM while unlinking frontend/.next/server/app/contact. No destructive cleanup attempted. Earlier builds also have a documented Next.js /_global-error prerender blocker.
- Browser tool returned no attached browser sessions. No before/after screenshots, recordings, real-device smoothness, overlap or viewport measurements were possible.

## Rollout decision

Do not extend this prototype to hero/editorial/products/festival/rewards yet. The behavior checks pass, but visual quality, cropping, contrast during entry and scrolling need browser review at 360, 390, 430, 768, 1024 and 1440px. Verify reduced-motion toggling, keyboard traversal and long/mobile pages before extension. The certificate and footer should remain minimal even after rollout. Core Web Vitals and frame pacing are unmeasured, not guaranteed.


## Visibility refinement after user review

The first prototype was too subtle to notice. Updated to 600ms entrances, 100ms stagger, 20px card displacement, explicit Hangul entrances, a Club badge entrance and a 10px once-per-entry heart lift. Entrances replay only after leaving and re-entering the viewport; they do not loop while visible. Offscreen exit cancels active entrance animations. Decorative background opacity is now 8%, with desktop parallax bounded to +/-15px. Reduced-motion behavior remains unchanged. Eight behavior tests pass, including replay/exit cancellation; TypeScript and targeted lint pass. Real browser motion remains unverified.


## Forced-reflow refinement

Replaced the JavaScript parallax frame/geometry loop with a feature-detected native CSS view timeline. HomeMotion no longer attaches scroll/resize listeners or reads getBoundingClientRect. Desktop movement remains bounded by the shared 15px intensity; mobile, unsupported browsers and reduced motion use static decoration. Added the Next.js data-scroll-behavior hint matching the existing smooth-scroll stylesheet. Seven updated motion tests pass, with the DOM geometry mock throwing if the controller attempts a synchronous layout measurement. The Lighthouse screenshot attributed 258ms to an unknown source; this change removes an identified risk but does not prove that all reported reflow time is resolved. Browser profiling remains required.
