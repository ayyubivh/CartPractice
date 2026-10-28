import { create } from 'zustand';
import type { CartItem } from '../../types';
import { useProductsStore } from '../products/useProductsStore';

interface CartStore {
  items: CartItem[];
  addToCart: (productId: number, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartStore>(set => ({
  items: [],
  addToCart: (productId, quantity = 1) =>
    set(state => {
      const existing = state.items.find(i => i.productId === productId);
      return {
        items: existing
          ? state.items.map(i =>
              i.productId === productId
                ? { ...i, quantity: i.quantity + quantity }
                : i,
            )
          : [...state.items, { productId, quantity }],
      };
    }),
  removeFromCart: productId =>
    set(state => ({ items: state.items.filter(i => i.productId !== productId) })),
  updateQuantity: (productId, quantity) =>
    set(state => ({
      items:
        quantity <= 0
          ? state.items.filter(i => i.productId !== productId)
          : state.items.map(i =>
              i.productId === productId ? { ...i, quantity } : i,
            ),
    })),
  clearCart: () => set({ items: [] }),
}));

export const selectCartCount = (state: CartStore) =>
  state.items.reduce((sum, item) => sum + item.quantity, 0);

// Joins cart IDs with product data, so it reads from the products store too.
export const useCartTotal = () => {
  const items = useCartStore(state => state.items);
  const products = useProductsStore(state => state.items);
  return items.reduce((sum, item) => {
    const product = products.find(p => p.id === item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);
};
