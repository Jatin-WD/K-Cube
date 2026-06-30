"use client";

import Link from 'next/link';
import { ArrowRight, Coins, Lock, ShoppingBag, Sparkles } from 'lucide-react';
import type { ShopProduct } from '@/lib/shopCatalog';
import { getRelatedShopProducts, shopCopy } from '@/lib/shopCatalog';
import { useAppStore } from '@/store/useAppStore';

interface ShopCatalogProductPageProps {
  product: ShopProduct;
}

const ShopCatalogProductPage = ({ product }: ShopCatalogProductPageProps) => {
  const language = useAppStore((state) => state.language);
  const user = useAppStore((state) => state.user);
  const addToCart = useAppStore((state) => state.addToCart);
  const t = shopCopy[language];
  const relatedProducts = getRelatedShopProducts(product.id, product.categoryKey);

  return (
    <main className="min-h-screen bg-[#f4f0e8] px-4 py-8 text-[#111827] lg:px-10">
      <div className="mx-auto max-w-[1760px] space-y-6">
        <div className="rounded-[2rem] border border-[#d5d9d9] bg-white p-5 shadow-[0_20px_40px_rgba(0,0,0,0.08)] sm:p-8">
          <p className="text-sm font-semibold text-[#7a838f]">{t.breadcrumb}</p>
          <div className="mt-5 grid gap-6 lg:grid-cols-[0.95fr_1.05fr_340px]">
            <div className="overflow-hidden rounded-[1.75rem] border border-[#d5d9d9] bg-[#f7fafa]">
              <div className="h-[320px] bg-cover bg-center sm:h-[480px]" style={{ backgroundImage: `url(${product.image})` }} />
            </div>

            <section>
              <p className="inline-flex items-center gap-2 rounded-full bg-[#fff4cc] px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-[#b12704]">
                <Sparkles className="h-4 w-4" />
                {product.category[language]}
              </p>
              <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{product.title[language]}</h1>
              <p className="mt-4 text-lg leading-8 text-[#5d646d]">{product.subtitle[language]}</p>
              <p className="mt-4 text-base leading-8 text-[#5d646d]">{product.description[language]}</p>

              <div className="mt-6 flex flex-wrap gap-2">
                {product.badges.map((badge) => (
                  <span key={badge.en} className="rounded-full border border-[#d5d9d9] bg-[#f7fafa] px-4 py-2 text-xs font-black uppercase tracking-[0.14em] text-[#5d646d]">
                    {badge[language]}
                  </span>
                ))}
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {product.includes.map((item) => (
                  <div key={item.en} className="rounded-[1.5rem] border border-[#d5d9d9] bg-[#f7fafa] p-4 text-sm font-semibold leading-6 text-[#3e4651]">
                    {item[language]}
                  </div>
                ))}
              </div>
            </section>

            <aside className="rounded-[1.75rem] border border-[#131921] bg-[#131921] p-5 text-white">
              <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f3a847]">{t.badge}</p>
              <p className="mt-4 text-4xl font-black">Rs. {product.price}</p>
              {product.compareAtPrice ? <p className="mt-2 text-lg font-bold text-[#9ca3af] line-through">Rs. {product.compareAtPrice}</p> : null}
              <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-[#fff4cc] px-4 py-2 text-sm font-black text-[#111827]">
                <Coins className="h-4 w-4" />
                +{product.rewardPoints} pts
              </p>
              <div className="mt-5 space-y-2 text-sm leading-6 text-[#d5d9d9]">
                <p><span className="font-black text-white">{t.stock}:</span> {product.stockLabel[language]}</p>
                <p><span className="font-black text-white">{t.sku}:</span> {product.sku}</p>
              </div>
              <p className="mt-4 text-sm leading-6 text-[#d5d9d9]">{t.rewardsLine}</p>

              <div className="mt-6 space-y-3">
                {user ? (
                  <>
                    <button
                      type="button"
                      disabled={!product.inStock}
                      onClick={() => addToCart(product.id, 1)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ffd814] px-5 py-4 text-sm font-black text-[#111827] disabled:cursor-not-allowed disabled:bg-[#4b5563] disabled:text-[#d5d9d9]"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {product.inStock ? t.addToCart : t.outOfStock}
                    </button>
                    <Link href="/shop" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-4 text-sm font-bold text-white">
                      {t.continueShopping}
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href={`/signin?returnTo=/shop/${product.slug}`} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ffd814] px-5 py-4 text-sm font-black text-[#111827]">
                      <Lock className="h-4 w-4" />
                      {t.signInToBuy}
                    </Link>
                    <Link href={`/signup?returnTo=/shop/${product.slug}`} className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-4 text-sm font-bold text-white">
                      {t.accountPrompt}
                    </Link>
                  </>
                )}
              </div>

              <Link href="/shop" className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#f3a847]">
                {t.backToShop}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </aside>
          </div>
        </div>

        <section className="rounded-[2rem] border border-[#d5d9d9] bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.08)] sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">{t.discoverMore}</p>
              <h2 className="mt-2 text-3xl font-black">{t.relatedProducts}</h2>
            </div>
            <Link href="/shop" className="inline-flex items-center gap-2 rounded-full border border-[#d5d9d9] px-5 py-3 text-sm font-bold text-[#111827]">
              {t.backToShop}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {relatedProducts.map((related) => (
              <article key={related.id} className="overflow-hidden rounded-[1.5rem] border border-[#d5d9d9] bg-[#f9fafb]">
                <div className="h-52 bg-cover bg-center" style={{ backgroundImage: `url(${related.image})` }} />
                <div className="p-4">
                  <p className="text-xs font-black uppercase tracking-[0.16em] text-[#b12704]">{related.category[language]}</p>
                  <h3 className="mt-2 text-xl font-black">{related.title[language]}</h3>
                  <p className="mt-2 text-sm leading-6 text-[#5d646d]">{related.subtitle[language]}</p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <p className="text-lg font-black">Rs. {related.price}</p>
                    <span className="text-sm font-bold text-[#b12704]">+{related.rewardPoints} pts</span>
                  </div>
                  <Link href={`/shop/${related.slug}`} className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#111827]">
                    {t.viewDetails}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default ShopCatalogProductPage;
