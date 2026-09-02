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
    <main className="min-h-screen bg-[#eef4f8] text-[#102a43]">
      <section className="border-b border-[#dce6f0] bg-white px-4 py-3 lg:px-10">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center gap-3">
          <span className="rounded-md bg-[#eaf3ff] px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-[#0b4eae]">
            {t.badge}
          </span>
          <p className="text-sm font-semibold text-[#486581]">{t.rewardsLine}</p>
          <div className="ml-auto flex items-center gap-3 rounded-md border border-[#dce6f0] bg-[#f7fafd] px-4 py-2 text-sm text-[#486581]">
            <Coins className="h-4 w-4 text-[#b77900]" />
            <span>{points} pts</span>
          </div>
        </div>
      </section>

      <section className="px-4 py-8 lg:px-10 lg:py-10">
        <div className="mx-auto grid max-w-[1320px] gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-xl border border-[#dce6f0] bg-white shadow-[0_6px_20px_rgba(15,55,95,0.07)]">
              <div className="grid gap-6 p-6 sm:p-8 xl:grid-cols-[1.2fr_0.8fr]">
                <div>
                  <p className="text-sm font-semibold text-[#7a838f]">{t.breadcrumb}</p>
                  <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#eaf3ff] px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#0b4eae]">
                    <Sparkles className="h-4 w-4" />
                    {t.shopCategory}
                  </p>
                  <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight text-[#102a43] sm:text-4xl">{t.title}</h1>
                  <p className="mt-4 max-w-3xl text-base leading-7 text-[#486581]">{t.subtitle}</p>
                  {!user ? (
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Link href="/signup?returnTo=/shop" className="kc-button kc-button-primary">
                        {t.accountPrompt}
                      </Link>
                      <Link href="/signin?returnTo=/shop" className="kc-button kc-button-secondary">
                        <Lock className="h-4 w-4" />
                        {t.signInToBuy}
                      </Link>
                    </div>
                  ) : null}
                </div>

                <div className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-6">
                  <p className="kc-eyebrow">{t.featured}</p>
                  <p className="mt-3 text-sm font-semibold text-[#486581]">{t.featuredLine}</p>
                  <h2 className="mt-6 text-2xl font-bold text-[#102a43]">{selectedCategory.label[language]}</h2>
                  <p className="mt-3 text-sm leading-7 text-[#486581]">{selectedCategory.description[language]}</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-[#dce6f0] bg-white p-4">
                      <p className="kc-eyebrow">{t.allProducts}</p>
                      <p className="mt-2 text-3xl font-bold text-[#0b4eae]">{filteredProducts.length}</p>
                    </div>
                    <div className="rounded-lg border border-[#dce6f0] bg-white p-4">
                      <p className="kc-eyebrow">{t.protectedCheckout}</p>
                      <p className="mt-2 text-sm leading-6 text-[#486581]">{t.loginGate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {message ? <p className="rounded-lg border border-[#f59e0b]/30 bg-[#fff8e7] px-5 py-4 text-sm font-bold text-[#a16207]">{message}</p> : null}

            <div className="rounded-xl border border-[#dce6f0] bg-white p-5 shadow-[0_4px_18px_rgba(15,55,95,0.05)]">
              <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="kc-eyebrow">{t.catalogTitle}</p>
                  <h2 className="mt-2 text-2xl font-bold text-[#102a43]">{selectedCategory.label[language]}</h2>
                  <p className="mt-2 text-sm text-[#486581]">
                    {filteredProducts.length} {t.results}
                  </p>
                </div>
                <div className="flex flex-col gap-4 lg:min-w-[320px]">
                  <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-[0.16em] text-[#486581]">
                    <SlidersHorizontal className="h-4 w-4" />
                    {t.filters}
                  </div>
                  <label className="flex-1">
                    <span className="mb-2 block text-xs font-bold uppercase tracking-[0.16em] text-[#486581]">{t.sortBy}</span>
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

              <div className="mt-5 flex flex-wrap gap-2">
                {shopCategories.map((category) => (
                  <button
                    key={category.key}
                    type="button"
                    onClick={() => handleCategoryChange(category.key)}
                    className={`rounded-full px-4 py-2 text-sm font-black transition ${
                      activeCategory === category.key
                        ? 'bg-[#0b4eae] text-white'
                        : 'border border-[#dce6f0] bg-[#f7fafd] text-[#486581]'
                    }`}
                  >
                    {category.label[language]}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleProducts.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-xl border border-[#dce6f0] bg-white shadow-[0_4px_18px_rgba(15,55,95,0.05)] transition hover:-translate-y-0.5 hover:border-[#0b4eae]/40">
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
                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-[#0b4eae]">{product.category[language]}</p>
                    <h2 className="mt-2 text-xl font-bold text-[#102a43]">{product.title[language]}</h2>
                    <p className="mt-3 min-h-[72px] text-sm leading-6 text-[#486581]">{product.subtitle[language]}</p>
                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-2xl font-black text-[#111827]">{formatCurrency(product.price)}</p>
                          {product.compareAtPrice ? <span className="text-sm font-bold text-[#7a838f] line-through">{formatCurrency(product.compareAtPrice)}</span> : null}
                        </div>
                        <p className="mt-1 text-sm font-bold text-[#b77900]">+{product.rewardPoints} pts</p>
                      </div>
                      <span className="rounded-md bg-[#fff8e7] px-3 py-1 text-xs font-bold text-[#a16207]">{product.stockLabel[language]}</span>
                    </div>
                    <div className="mt-5 flex flex-col gap-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleBuyIntent(product.id, product.inStock)}
                          className="kc-button kc-button-primary flex-1 disabled:cursor-not-allowed disabled:bg-[#f7fafd] disabled:text-[#6b7c93]"
                          disabled={!product.inStock}
                        >
                          <ShoppingBag className="h-4 w-4" />
                          {user ? t.addToCart : t.signInToBuy}
                        </button>
                        <Link href={`/shop/${product.slug}`} className="kc-button kc-button-secondary px-4">
                          {t.viewDetails}
                        </Link>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleBuyIntent(product.id, product.inStock)}
                        disabled={!product.inStock}
                        className="kc-button kc-button-secondary w-full"
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
                    className={`h-10 w-10 rounded-md text-sm font-bold ${
                    page === pageNumber ? 'bg-[#0b4eae] text-white' : 'border border-[#dce6f0] bg-white text-[#102a43]'
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

          <aside className="rounded-xl border border-[#dce6f0] bg-white p-5 text-[#102a43] shadow-[0_4px_18px_rgba(15,55,95,0.05)] lg:sticky lg:top-28 lg:h-fit">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="kc-eyebrow">{t.cart}</p>
                <h2 className="mt-2 text-2xl font-bold text-[#102a43]">{cartItems.length} items</h2>
              </div>
              <ShoppingBag className="h-6 w-6 text-[#0b4eae]" />
            </div>

            <div className="mt-6 space-y-4">
              {cartItems.length ? (
                cartItems.map(({ product, quantity }) => (
                  <div key={product.id} className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#102a43]">{product.title[language]}</p>
                        <p className="mt-1 text-sm text-[#486581]">{formatCurrency(product.price)} each</p>
                      </div>
                      <button type="button" onClick={() => removeFromCart(product.id)} className="text-[#f3a847]">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="inline-flex items-center gap-2 rounded-md border border-[#dce6f0] bg-white px-2 py-1">
                        <button type="button" onClick={() => updateCartQuantity(product.id, quantity - 1)} className="p-1 text-[#0b4eae]">
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-black">{quantity}</span>
                        <button type="button" onClick={() => updateCartQuantity(product.id, quantity + 1)} className="p-1 text-[#0b4eae]">
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="text-sm font-bold text-[#b77900]">+{product.rewardPoints * quantity} pts</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-4 text-sm leading-7 text-[#486581]">{t.empty}</div>
              )}
            </div>

            <div className="mt-6 rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#486581]">Subtotal</span>
                <span className="font-bold text-[#102a43]">{formatCurrency(subtotal)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-[#486581]">{t.orderRewards}</span>
                <span className="font-bold text-[#b77900]">+{rewardTotal} pts</span>
              </div>
            </div>

            {!user ? (
              <div className="mt-6 space-y-3">
                <p className="rounded-lg border border-[#0b4eae]/20 bg-[#eaf3ff] px-4 py-4 text-sm leading-6 text-[#486581]">{t.loginGate}</p>
                <Link href="/signin?returnTo=/shop" className="kc-button kc-button-primary w-full">
                  <Lock className="h-4 w-4" />
                  {t.signInToBuy}
                </Link>
              </div>
            ) : (
              <button
                type="button"
                disabled={!cartItems.length || isCheckingOut}
                onClick={handleCheckout}
                className="kc-button kc-button-primary mt-6 w-full disabled:cursor-not-allowed disabled:bg-[#f7fafd] disabled:text-[#6b7c93]"
              >
                {isCheckingOut ? 'Redirecting to Razorpay...' : t.checkout}
                <ArrowRight className="h-4 w-4" />
              </button>
            )}

            {orders.length ? (
              <div className="mt-6 rounded-lg border border-[#dce6f0] bg-[#f7fafd] p-4">
                <p className="kc-eyebrow">{t.recentOrder}</p>
                <p className="mt-2 font-bold text-[#102a43]">{orders[0].items[0]?.title}</p>
                <p className="mt-1 text-sm text-[#486581]">{formatCurrency(orders[0].total)} +{orders[0].rewardPoints} pts</p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ShopCatalogPage;
