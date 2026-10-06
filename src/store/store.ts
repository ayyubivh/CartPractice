import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';
import productsReducer from '../features/products/productsSlice';
import { clearSession, saveSession } from '../features/auth/sessionStorage';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
    products: productsReducer,
  },
});

// Mirror the session to device storage whenever it changes. Skipped until
// restoreSession has run, otherwise the empty initial state would wipe it.
let persisted = store.getState().auth.token;
store.subscribe(() => {
  const { token, user, hydrated } = store.getState().auth;
  if (!hydrated || token === persisted) {
    return;
  }
  persisted = token;
  (token && user ? saveSession({ user, token }) : clearSession()).catch(
    () => {},
  );
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
