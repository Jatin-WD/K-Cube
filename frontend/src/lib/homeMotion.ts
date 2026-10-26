/** Shared intensity limits for the deliberately small homepage motion prototype. */
export const homeMotion = {
  duration: 600,
  stagger: 100,
  distance: 20,
  parallax: 15,
  desktopQuery: '(min-width: 1024px)',
  reducedQuery: '(prefers-reduced-motion: reduce)',
  easing: 'cubic-bezier(.2,.7,.2,1)',
} as const;
