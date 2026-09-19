import { configureStore } from "@reduxjs/toolkit";
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import favoritesReducer from '../features/favorites/favoritesSlice'

export const store = configureStore({
    reducer:{
        auth: authReducer,
        cart: cartReducer,
       favorites: favoritesReducer,

    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;