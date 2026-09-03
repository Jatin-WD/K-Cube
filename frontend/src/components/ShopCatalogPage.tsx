"use client";

import Link from 'next/link';
import { ArrowRight, ExternalLink, Search, Sparkles } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { fetchLiveShopProducts } from '@/lib/shopApi';
import { getStoreMeta, shopCategories, shopProducts as staticShopProducts, type ShopProduct, type ShopStore } from '@/lib/shopCatalog';
import { useAppStore } from '@/store/useAppStore';

const PAGE_SIZE = 12;
type SortMode = 'az' | 'price-low' | 'price-high';
const storeForProduct = (product: ShopProduct): ShopStore => product.store ?? 'koreanshop';

const ExternalStoreLink = ({ product, className }: { product: ShopProduct; className?: string }) => {
  const store = getStoreMeta(storeForProduct(product));
  return <a href={product.externalProductUrl ?? store.url} target="_blank" rel="noopener noreferrer" className={className}>Visit {store.name} <ExternalLink className="h-4 w-4" /></a>;
};

const ShopCatalogPage = () => {
  const language = useAppStore((state) => state.language);
  const [products, setProducts] = useState<ShopProduct[]>(staticShopProducts);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeStore, setActiveStore] = useState<'all' | ShopStore>('all');
  const [sortMode, setSortMode] = useState<SortMode>('az');
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    fetchLiveShopProducts().then((items) => { if (mounted && items.length) setProducts(items); }).catch(() => undefined);
    return () => { mounted = false; };
  }, []);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'all' || product.categoryKey === activeCategory;
      const matchesStore = activeStore === 'all' || storeForProduct(product) === activeStore;
      const searchable = [product.title.en, product.subtitle.en, product.category.en].join(' ').toLowerCase();
      return matchesCategory && matchesStore && (!q || searchable.includes(q));
    }).sort((a, b) => sortMode === 'price-low' ? a.price - b.price : sortMode === 'price-high' ? b.price - a.price : a.title.en.localeCompare(b.title.en));
  }, [activeCategory, activeStore, products, query, sortMode]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const selectCategory = (value: string) => { setActiveCategory(value); setPage(1); };
  const selectStore = (value: 'all' | ShopStore) => { setActiveStore(value); setPage(1); };

  return (
    <main className="min-h-screen bg-[#eef4f9] px-4 py-8 text-[#102a43] lg:px-8">
      <section className="mx-auto max-w-[1440px]">
        <div className="rounded-[2rem] border border-[#d9e4ef] bg-white p-6 shadow-[0_18px_45px_rgba(16,42,67,0.08)] sm:p-10">
          <p className="kc-eyebrow">SHOP KOREA</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight sm:text-6xl">Your gateway to Korean shopping.</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#486581]">Discover Korean food, lifestyle and beauty products, then continue securely on the specialist store that sells them.</p>
          <div className="mt-6 flex flex-wrap gap-3"><a href="https://koreanshop.in/" target="_blank" rel="noopener noreferrer" className="kc-button kc-button-primary">Visit Koreanshop <ExternalLink className="h-4 w-4" /></a><a href="https://www.moabeauty.in/" target="_blank" rel="noopener noreferrer" className="kc-button kc-button-secondary">Visit MOA Beauty <ExternalLink className="h-4 w-4" /></a></div>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2">{(['koreanshop', 'moa_beauty'] as ShopStore[]).map((storeKey) => { const store = getStoreMeta(storeKey); return <a key={storeKey} href={store.url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-[#d9e4ef] bg-white p-6 transition hover:border-[#0b4eae] hover:shadow-[0_12px_30px_rgba(11,78,174,0.1)]"><div className="flex items-start justify-between gap-4"><div><p className="kc-eyebrow">{store.label}</p><h2 className="mt-2 text-2xl font-black">{store.name}</h2></div><ExternalLink className="h-5 w-5 text-[#0b4eae]" /></div><p className="mt-3 leading-7 text-[#486581]">{store.description}</p><p className="mt-4 text-sm font-black text-[#0b4eae]">Open store</p></a>; })}</div>

        <section className="mt-10">
          <div className="flex flex-wrap items-end justify-between gap-4"><div><p className="kc-eyebrow">CURATED BY K-CUBE</p><h2 className="mt-2 text-3xl font-black">Explore Korean favorites</h2><p className="mt-2 text-[#486581]">Prices and availability are informational. Confirm details on the destination store.</p></div><div className="flex items-center gap-2 rounded-xl border border-[#d9e4ef] bg-white px-3 py-2"><Search className="h-4 w-4 text-[#718096]" /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="Search products" aria-label="Search products" className="w-44 bg-transparent text-sm outline-none sm:w-60" /></div></div>
          <div className="mt-6 flex flex-wrap gap-2"><button type="button" onClick={() => selectStore('all')} className={activeStore === 'all' ? 'kc-chip kc-chip-active' : 'kc-chip'}>All stores</button>{(['koreanshop', 'moa_beauty'] as ShopStore[]).map((storeKey) => <button key={storeKey} type="button" onClick={() => selectStore(storeKey)} className={activeStore === storeKey ? 'kc-chip kc-chip-active' : 'kc-chip'}>{getStoreMeta(storeKey).name}</button>)}{shopCategories.map((category) => <button key={category.key} type="button" onClick={() => selectCategory(category.key)} className={activeCategory === category.key ? 'kc-chip kc-chip-active' : 'kc-chip'}>{category.label[language]}</button>)}<select value={sortMode} onChange={(event) => setSortMode(event.target.value as SortMode)} aria-label="Sort products" className="ml-auto rounded-full border border-[#d9e4ef] bg-white px-4 py-2 text-sm font-bold"><option value="az">A–Z</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></div>

          {visibleProducts.length ? <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{visibleProducts.map((product) => { const store = getStoreMeta(storeForProduct(product)); return <article key={product.id} className="overflow-hidden rounded-2xl border border-[#d9e4ef] bg-white shadow-[0_8px_22px_rgba(16,42,67,0.04)]"><div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} /><div className="p-5"><div className="flex items-center justify-between gap-2"><span className="text-xs font-black uppercase tracking-[0.14em] text-[#0b4eae]">{product.category[language]}</span><Sparkles className="h-4 w-4 text-[#b77900]" /></div><h3 className="mt-2 text-xl font-black">{product.title[language]}</h3><p className="mt-2 min-h-12 text-sm leading-6 text-[#486581]">{product.subtitle[language]}</p><p className="mt-4 text-xs font-bold uppercase tracking-[0.12em] text-[#718096]">Available on {store.name}</p><p className="mt-2 text-xl font-black">₹{product.price.toLocaleString('en-IN')}</p><p className="mt-1 text-xs text-[#718096]">Informational price</p><div className="mt-5 flex flex-col gap-2"><Link href={`/shop/${product.slug}`} className="kc-button kc-button-secondary justify-center">View product <ArrowRight className="h-4 w-4" /></Link><ExternalStoreLink product={product} className="kc-button kc-button-primary justify-center" /></div></div></article>; })}</div> : <div className="mt-6 rounded-2xl border border-dashed border-[#c8d6e5] bg-white p-8 text-center text-[#486581]">No curated products match this selection.</div>}

          <div className="mt-7 flex flex-wrap items-center gap-2"><button type="button" disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))} className="kc-button kc-button-secondary disabled:opacity-40">Previous</button>{Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => <button key={pageNumber} type="button" onClick={() => setPage(pageNumber)} className={page === pageNumber ? 'h-10 w-10 rounded-xl bg-[#0b4eae] font-bold text-white' : 'h-10 w-10 rounded-xl border border-[#d9e4ef] bg-white font-bold'}>{pageNumber}</button>)}<button type="button" disabled={page === pageCount} onClick={() => setPage((value) => Math.min(pageCount, value + 1))} className="kc-button kc-button-secondary disabled:opacity-40">Next</button></div>
        </section>
      </section>
    </main>
  );
};

export default ShopCatalogPage;
