import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Phone } from '@/data/phonesData';
import { convertToUSD } from '@/lib/format';

export interface CartItem {
  phone: Phone;
  quantity: number;
  selectedColor: string;
  selectedStorage: string;
}

interface CouponResult {
  type: 'percent' | 'flat';
  value: number;
  code: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (phone: Phone, color?: string, storage?: string) => void;
  removeFromCart: (phoneId: string) => void;
  updateQuantity: (phoneId: string, qty: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  appliedCoupon: CouponResult | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  discountAmount: number;
  finalPrice: number;
  shippingFee: number;
  tax: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const COUPONS: Record<string, CouponResult> = {
  'SAVE10': { type: 'percent', value: 10, code: 'SAVE10' },
  'CELLPOINT': { type: 'flat', value: 6, code: 'CELLPOINT' },
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResult | null>(null);

  const addToCart = useCallback((phone: Phone, color?: string, storage?: string) => {
    setItems(prev => {
      const existing = prev.find(i => i.phone.id === phone.id);
      if (existing) {
        return prev.map(i => i.phone.id === phone.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, {
        phone,
        quantity: 1,
        selectedColor: color || phone.specs.colors[0] || '',
        selectedStorage: storage || phone.specs.storage,
      }];
    });
  }, []);

  const removeFromCart = useCallback((phoneId: string) => {
    setItems(prev => prev.filter(i => i.phone.id !== phoneId));
  }, []);

  const updateQuantity = useCallback((phoneId: string, qty: number) => {
    if (qty <= 0) {
      setItems(prev => prev.filter(i => i.phone.id !== phoneId));
    } else {
      setItems(prev => prev.map(i => i.phone.id === phoneId ? { ...i, quantity: qty } : i));
    }
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    setAppliedCoupon(null);
  }, []);

  const applyCoupon = useCallback((code: string): boolean => {
    const coupon = COUPONS[code.toUpperCase()];
    if (coupon) {
      setAppliedCoupon(coupon);
      return true;
    }
    return false;
  }, []);

  const removeCoupon = useCallback(() => setAppliedCoupon(null), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + convertToUSD(i.phone.price) * i.quantity, 0);
  const shippingFee = totalPrice >= 60 ? 0 : 10;
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round(totalPrice * appliedCoupon.value / 100)
      : appliedCoupon.value
    : 0;
  const subtotalAfterDiscount = totalPrice - discountAmount;
  const tax = Math.round(subtotalAfterDiscount * 0.18);
  const finalPrice = subtotalAfterDiscount + tax + shippingFee;

  return (
    <CartContext.Provider value={{
      items, addToCart, removeFromCart, updateQuantity, clearCart,
      totalItems, totalPrice, appliedCoupon, applyCoupon, removeCoupon,
      discountAmount, finalPrice, shippingFee, tax,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
