"use client";

import Link from 'next/link';

import type { ShopProduct } from '@/lib/shopCatalog';
import LiveProductGrid from '@/components/LiveProductGrid';
import { ExternalLink, Store } from 'lucide-react';
import { getStoreMeta, type ShopStore } from '@/lib/shopCatalog';

const ShopCatalogPage = ({ products, category }: { products: ShopProduct[] | null; category?: string }) => (
  <main className="min-h-screen bg-[var(--kc-bg)] px-4 py-8 text-[var(--kc-text)] lg:px-8">
    <section className="mx-auto kc-content">
      <div className="relative overflow-hidden rounded-[1.5rem] border border-[var(--kc-border)] bg-[var(--kc-border-soft)] shadow-[0_12px_30px_rgba(48,37,45,0.06)]" style={{ backgroundImage: "url('/assets/korean%20shopping.png')", backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.9)_0%,rgba(255,255,255,0.72)_48%,rgba(255,255,255,0.12)_100%)]" aria-hidden="true" />
        <div className="relative p-6 sm:min-h-[330px] sm:p-10">
          <p className="kc-eyebrow">SHOP KOREA</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">{category === 'beauty' ? 'Korean beauty, your way.' : 'Your gateway to Korean shopping.'}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[var(--kc-text-secondary)]">Discover Korean food, lifestyle and beauty products, then continue securely on the specialist store that sells them.</p>
        </div>
      </div>

      <div className={`mt-6 grid gap-5 ${category === 'beauty' ? 'md:grid-cols-1' : 'md:grid-cols-2'}`}>
        {((category === 'beauty' ? ['moa_beauty'] : ['koreanshop', 'moa_beauty']) as ShopStore[]).map((storeKey) => {
          const store = getStoreMeta(storeKey);
          return (
            <a key={storeKey} href={store.url} target="_blank" rel="noopener noreferrer" className="group rounded-[1.5rem] border border-[var(--kc-border)] bg-white p-6 shadow-[0_8px_22px_rgba(48,37,45,0.04)] transition hover:border-[var(--kc-blue-700)] hover:shadow-[0_12px_30px_rgba(166,83,0,0.1)] sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div><p className="kc-eyebrow">{store.label}</p><h2 className="mt-2 text-3xl font-black">{store.name}</h2></div>
                <Store className="h-6 w-6 text-[var(--kc-blue-700)]" aria-hidden="true" />
              </div>
              <p className="mt-4 max-w-xl leading-7 text-[var(--kc-text-secondary)]">{store.description}</p>
              <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--kc-blue-700)] px-5 py-3 text-sm font-black text-white">Open {store.name} <ExternalLink className="h-4 w-4" /></span>
            </a>
          );
        })}
      </div>
      <section className="culture-home mt-10 rounded-xl border border-[var(--kc-border)] bg-white p-4 sm:p-6" aria-labelledby="catalog-heading"><nav aria-label="Product categories" className="mb-5 flex flex-wrap gap-3 text-sm font-semibold"><Link href="/shop" aria-current={!category ? 'page' : undefined} className="rounded-full border border-[var(--kc-border)] px-4 py-2 text-[var(--kc-action-deep)]">All products</Link><Link href="/shop?category=beauty" aria-current={category === 'beauty' ? 'page' : undefined} className="rounded-full border border-[var(--kc-border)] px-4 py-2 text-[var(--kc-action-deep)]">Cosmetics &amp; K-Beauty</Link></nav><h2 id="catalog-heading" className="mb-6 text-2xl font-bold">{category === 'beauty' ? 'Cosmetics & K-Beauty' : 'Explore products'}</h2><LiveProductGrid initialProducts={products} category={category} /></section>
    </section>
  </main>
);

export default ShopCatalogPage;
