'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Gift } from 'lucide-react';
import type { ShopProduct } from '@/lib/shopCatalog';
import { fetchShopCatalog } from '@/lib/shopApi';
import { useAppStore } from '@/store/useAppStore';
import ProductDiscoveryImage from '@/components/home/ProductDiscoveryImage';

export default function LiveProductGrid({ initialProducts, limit, category }: { initialProducts: ShopProduct[] | null; limit?: number; category?: string }) {
  const language = useAppStore((state) => state.language);
  const [products, setProducts] = useState(initialProducts || []);
  const [error, setError] = useState(initialProducts === null);
  useEffect(() => {
    let alive = true;
    const refresh = async () => {
      const items = await fetchShopCatalog();
      if (!alive) return;
      setError(items === null);
      if (items) setProducts(items);
    };
    const visibleRefresh = () => { if (!document.hidden) void refresh(); };
    void refresh();
    const interval = window.setInterval(visibleRefresh, 30000);
    window.addEventListener('focus', visibleRefresh);
    window.addEventListener('storage', visibleRefresh);
    return () => { alive = false; window.clearInterval(interval); window.removeEventListener('focus', visibleRefresh); window.removeEventListener('storage', visibleRefresh); };
  }, []);
  const filtered = category === 'beauty' ? products.filter((product) => product.categoryKey === 'beauty' || product.store === 'moa_beauty') : products;
  const ordered = limit ? [...filtered].sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured))).slice(0, limit) : filtered;
  return <>
    {error && <p role="status" className="mb-4 text-sm text-[var(--kc-copy)]">Product updates are temporarily unavailable. Please refresh to retry.</p>}
    {!ordered.length && !error && <p className="py-6 text-sm text-[var(--kc-copy)]">{category === 'beauty' ? 'No cosmetic products are published yet.' : 'No products are published yet.'}</p>}
    <div className="culture-product-grid">{ordered.map((product) => <Link href={`/shop/${product.slug}`} key={product.id} className="culture-product">
      <div className="culture-product-photo"><ProductDiscoveryImage key={product.image} src={product.image} title={product.title[language]} />{product.image.includes('images.unsplash.com') && <span className="culture-product-image-label">Lifestyle image</span>}</div>
      <div className="culture-product-details">
        <div className="culture-product-meta"><span>{product.category[language]}</span>{!product.inStock && <span className="culture-product-stock">Out of stock</span>}</div>
        <h3>{product.title[language]}</h3>
        <div className="culture-product-price">₹{product.price.toLocaleString('en-IN')}</div>
        <p className="culture-product-reward"><Gift size={13} aria-hidden="true" />{product.rewardPoints} points on eligible purchase</p>
        <div className="culture-product-action"><span>View product</span><ArrowUpRight size={17} aria-hidden="true" /></div>
      </div>
    </Link>)}</div>
  </>;
}
