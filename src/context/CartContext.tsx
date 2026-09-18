import React, { createContext, useContext, useMemo, useState } from 'react';
import { CartItem } from '../types';
import { getProductById } from '../data/products';

// ============================================================================
// REDUX MIGRATION CANDIDATE #1: cart state
//
// This is the best candidate in the whole app for a `cartSlice`:
//   - state:   items: CartItem[]
//   - actions: addToCart, removeFromCart, updateQuantity, clearCart
//   - selectors: cartCount, cartTotal (currently plain useMemo derivations
//     below — these map directly to reselect-style selectors)
//
// It's read/written from Home, ProductDetail, Cart, and Profile screens,
// which is exactly the "prop drilling" pain Redux (or Context, as done
// here) is meant to solve.
// ============================================================================

interface CartContextValue {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  // ---- STATE LIVES HERE (would become the cartSlice's initial state + reducers) ----
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (productId: string, quantity: number = 1) => {
    setItems(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => (item.productId === productId ? { ...item, quantity } : item)),
    );
  };

  const clearCart = () => setItems([]);

  // ---- DERIVED STATE (candidates for Redux selectors) ----
  const cartCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  );

  const cartTotal = useMemo(
    () =>
      items.reduce((sum, item) => {
        const product = getProductById(item.productId);
        return sum + (product ? product.price * item.quantity : 0);
      }, 0),
    [items],
  );

  const value: CartContextValue = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
