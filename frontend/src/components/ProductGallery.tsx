'use client';
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';

export default function ProductGallery({ image, gallery = [], title }: { image: string; gallery?: string[]; title: string }) {
  const images = [...new Set([image, ...gallery].filter(Boolean))];
  const [selected, setSelected] = useState(0);
  const [failed, setFailed] = useState(false);
  const activeIndex = Math.min(selected, images.length - 1);
  return <div>
    <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border border-[var(--kc-border)] bg-white">
      {!images.length || failed ? <p className="text-sm text-[var(--kc-copy)]">Image unavailable</p> : <img src={images[activeIndex]} alt={`${title}${selected ? ` — image ${selected + 1}` : ''}`} className="h-full w-full object-contain" onError={() => setFailed(true)} />}
    </div>
    {images.length > 1 && <div className="mt-3 flex flex-wrap gap-2" aria-label="Product gallery">{images.map((url, index) => <button key={url} type="button" aria-label={`View product image ${index + 1}`} aria-pressed={activeIndex === index} onClick={() => { setSelected(index); setFailed(false); }} className={`h-16 w-16 overflow-hidden rounded-lg border-2 bg-white p-1 ${activeIndex === index ? 'border-[var(--kc-action)]' : 'border-[var(--kc-border)]'}`}><img src={url} alt="" loading="lazy" className="h-full w-full object-contain" /></button>)}</div>}
  </div>;
}
