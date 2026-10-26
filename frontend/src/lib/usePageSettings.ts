'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
export type ManagedPageCard = { title: string; description: string; href: string; cta: string };
export type PageSettings = Partial<Record<'badge' | 'title' | 'subtitle' | 'description' | 'primaryCta' | 'primaryHref', string>> & { cards?: ManagedPageCard[] };
export const safePageHref = (href: string) => /^(\/(?!\/)|https:\/\/|mailto:)/i.test(href) ? href : '/';
export function usePageSettings(slug: string, language: string) {
  const [settings, setSettings] = useState<PageSettings>({});
  useEffect(() => {
    // Each page/language has its own fallback while its CMS settings load.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings({});
    const controller = new AbortController();
    api.get(`/learning/cms/public/${encodeURIComponent(slug)}`, { signal: controller.signal }).then(response => {
      const block = response.data.data?.blocks?.find((item: { blockKey: string }) => item.blockKey === 'page-settings');
      const value = block?.[language === 'ko' ? 'contentKo' : language === 'hi' ? 'contentHi' : 'contentEn'];
      if (value && typeof value === 'object') {
        const settings: PageSettings = Object.fromEntries(Object.entries(value).filter(([key, value]) => ['badge', 'title', 'subtitle', 'description', 'primaryCta', 'primaryHref'].includes(key) && typeof value === 'string'));
        if (Array.isArray(value.cards) && value.cards.length <= 24 && value.cards.every((card: ManagedPageCard) => card && ['title', 'description', 'href', 'cta'].every(key => typeof card[key as keyof ManagedPageCard] === 'string'))) settings.cards = value.cards;
        setSettings(settings);
      }
    }).catch(() => {});
    return () => controller.abort();
  }, [slug, language]);
  return settings;
}
