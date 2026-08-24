"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Coins, Lock, Minus, Plus, ShoppingBag, SlidersHorizontal, Sparkles, Trash2 } from 'lucide-react';
import { startRazorpayCheckout } from '@/lib/razorpay';
import { fetchLiveShopProducts } from '@/lib/shopApi';
import { shopCategories, shopCopy, shopProducts as staticShopProducts, type ShopProduct } from '@/lib/shopCatalog';
import { useAppStore } from '@/store/useAppStore';

const PAGE_SIZE = 12;

type SortMode = 'az' | 'price-low' | 'price-high' | 'rewards';

const ShopCatalogPage = () => {
  const language = useAppStore((state) => state.language);
  const user = useAppStore((state) => state.user);
  const points = useAppStore((state) => state.points);
  const cart = useAppStore((state) => state.shopCart);
  const orders = useAppStore((state) => state.shopOrders);
  const addToCart = useAppStore((state) => state.addToCart);
  const removeFromCart = useAppStore((state) => state.removeFromCart);
  const updateCartQuantity = useAppStore((state) => state.updateCartQuantity);
  const checkoutShopOrder = useAppStore((state) => state.checkoutShopOrder);
  const awardPoints = useAppStore((state) => state.awardPoints);
  const t = shopCopy[language];
  const [message, setMessage] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortMode, setSortMode] = useState<SortMode>('az');
  const [page, setPage] = useState(1);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [products, setProducts] = useState<ShopProduct[]>(staticShopProducts);
  const formatCurrency = (amount: number) => `\u20B9${amount.toLocaleString('en-IN')}`;

  useEffect(() => {
    let mounted = true;

    fetchLiveShopProducts()
      .then((liveProducts) => {
        if (!mounted || !Array.isArray(liveProducts) || !liveProducts.length) return;
        setProducts(liveProducts);
      })
      .catch(() => {
        if (mounted) {
          setProducts(staticShopProducts);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  const cartItems = cart
    .map((item) => {
      const product = products.find((entry) => entry.id === item.productId);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter((item): item is { product: ShopProduct; quantity: number } => Boolean(item));

  const filteredProducts = useMemo(() => {
    const base = activeCategory === 'all'
      ? [...products]
      : products.filter((product) => product.categoryKey === activeCategory);

    return base.sort((left, right) => {
      if (sortMode === 'price-low') return left.price - right.price;
      if (sortMode === 'price-high') return right.price - left.price;
      if (sortMode === 'rewards') return right.rewardPoints - left.rewardPoints;
      return left.title.en.localeCompare(right.title.en);
    });
  }, [activeCategory, products, sortMode]);

  const pageCount = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const visibleProducts = filteredProducts.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const rewardTotal = cartItems.reduce((sum, item) => sum + item.product.rewardPoints * item.quantity, 0);
  const selectedCategory = shopCategories.find((category) => category.key === activeCategory) ?? shopCategories[0];

  const handleCategoryChange = (categoryKey: string) => {
    setActiveCategory(categoryKey);
    setPage(1);
  };

  const handleSortChange = (value: SortMode) => {
    setSortMode(value);
    setPage(1);
  };

  const handleBuyIntent = (productId: string, inStock: boolean) => {
    if (!inStock) {
      setMessage(t.outOfStock);
      return;
    }

    addToCart(productId, 1);
    setMessage(user ? 'Added to cart. Complete your order from the cart summary.' : '');
  };

  const handleCheckout = async () => {
    if (!user || !cartItems.length || isCheckingOut) return;

    setIsCheckingOut(true);
    setMessage('');

    try {
      const contextRef = `shop-${user.id}-${subtotal}-${cartItems.length}`;
      const payment = await startRazorpayCheckout({
        amount: subtotal,
        contextType: 'shop',
        contextRef,
        description: 'K-CUBE shop order',
        customerEmail: user.email ?? null,
        customerPhone: user.phone ?? null,
        notes: {
          rewardPoints: rewardTotal,
          total: subtotal,
          items: cartItems.map(({ product, quantity }) => ({
            productId: product.id,
            title: product.title.en,
            quantity,
            unitPrice: product.price,
          })),
        },
        items: cartItems.map(({ product, quantity }) => ({
          productId: product.id,
          title: product.title.en,
          quantity,
          unitPrice: product.price,
        })),
      });

      checkoutShopOrder({
        id: `razorpay-${payment.razorpayOrderId}`,
        total: subtotal,
        rewardPoints: rewardTotal,
        createdAt: new Date().toISOString(),
        items: cartItems.map(({ product, quantity }) => ({
          productId: product.id,
          title: product.title.en,
          quantity,
          unitPrice: product.price,
        })),
        paymentOrderId: payment.paymentOrderId,
        razorpayOrderId: payment.razorpayOrderId,
        razorpayPaymentId: payment.razorpayPaymentId,
        paymentStatus: payment.status,
      });

      if (payment.pointsAwarded) {
        awardPoints(`razorpay-payment-${payment.paymentOrderId}`, payment.pointsAwarded);
      }

      setMessage(`Payment successful. Your order has been placed and +${payment.pointsAwarded || rewardTotal} points are synced.`);
    } catch (error: unknown) {
      const messageText = error instanceof Error ? error.message : 'Payment could not be completed.';
      setMessage(messageText);
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f0e8] text-[#111827]">
      <section className="border-b border-[#d5d9d9] bg-[#131921] px-4 py-4 text-white lg:px-10">
        <div className="mx-auto flex max-w-[1760px] flex-wrap items-center gap-3">
          <span className="rounded-sm bg-[#f3a847] px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-[#111827]">
            {t.badge}
          </span>
          <p className="text-sm font-semibold text-[#d5d9d9]">{t.rewardsLine}</p>
          <div className="ml-auto flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
            <Coins className="h-4 w-4 text-[#ffd814]" />
            <span>{points} pts</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 lg:px-10 lg:py-10">
        <div className="mx-auto grid max-w-[1760px] gap-6 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-[2rem] border border-[#d5d9d9] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.08)]">
              <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-sm font-semibold text-[#7a838f]">{t.breadcrumb}</p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#fff4cc] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#b12704]">
                    <Sparkles className="h-4 w-4" />
                    {t.shopCategory}
                  </p>
                  <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight sm:text-5xl">{t.title}</h1>
                  <p className="mt-4 max-w-3xl text-base leading-8 text-[#5d646d]">{t.subtitle}</p>
                  {!user ? (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href="/signup?returnTo=/shop" className="inline-flex items-center gap-2 rounded-full bg-[#ffd814] px-5 py-3 text-sm font-black text-[#111827]">
                        {t.accountPrompt}
                      </Link>
                      <Link href="/signin?returnTo=/shop" className="inline-flex items-center gap-2 rounded-full border border-[#d5d9d9] px-5 py-3 text-sm font-bold text-[#111827]">
                        <Lock className="h-4 w-4" />
                        {t.signInToBuy}
                      </Link>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-[1.75rem] bg-[#131921] p-6 text-white">
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f3a847]">{t.featured}</p>
                  <p className="mt-3 text-sm font-semibold text-[#d5d9d9]">{t.featuredLine}</p>
                  <h2 className="mt-6 text-3xl font-black text-white">{selectedCategory.label[language]}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#d5d9d9]">{selectedCategory.description[language]}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f3a847]">{t.allProducts}</p>
                      <p className="mt-2 text-3xl font-black">{filteredProducts.length}</p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs font-black uppercase tracking-[0.16em] text-[#f3a847]">{t.protectedCheckout}</p>
                      <p className="mt-2 text-sm leading-6 text-[#d5d9d9]">{t.loginGate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {message ? <p className="rounded-2xl border border-[#f3a847]/40 bg-[#fff8e1] px-5 py-4 text-sm font-bold text-[#7a3b00]">{message}</p> : null}

            <div className="rounded-[2rem] border border-[#d5d9d9] bg-white p-5 shadow-[0_16px_30px_rgba(0,0,0,0.06)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-[#b12704]">{t.catalogTitle}</p>
                  <h2 className="mt-2 text-3xl font-black">{selectedCategory.label[language]}</h2>
                  <p className="mt-2 text-sm text-[#68707a]">
                    {filteredProducts.length} {t.results}
                  </p>
                </div>
                <div className="flex flex-col gap-4 lg:min-w-[320px]">
                  <div className="flex items-center gap-2 text-sm font-black uppercase tracking-[0.16em] text-[#7a838f]">
                    <SlidersHorizontal className="h-4 w-4" />
                    {t.filters}
                  </div>
                  <label className="flex-1">
                    <span className="mb-2 block text-xs font-black uppercase tracking-[0.16em] text-[#7a838f]">{t.sortBy}</span>
                    <select
                      value={sortMode}
                      onChange={(event) => handleSortChange(event.target.value as SortMode)}
                      className="w-full rounded-2xl border border-[#d5d9d9] bg-[#f7fafa] px-4 py-3 text-sm font-semibold outline-none"
                    >
                      <option value="az">{t.sortAz}</option>
                      <option value="price-low">{t.sortPriceLow}</option>
                      <option value="price-high">{t.sortPriceHigh}</option>
                      <option value="rewards">{t.sortRewards}</option>
                    </select>
                  </label>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {shopCategories.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => handleCategoryChange(category.key)}
                    className={`rounded-full px-4 py-2 text-sm font-black transition ${
                      activeCategory === category.key
                        ? 'bg-[#131921] text-white'
                        : 'border border-[#d5d9d9] bg-[#f7fafa] text-[#384250]'
                    }`}
                  >
                    {category.label[language]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-[2rem] border border-[#d5d9d9] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
                  <div className="relative h-64 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }}>
                    {!product.inStock ? (
                      <div className="absolute inset-x-4 bottom-4 rounded-xl bg-white/90 px-4 py-2 text-center text-sm font-black uppercase tracking-[0.12em] text-[#111827]">
                        {t.outOfStock}
                      </div>
                    ) : null}
                  </div>
                  <div className="p-5">
                    <div className="flex flex-wrap gap-2">
                      {product.badges.slice(0, 2).map((badge) => (
                        <span key={badge.en} className="rounded-full bg-[#f7fafa] px-3 py-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#5d646d]">
                          {badge[language]}
                        </span>
                      ))}
                    </div>
                    <p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-[#b12704]">{product.category[language]}</p>
                    <h2 className="mt-2 text-2xl font-black text-[#111827]">{product.title[language]}</h2>
                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#5d646d]">{product.subtitle[language]}</p>
                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-black text-[#111827]">{formatCurrency(product.price)}</p>
                          {product.compareAtPrice ? <span className="text-sm font-bold text-[#7a838f] line-through">{formatCurrency(product.compareAtPrice)}</span> : null}
                        </div>
                        <p className="mt-1 text-sm font-bold text-[#b12704]">+{product.rewardPoints} pts</p>
                      </div>
                      <span className="rounded-full bg-[#fff4cc] px-3 py-1 text-xs font-black text-[#7a3b00]">{product.stockLabel[language]}</span>
                    </div>
                    <div className="mt-5 flex flex-col gap-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleBuyIntent(product.id, product.inStock)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#ffd814] px-4 py-3 text-sm font-black text-[#111827] disabled:cursor-not-allowed disabled:bg-[#e5e7eb] disabled:text-[#8b94a1]"
                          disabled={!product.inStock}
                        >
                          <ShoppingBag className="h-4 w-4" />
                          {user ? t.addToCart : t.signInToBuy}
                        </button>
                        <Link href={`/shop/${product.slug}`} className="inline-flex items-center justify-center rounded-full border border-[#d5d9d9] px-4 py-3 text-sm font-bold text-[#111827]">
                          {t.viewDetails}
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBuyIntent(product.id, product.inStock)}
                        disabled={!product.inStock}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#131921] bg-[#131921] px-4 py-3 text-sm font-black text-white disabled:cursor-not-allowed disabled:border-[#4b5563] disabled:bg-[#4b5563]"
                      >
                        {t.buyNow}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="rounded-xl border border-[#d5d9d9] bg-white px-4 py-3 text-sm font-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.previous}
              </button>
              {Array.from({ length: pageCount }, (_, index) => index + 1).map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={`h-11 w-11 rounded-xl text-sm font-black ${
                    page === pageNumber ? 'bg-[#131921] text-white' : 'border border-[#d5d9d9] bg-white text-[#111827]'
                  }`}
                >
                  {pageNumber}
                </button>
              ))}
              <button
                type="button"
                disabled={page === pageCount}
                onClick={() => setPage((current) => Math.min(pageCount, current + 1))}
                className="rounded-xl border border-[#d5d9d9] bg-white px-4 py-3 text-sm font-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                {t.next}
              </button>
            </div>
          </div>

          <aside className="rounded-[2rem] border border-[#d5d9d9] bg-[#131921] p-5 text-white shadow-[0_18px_40px_rgba(0,0,0,0.16)] lg:sticky lg:top-28 lg:h-fit">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-[#f3a847]">{t.cart}</p>
                <h2 className="mt-2 text-2xl font-black">{cartItems.length} items</h2>
              </div>
              <ShoppingBag className="h-7 w-7 text-[#ffd814]" />
            </div>

            <div className="mt-6 space-y-4">
              {cartItems.length ? (
                cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-black text-white">{product.title[language]}</p>
                        <p className="mt-1 text-sm text-[#d5d9d9]">{formatCurrency(product.price)} each</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(product.id)} className="text-[#f3a847]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-full border border-white/10 px-2 py-1">
                        <button type="button" onClick={() => updateCartQuantity(product.id, quantity - 1)} className="p-1 text-white">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-black">{quantity}</span>
                        <button type="button" onClick={() => updateCartQuantity(product.id, quantity + 1)} className="p-1 text-white">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm font-black text-[#ffd814]">+{product.rewardPoints * quantity} pts</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm leading-7 text-[#d5d9d9]">{t.empty}</div>
              )}
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#d5d9d9]">Subtotal</span>
                <span className="font-black text-white">{formatCurrency(subtotal)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-[#d5d9d9]">{t.orderRewards}</span>
                <span className="font-black text-[#ffd814]">+{rewardTotal} pts</span>
              </div>
            </div>

            {!user ? (
              <div className="mt-6 space-y-3">
                <p className="rounded-2xl border border-[#f3a847]/30 bg-[#fff4cc]/10 px-4 py-4 text-sm leading-6 text-[#f8e4a2]">{t.loginGate}</p>
                <Link href="/signin?returnTo=/shop" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ffd814] px-5 py-4 text-sm font-black text-[#111827]">
                  <Lock className="h-4 w-4" />
                  {t.signInToBuy}
                </Link>
              </div>
            ) : (
              <button
                type="button"
                disabled={!cartItems.length || isCheckingOut}
                onClick={handleCheckout}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#ffd814] px-5 py-4 text-sm font-black text-[#111827] disabled:cursor-not-allowed disabled:bg-[#55606f] disabled:text-[#d5d9d9]"
              >
                {isCheckingOut ? 'Redirecting to Razorpay...' : t.checkout}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {orders.length ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f3a847]">{t.recentOrder}</p>
                <p className="mt-2 font-black text-white">{orders[0].items[0]?.title}</p>
                <p className="mt-1 text-sm text-[#d5d9d9]">{formatCurrency(orders[0].total)} +{orders[0].rewardPoints} pts</p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ShopCatalogPage;
