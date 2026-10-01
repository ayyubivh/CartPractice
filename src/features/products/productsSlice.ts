import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Product } from '../../types';
import { apiFetch } from '../../api/client';
import { RootState } from '../../store/store';

export const fetchProducts = createAsyncThunk('products/fetchAll', () =>
  apiFetch<{ products: Product[] }>('/api/products').then(res => res.products)
);

interface ProductsState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ProductsState = {
  items: [],
  status: 'idle',
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to load products';
      });
  },
});

export const selectProducts = (state: RootState) => state.products.items;
export const selectProductsStatus = (state: RootState) => state.products.status;
export const selectProductsError = (state: RootState) => state.products.error;
export const selectProductById = (id: number) => (state: RootState) =>
  state.products.items.find(p => p.id === id);

export default productsSlice.reducer;
