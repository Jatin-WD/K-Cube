import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type Language = 'en' | 'ko' | 'hi';
export type AuthMethod = 'email' | 'phone' | 'admin';

export interface KCubeUser {
  id: string;
  fullName: string;
  email?: string;
  phone?: string;
  referralCode?: string;
  points?: number;
  role?: 'admin' | 'member' | 'manager' | 'guest';
  method: AuthMethod;
}

export interface ShopCartItem {
  productId: string;
  quantity: number;
}

export interface ShopOrderItem {
  productId: string;
  title: string;
  quantity: number;
  unitPrice: number;
}

export interface ShopOrder {
  id: string;
  total: number;
  rewardPoints: number;
  createdAt: string;
  items: ShopOrderItem[];
  paymentOrderId?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paymentStatus?: 'created' | 'attempted' | 'paid' | 'failed' | 'refunded' | 'cancelled';
}

interface AppState {
  user: KCubeUser | null;
  language: Language;
  points: number;
  completedActions: string[];
  token: string | null;
  refreshToken: string | null;
  sessionSeed: string | null;
  shopCart: ShopCartItem[];
  shopOrders: ShopOrder[];
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  signIn: (user: KCubeUser, token?: string | null, refreshToken?: string | null, points?: number) => void;
  signOut: () => void;
  awardPoints: (actionId: string, points: number) => void;
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  checkoutShopOrder: (order: ShopOrder) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      language: 'en',
      points: 0,
      completedActions: [],
      token: null,
      refreshToken: null,
      sessionSeed: null,
      shopCart: [],
      shopOrders: [],
      setLanguage: (language) => set({ language }),
      toggleLanguage: () =>
        set({
          language: get().language === 'en' ? 'ko' : get().language === 'ko' ? 'hi' : 'en',
        }),
      signIn: (user, token = null, refreshToken = null, serverPoints) =>
        set((state) => {
          const sessionSeed = typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
            ? crypto.randomUUID()
            : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
          const hasWelcomeBonus = state.completedActions.includes('welcome-bonus');
          const resolvedPoints =
            typeof serverPoints === 'number'
              ? serverPoints
              : typeof user.points === 'number'
                ? user.points
                : hasWelcomeBonus
                  ? state.points
                  : state.points + 250;

          return {
            user: { ...user, points: resolvedPoints },
            token,
            refreshToken,
            sessionSeed,
            points: resolvedPoints,
            completedActions: hasWelcomeBonus
              ? state.completedActions
              : [...state.completedActions, 'welcome-bonus'],
          };
        }),
      signOut: () => set({ user: null, token: null, refreshToken: null, sessionSeed: null, points: 0, completedActions: [], shopCart: [], shopOrders: [] }),
      awardPoints: (actionId, points) =>
        set((state) => {
          if (!state.user) {
            return state;
          }

          if (state.completedActions.includes(actionId)) {
            return state;
          }

          return {
            points: state.points + points,
            completedActions: [...state.completedActions, actionId],
          };
        }),
      addToCart: (productId, quantity = 1) =>
        set((state) => {
          const existing = state.shopCart.find((item) => item.productId === productId);
          if (existing) {
            return {
              shopCart: state.shopCart.map((item) =>
                item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item,
              ),
            };
          }

          return {
            shopCart: [...state.shopCart, { productId, quantity }],
          };
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          shopCart: state.shopCart.filter((item) => item.productId !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          shopCart: quantity <= 0
            ? state.shopCart.filter((item) => item.productId !== productId)
            : state.shopCart.map((item) => (item.productId === productId ? { ...item, quantity } : item)),
        })),
      clearCart: () => set({ shopCart: [] }),
      checkoutShopOrder: (order) =>
        set((state) => {
          if (!state.user || !order.items.length) {
            return state;
          }

          return {
            shopCart: [],
            shopOrders: [order, ...state.shopOrders],
          };
        }),
    }),
    {
      name: 'kcube-app-state',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        language: state.language,
        points: state.points,
        completedActions: state.completedActions,
        token: state.token,
        refreshToken: state.refreshToken,
        sessionSeed: state.sessionSeed,
        shopCart: state.shopCart,
        shopOrders: state.shopOrders,
      }),
    },
  ),
);
