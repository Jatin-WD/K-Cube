"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ArrowRight, Coins, Lock, Minus, Plus, ShoppingBag, Sparkles, Trash2 } from 'lucide-react';
import { startRazorpayCheckout } from '@/lib/razorpay';
import { shopCopy } from '@/lib/shopContent';
import { fetchLiveShopProducts } from '@/lib/shopApi';
import { shopProducts as staticShopProducts, type ShopProduct } from '@/lib/shopCatalog';
import { useAppStore } from '@/store/useAppStore';

const ShopPage = () => {
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
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [products, setProducts] = useState<ShopProduct[]>(staticShopProducts);

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

  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const rewardTotal = cartItems.reduce((sum, item) => sum + item.product.rewardPoints * item.quantity, 0);

  const handleBuyIntent = (productId: string) => {
    addToCart(productId, 1);
    setMessage(user ? 'Added to cart. Complete your order from the cart summary.' : '');
  };

  const handleCheckout = async () => {
    if (!user || !cartItems.length || isCheckingOut) return;

    setIsCheckingOut(true);
    setMessage('');

    try {
      const payment = await startRazorpayCheckout({
        amount: subtotal,
        contextType: 'shop',
        contextRef: `shop-${Date.now()}`,
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
    } catch (error: any) {
      setMessage(error?.message || 'Payment could not be completed.');
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
        <div className="mx-auto grid max-w-[1760px] gap-6 lg:grid-cols-[1.25fr_380px]">
          <div className="space-y-6">
            <div className="rounded-[2rem] border border-[#d5d9d9] bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.08)] sm:p-8">
              <p className="inline-flex items-center gap-2 rounded-full bg-[#fff4cc] px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-[#b12704]">
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

            {message ? <p className="rounded-2xl border border-[#f3a847]/40 bg-[#fff8e1] px-5 py-4 text-sm font-bold text-[#7a3b00]">{message}</p> : null}

            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article key={product.id} className="overflow-hidden rounded-[2rem] border border-[#d5d9d9] bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)]">
                  <div className="h-56 bg-cover bg-center" style={{ backgroundImage: `url(${product.image})` }} />
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
                    <p className="mt-3 text-sm leading-6 text-[#5d646d]">{product.subtitle[language]}</p>
                    <div className="mt-5 flex items-end justify-between gap-3">
                      <div>
                        <p className="text-2xl font-black text-[#111827]">Rs. {product.price}</p>
                        <p className="mt-1 text-sm font-bold text-[#b12704]">+{product.rewardPoints} pts</p>
                      </div>
                      <span className="rounded-full bg-[#fff4cc] px-3 py-1 text-xs font-black text-[#7a3b00]">{product.stockLabel[language]}</span>
                    </div>
                    <div className="mt-5 flex flex-col gap-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => handleBuyIntent(product.id)}
                          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#ffd814] px-4 py-3 text-sm font-black text-[#111827]"
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
                        onClick={() => handleBuyIntent(product.id)}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-[#131921] bg-[#131921] px-4 py-3 text-sm font-black text-white"
                      >
                        {t.buyNow}
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </article>
              ))}
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
                        <p className="mt-1 text-sm text-[#d5d9d9]">Rs. {product.price} each</p>
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
                <span className="font-black text-white">Rs. {subtotal}</span>
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
                <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f3a847]">Recent order</p>
                <p className="mt-2 font-black text-white">{orders[0].items[0]?.title}</p>
                <p className="mt-1 text-sm text-[#d5d9d9]">Rs. {orders[0].total} • +{orders[0].rewardPoints} pts</p>
              </div>
            ) : null}
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ShopPage;
