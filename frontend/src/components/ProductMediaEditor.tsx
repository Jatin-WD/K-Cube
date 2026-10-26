'use client';
/* eslint-disable @next/next/no-img-element */

import { useState, type ChangeEvent } from 'react';
import api from '@/lib/api';

type Media = { filename: string; url: string; size: number };
type Props = { image: string; gallery: string[]; onChange: (image: string, gallery: string[]) => void; onBusyChange?: (busy: boolean) => void };

export default function ProductMediaEditor({ image, gallery, onChange, onBusyChange }: Props) {
  const [library, setLibrary] = useState<Media[]>([]);
  const [opened, setOpened] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const errorText = (error: unknown) => {
    const response = error as { response?: { data?: { error?: { message?: string } } } };
    return response.response?.data?.error?.message || 'Unable to update images. Please retry.';
  };
  const loadLibrary = async () => {
    try { setLibrary((await api.get('/admin/kfood/media')).data.data); setOpened(true); }
    catch (error) { setMessage(errorText(error)); }
  };
  const upload = async (event: ChangeEvent<HTMLInputElement>, target: 'main' | 'gallery') => {
    const files = Array.from(event.target.files || []);
    event.target.value = '';
    if (!files.length) return;
    if (target === 'gallery' && gallery.length + files.length > 10) { setMessage('Gallery supports up to 10 images.'); return; }
    setBusy(true); onBusyChange?.(true); setMessage('Uploading images…');
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) throw new Error('Choose PNG, JPEG or WebP files up to 5 MB each.');
        const result = await api.post('/admin/kfood/media', file, { headers: { 'Content-Type': file.type } });
        uploaded.push(result.data.data.url);
      }
      setMessage('Images uploaded. Save the product to apply these changes.');
    } catch (error) {
      setMessage(error instanceof Error && !('response' in error) ? error.message : errorText(error));
    } finally {
      if (uploaded.length) onChange(target === 'main' ? uploaded[0] : image, target === 'gallery' ? [...new Set([...gallery, ...uploaded])] : gallery);
      setBusy(false); onBusyChange?.(false);
      if (opened) void loadLibrary();
    }
  };
  const addGallery = (url: string) => {
    if (gallery.includes(url)) return;
    if (gallery.length >= 10) { setMessage('Gallery supports up to 10 images.'); return; }
    onChange(image, [...gallery, url]);
  };
  const removeMedia = async (item: Media) => {
    if (!window.confirm('Delete this unused image permanently from the media library?')) return;
    try { await api.delete(`/admin/kfood/media/${item.filename}`); await loadLibrary(); setMessage('Unused image deleted.'); }
    catch (error) { setMessage(errorText(error)); }
  };

  return <section className="rounded-xl border border-white/15 p-4" aria-label="Product images">
    <h3 className="text-sm font-bold text-white">Product images</h3>
    <p className="mt-1 text-xs leading-5 text-slate-300">PNG, JPEG or WebP · up to 5 MB each. Images are optimized on upload. First image is the cover; add up to 10 gallery images.</p>
    <div className="mt-3 flex flex-wrap gap-3">
      <label className="cursor-pointer rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900">Upload cover<input aria-label="Upload product cover" disabled={busy} className="sr-only" type="file" accept="image/png,image/jpeg,image/webp" onChange={(event) => void upload(event, 'main')} /></label>
      <label className="cursor-pointer rounded-lg bg-white px-3 py-2 text-xs font-bold text-slate-900">Upload gallery<input aria-label="Upload product gallery" disabled={busy} className="sr-only" type="file" multiple accept="image/png,image/jpeg,image/webp" onChange={(event) => void upload(event, 'gallery')} /></label>
      <button type="button" disabled={busy} onClick={() => void loadLibrary()} className="rounded-lg border border-white/30 px-3 py-2 text-xs font-bold text-white">Media library</button>
    </div>
    <label className="mt-3 block text-xs text-slate-200">Cover image URL<input aria-label="Cover image URL" disabled={busy} value={image} onChange={(event) => onChange(event.target.value, gallery)} className="mt-1 block w-full rounded-lg border border-white/20 bg-black/20 px-3 py-2 text-sm text-white" placeholder="Upload above, select from library, or paste HTTPS URL" /></label>
    <div className="mt-3 flex flex-wrap gap-3">
      {image && <div><img src={image} alt="Product cover preview" className="h-24 w-24 rounded-lg bg-white object-contain" /><button type="button" disabled={busy} onClick={() => onChange('', gallery)} className="mt-1 text-xs text-white underline">Remove cover</button></div>}
      {gallery.map((url, index) => <div key={url} className="w-24"><img src={url} alt={`Gallery preview ${index + 1}`} className="h-24 w-24 rounded-lg bg-white object-contain" /><div className="mt-1 flex flex-wrap gap-2 text-xs text-white"><button type="button" disabled={busy} onClick={() => onChange(url, gallery)} className="underline">Set cover</button><button type="button" disabled={busy} onClick={() => onChange(image, gallery.filter((entry) => entry !== url))} className="underline">Remove</button>{index > 0 && <button type="button" disabled={busy} className="underline" onClick={() => { const next = [...gallery]; [next[index - 1], next[index]] = [next[index], next[index - 1]]; onChange(image, next); }}>Move left</button>}</div></div>)}
    </div>
    {opened && <div className="mt-4 border-t border-white/15 pt-3"><div className="flex justify-between text-xs font-bold text-white"><h4>Uploaded media</h4><button type="button" onClick={() => setOpened(false)}>Close library</button></div><div className="mt-3 grid max-h-72 grid-cols-2 gap-3 overflow-auto sm:grid-cols-3">{library.map((item) => <div key={item.filename} className="rounded-lg border border-white/15 p-2"><img src={item.url} alt="Uploaded product image" className="h-24 w-full bg-white object-contain" /><div className="mt-2 flex flex-wrap gap-2 text-xs text-white"><button type="button" disabled={busy} className="underline" onClick={() => onChange(item.url, gallery)}>Set cover</button><button type="button" disabled={busy} className="underline" onClick={() => addGallery(item.url)}>Add to gallery</button><button type="button" disabled={busy || item.url === image || gallery.includes(item.url)} className="underline disabled:opacity-40" onClick={() => void removeMedia(item)}>Delete unused</button></div></div>)}</div>{!library.length && <p className="mt-2 text-xs text-slate-300">No uploaded images yet.</p>}</div>}
    <p role="status" className="mt-3 text-xs leading-5 text-slate-200">{message}</p>
  </section>;
}
