import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartSummary } from '../types/cart.types';
import { cartApi } from '../api/cart.api';

// Session ID برای Guest — در localStorage ذخیره میشود
const getSessionId = () => {
  let sid = localStorage.getItem('ts-session-id');
  if (!sid) {
    sid = `guest-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    localStorage.setItem('ts-session-id', sid);
  }
  return sid;
};

interface CartState {
  cart: CartSummary | null;
  isLoading: boolean;
  appliedCoupon: string | null;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, variantId: string | null, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  applyCoupon: (code: string) => Promise<void>;
  removeCoupon: () => Promise<void>;
  mergeGuestCart: () => Promise<void>;
  clearLocalCart: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: null,
      isLoading: false,
      appliedCoupon: null,

      fetchCart: async () => {
        set({ isLoading: true });
        try {
          const data = await cartApi.get(getSessionId());
          set({ cart: data, appliedCoupon: data.coupon?.code ?? null });
        } finally {
          set({ isLoading: false });
        }
      },

      addToCart: async (productId, variantId, quantity) => {
        set({ isLoading: true });
        try {
          const data = await cartApi.addItem({ productId, variantId: variantId ?? undefined, quantity }, getSessionId());
          set({ cart: data, appliedCoupon: data.coupon?.code ?? null });
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (itemId, quantity) => {
        const data = await cartApi.updateItem(itemId, quantity, getSessionId());
        set({ cart: data, appliedCoupon: data.coupon?.code ?? null });
      },

      removeItem: async (itemId) => {
        const data = await cartApi.removeItem(itemId, getSessionId());
        set({ cart: data, appliedCoupon: data.coupon?.code ?? null });
      },

      applyCoupon: async (code) => {
        const data = await cartApi.applyCoupon(code, getSessionId());
        set({ cart: data, appliedCoupon: data.coupon?.code ?? code });
      },

      removeCoupon: async () => {
        set({ isLoading: true });
        try {
          const data = await cartApi.removeCoupon(getSessionId());
          set({ cart: data, appliedCoupon: null });
        } catch {
          set((state) => ({
            appliedCoupon: null,
            cart: state.cart ? { ...state.cart, coupon: null, discountAmount: 0 } : null,
          }));
        } finally {
          set({ isLoading: false });
        }
      },

      // بعد از لاگین صدا زده میشود تا سبد Guest ادغام شود
      mergeGuestCart: async () => {
        const sessionId = localStorage.getItem('ts-session-id');
        if (!sessionId) return;
        await cartApi.mergeGuest(sessionId);
        localStorage.removeItem('ts-session-id');
        await get().fetchCart();
      },

      clearLocalCart: () => set({ cart: null, appliedCoupon: null }),
    }),
    {
      name: 'toolstore-cart',
      partialize: (state) => ({ appliedCoupon: state.appliedCoupon }),
    },
  ),
);
