import { create } from 'zustand';
import type { Product } from '../../types';
import { api } from '../../api/client';

interface ProductsStore {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  fetchProducts: () => Promise<void>;
}

export const useProductsStore = create<ProductsStore>(set => ({
  items: [],
  status: 'idle',
  error: null,
  fetchProducts: async () => {
    set({ status: 'loading', error: null });
    try {
      const res = await api.get<{ products: Product[] }>('/api/products');
      set({ status: 'succeeded', items: res.data.products });
    } catch (e) {
      set({
        status: 'failed',
        error: e instanceof Error ? e.message : 'Failed to load products',
      });
    }
  },
}));

export const selectProductById = (id: number) => (state: ProductsStore) =>
  state.items.find(p => p.id === id);


