'use client';

import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react';
import { homeMotion } from '@/lib/homeMotion';

/** Progressive enhancement: SSR and failed/unsupported JS leave every item visible. */
export default function HomeMotion({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scope = root.current;
    if (!scope || !('IntersectionObserver' in window) || !('animate' in HTMLElement.prototype)) return;
    const reduced = window.matchMedia(homeMotion.reducedQuery);
    const seen = new WeakSet<Element>();
    const animations = new Map<HTMLElement, Animation>();

    const stopAnimation = (element: HTMLElement) => {
      animations.get(element)?.cancel();
      animations.delete(element);
    };
    const animate = (element: HTMLElement, frames: Keyframe[], delay = 0) => {
      if (reduced.matches || document.hidden || element.contains(document.activeElement)) return;
      stopAnimation(element);
      const animation = element.animate(frames, { duration: homeMotion.duration, delay, easing: homeMotion.easing });
      animations.set(element, animation);
      animation.onfinish = () => animations.delete(element);
    };
    const reveal = (element: HTMLElement, delay = 0) => animate(element, [
      { opacity: 1, transform: `translateY(${homeMotion.distance}px)` },
      { opacity: 1, transform: 'translateY(0)' },
    ], delay);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const element = entry.target as HTMLElement;
        if (!entry.isIntersecting) {
          seen.delete(element);
          animations.forEach((_, target) => {
            if (element.contains(target)) stopAnimation(target);
          });
          return;
        }
        if (seen.has(element)) return;
        seen.add(element);
        if (element.classList.contains('culture-category')) {
          const index = [...scope.querySelectorAll('.culture-category')].indexOf(element);
          reveal(element, index * homeMotion.stagger);
          const mark = element.querySelector<HTMLElement>('.culture-category-mark');
          if (mark) animate(mark, [
            { transform: 'translateY(8px) rotate(-8deg)' },
            { transform: 'translateY(0) rotate(-8deg)' },
          ], index * homeMotion.stagger);
        } else {
          // Club only: no overlays or motion around the official certificate.
          element.querySelectorAll<HTMLElement>('.culture-community-copy > *').forEach((item, index) => reveal(item, index * homeMotion.stagger));
          const badge = element.querySelector<HTMLElement>('.culture-community-art > div');
          if (badge) animate(badge, [{ transform: 'translateY(12px) rotate(-12deg) scale(.96)' }, { transform: 'translateY(0) rotate(-9deg) scale(1)' }]);
          const heart = element.querySelector<HTMLElement>('.culture-big-heart');
          const star = element.querySelector<HTMLElement>('.culture-community-star');
          if (heart) animate(heart, [{ transform: 'rotate(14deg) translateY(0)' }, { transform: 'rotate(14deg) translateY(-10px)', offset: 0.5 }, { transform: 'rotate(14deg) translateY(0)' }]);
          if (star) animate(star, [{ transform: 'rotate(-10deg)' }, { transform: 'rotate(0)' }]);
        }
      });
    }, { threshold: 0.15 });
    scope.querySelectorAll('.culture-category,.culture-community').forEach((element) => observer.observe(element));

    const preferenceChanged = () => {
      if (reduced.matches) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
    };
    const visibilityChanged = () => {
      if (document.hidden) {
        animations.forEach((animation) => animation.cancel());
        animations.clear();
      }
    };
    const focused = (event: FocusEvent) => {
      animations.forEach((_, element) => {
        if (event.target instanceof Node && element.contains(event.target)) stopAnimation(element);
      });
    };
    reduced.addEventListener('change', preferenceChanged);
    document.addEventListener('visibilitychange', visibilityChanged);
    scope.addEventListener('focusin', focused);
    return () => {
      observer.disconnect();
      reduced.removeEventListener('change', preferenceChanged);
      document.removeEventListener('visibilitychange', visibilityChanged);
      scope.removeEventListener('focusin', focused);
      animations.forEach((animation) => animation.cancel());
    };
  }, []);

  return <div ref={root} className="culture-home" style={{ '--kc-parallax-distance': `${homeMotion.parallax}px` } as CSSProperties}>{children}</div>;
}
