"use client";

import { ExternalLink, Store } from 'lucide-react';
import { getStoreMeta, type ShopStore } from '@/lib/shopCatalog';

const ShopCatalogPage = () => (
  <main className="min-h-screen bg-[#eef4f9] px-4 py-8 text-[#102a43] lg:px-8">
    <section className="mx-auto max-w-[1320px]">
      <div className="rounded-[1.5rem] border border-[#dce6f0] bg-white p-6 shadow-[0_12px_30px_rgba(16,42,67,0.06)] sm:p-10">
        <p className="kc-eyebrow">SHOP KOREA</p>
        <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">Your gateway to Korean shopping.</h1>
        <p className="mt-5 max-w-2xl text-base leading-7 text-[#486581]">Discover Korean food, lifestyle and beauty products, then continue securely on the specialist store that sells them.</p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        {(['koreanshop', 'moa_beauty'] as ShopStore[]).map((storeKey) => {
          const store = getStoreMeta(storeKey);
          return (
            <a key={storeKey} href={store.url} target="_blank" rel="noopener noreferrer" className="group rounded-[1.5rem] border border-[#dce6f0] bg-white p-6 shadow-[0_8px_22px_rgba(16,42,67,0.04)] transition hover:border-[#0b4eae] hover:shadow-[0_12px_30px_rgba(11,78,174,0.1)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div><p className="kc-eyebrow">{store.label}</p><h2 className="mt-2 text-3xl font-black">{store.name}</h2></div>
                <Store className="h-6 w-6 text-[#0b4eae]" aria-hidden="true" />
              </div>
              <p className="mt-4 max-w-xl leading-7 text-[#486581]">{store.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b4eae] px-5 py-3 text-sm font-black text-white">Open {store.name} <ExternalLink className="h-4 w-4" /></span>
            </a>
          );
        })}
      </div>
    </section>
  </main>
);

export default ShopCatalogPage;
