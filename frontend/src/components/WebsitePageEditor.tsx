'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { pages, type PageKey } from '@/lib/kcubeContent';
import type { PageSettings } from '@/lib/usePageSettings';

export default function WebsitePageEditor({ pageKey, href }: { pageKey: PageKey; href: string }) {
  const [language, setLanguage] = useState<'en' | 'ko' | 'hi'>('en');
  const [form, setForm] = useState<PageSettings>({});
  const [pageRecord, setPageRecord] = useState<Record<string, unknown> | null>(null);
  const [pageId, setPageId] = useState<number | null>(null);
  const [block, setBlock] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const slug = pageKey === 'learning' ? 'korean-learning' : pageKey === 'apply' ? 'apply-for-manpower' : pageKey;
  useEffect(() => {
    let cancelled = false;
    // Reset request feedback when the selected server resource changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    setStatus('');
    Promise.all([api.get('/learning/cms/pages'), api.get('/admin/cms/blocks')]).then(([pageResponse, blockResponse]) => {
      if (cancelled) return;
      const page = pageResponse.data.data.find((item: { slug: string }) => item.slug === slug);
      const saved = blockResponse.data.data.find((item: { page_id: number; block_key: string }) => item.page_id === page?.id && item.block_key === 'page-settings');
      setPageRecord(page || null); setPageId(page?.id || null); setBlock(saved || null);
      let content = saved?.[`content_${language}`];
      if (typeof content === 'string') { try { content = JSON.parse(content); } catch { content = {}; } }
      const defaults = pages[pageKey];
      setForm({ badge: defaults.badge[language], title: defaults.title[language], subtitle: defaults.subtitle[language], description: defaults.description[language], primaryCta: defaults.primaryCta[language], primaryHref: defaults.primaryHref, cards: defaults.cards.map(card => ({ title: card.title[language], description: card.description[language], cta: card.cta[language], href: card.href })), ...(pageKey === 'apply' ? { badge: 'K-CUBE MANPOWER', title: "Build Korea?s culture ecosystem with us.", description: 'Join the people behind K-CUBE events, Korean culture content, learning, community programs and operations.', primaryCta: 'Apply now', primaryHref: '/apply-for-manpower#manpower-application' } : {}), ...(content || {}) });
    }).catch(() => { if (!cancelled) setStatus('Unable to load page settings. Retry before editing.'); }).finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [pageKey, slug, language]);
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (saving || loading) return;
    if (!form.title?.trim() || !/^(\/(?!\/)|https:\/\/|mailto:)/i.test(form.primaryHref || '')) { setStatus('Enter a title and a valid site, HTTPS or email link.'); return; }
    if (form.cards?.some(card => !card.title.trim() || !/^(\/(?!\/)|https:\/\/|mailto:)/i.test(card.href))) { setStatus('Each card needs a title and a valid destination.'); return; }
    setSaving(true);
    try {
      let id = pageId;
      if (!id) {
        const response = await api.post('/learning/cms/pages', { slug, pageType: 'landing', titleEn: pages[pageKey].title.en, status: 'published' });
        id = response.data.data.id; setPageId(id);
      }
      if (id && pageRecord && pageRecord.status !== 'published') await api.patch(`/learning/cms/pages/${id}`, { ...pageRecord, id, status: 'published' });
      const payload = { ...(block || {}), page_id: id, block_key: 'page-settings', block_type: 'hero', sort_order: 0, status: 'published', [`content_${language}`]: form };
      const response = block?.id ? await api.patch(`/admin/cms/blocks/${block.id}`, payload) : await api.post('/admin/cms/blocks', payload);
      setBlock({ ...payload, id: block?.id || response.data.data.id });
      setStatus('Published. Open the website page to verify your changes.');
    } catch { setStatus('Could not publish page settings. Your changes remain in the editor.'); }
    finally { setSaving(false); }
  };
  return <section className="rounded-xl border border-[#dce6f0] bg-white p-4 sm:p-6"><div className="flex flex-wrap items-center justify-between gap-3"><div><h3 className="text-xl font-black">Page introduction &amp; main action</h3><p className="mt-1 text-sm text-[#486581]">Edit the live page text in English, Korean or Hindi. Existing page sections remain intact.</p></div><a href={href} target="_blank" rel="noreferrer" className="rounded-lg border px-3 py-2 text-sm font-bold">Preview page ↗</a></div><form className="mt-5 space-y-4" onSubmit={save}><label className="grid gap-2 text-sm font-bold">Language<select disabled={saving} value={language} onChange={event => setLanguage(event.target.value as typeof language)} className="rounded-lg border bg-white px-3 py-2"><option value="en">English</option><option value="ko">Korean</option><option value="hi">Hindi</option></select></label>{(['badge', 'title', 'subtitle', 'description', 'primaryCta', 'primaryHref'] as const).filter(key => pageKey !== 'apply' || key !== 'subtitle').map(key => <label key={key} className="grid gap-2 text-sm font-bold">{{ badge: 'Small label', title: 'Main heading', subtitle: 'Subtitle', description: 'Description', primaryCta: 'Button label', primaryHref: 'Button destination' }[key]}<textarea disabled={loading || saving} rows={key === 'description' ? 3 : 2} maxLength={key === 'description' ? 3000 : 600} className="w-full rounded-lg border border-[#ccd9e6] bg-white p-3 text-sm text-[#102a43]" value={form[key] || ''} onChange={event => setForm(current => ({ ...current, [key]: event.target.value }))} /></label>)}{pageKey !== 'apply' && pageKey !== 'learning' ? <fieldset className="space-y-3 rounded-xl border p-4"><legend className="px-2 font-black">Page cards</legend>{form.cards?.map((card, index) => <div key={index} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-2">{(['title', 'description', 'cta', 'href'] as const).map(key => <label key={key} className="grid gap-1 text-sm font-bold">{key}<input disabled={loading || saving} maxLength={1000} className="min-w-0 rounded-lg border bg-white p-2 text-sm" value={card[key]} onChange={event => setForm(current => ({ ...current, cards: current.cards?.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: event.target.value } : item) }))} /></label>)}<button type="button" disabled={saving} onClick={() => setForm(current => ({ ...current, cards: current.cards?.filter((_, itemIndex) => itemIndex !== index) }))} className="rounded-lg border px-3 py-2 text-sm font-bold">Remove card</button></div>)}<button type="button" disabled={loading || saving || (form.cards?.length || 0) >= 24} onClick={() => setForm(current => ({ ...current, cards: [...(current.cards || []), { title: '', description: '', cta: 'Explore', href: '/' }] }))} className="rounded-lg border px-3 py-2 text-sm font-bold">Add card</button></fieldset> : null}<p role="status" className="text-sm font-bold">{loading ? 'Loading page settings…' : status}</p><button disabled={saving || loading || status.startsWith('Unable')} className="rounded-lg bg-[#0b4eae] px-4 py-3 text-sm font-bold text-white disabled:opacity-50">{saving ? 'Publishing…' : 'Publish page text'}</button></form></section>;
}
