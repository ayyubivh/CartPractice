# Migrating CartPractice to Redux

This app currently keeps all shared state in three React Contexts
(`AuthContext`, `CartContext`, `FavoritesContext`), each backed by
`useState`. This doc is a step-by-step path to replacing them with
Redux Toolkit, in the same style as your `redux/` Counter project
(`src/features/<name>/<name>Slice.ts` + `src/store/store.ts` +
`src/store/hooks.ts`).

Do the slices in this order — simplest to most complex — so you build
confidence before tackling the one with derived state (selectors):

1. `favoritesSlice` (one array, one action)
2. `authSlice` (one object-or-null, two actions)
3. `cartSlice` (array of line items, four actions, two derived selectors)

Work through one slice fully (state → actions → wire up consumers →
delete the old Context) before starting the next. Don't migrate all
three contexts and then fix every screen at the end — it's much
harder to tell which piece broke.

---

## Step 0 — Install dependencies

```bash
cd /Users/ayyubi/Documents/ReactNativeProjects/CartPractice
npm install @reduxjs/toolkit react-redux
```

## Step 1 — Create the folder structure

```
src/
  features/
    favorites/
      favoritesSlice.ts
    auth/
      authSlice.ts
    cart/
      cartSlice.ts
  store/
    store.ts
    hooks.ts
```

`src/context/` (the three existing Context files) gets deleted once
every consumer has been migrated off it — don't delete it up front.

---

## Step 2 — `favoritesSlice` (start here)

Look at [`src/context/FavoritesContext.tsx`](src/context/FavoritesContext.tsx)
first — the whole state shape is just `favoriteIds: string[]` and one
action, `toggleFavorite`.

**Create `src/features/favorites/favoritesSlice.ts`:**

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface FavoritesState {
  favoriteIds: string[];
}

const initialState: FavoritesState = {
  favoriteIds: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const productId = action.payload;
      const index = state.favoriteIds.indexOf(productId);
      if (index === -1) {
        state.favoriteIds.push(productId);
      } else {
        state.favoriteIds.splice(index, 1);
      }
    },
  },
});

export const { toggleFavorite } = favoritesSlice.actions;
export default favoritesSlice.reducer;
```

There's no `isFavorite` reducer — that was a derived read in the old
context (`favoriteIds.includes(id)`), so it becomes a selector inline
at the call site (or a small selector function — see Step 6).

---

## Step 3 — `authSlice`

Look at [`src/context/AuthContext.tsx`](src/context/AuthContext.tsx) —
state is `user: User | null`, actions are `login` and `logout`.

**Create `src/features/auth/authSlice.ts`:**

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types';

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    logout: state => {
      state.user = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
```

Note the shape change: the context's `login(name, email)` took two
args; the action takes one `User` object payload. You'll dispatch it
as `dispatch(login({ name, email }))`.

---

## Step 4 — `cartSlice` (do this last)

Look at [`src/context/CartContext.tsx`](src/context/CartContext.tsx) —
state is `items: CartItem[]`, actions are `addToCart`, `removeFromCart`,
`updateQuantity`, `clearCart`, and there are two derived values,
`cartCount` and `cartTotal`, that were plain `useMemo` calls.

**Create `src/features/cart/cartSlice.ts`:**

```ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem } from '../../types';
import { getProductById } from '../../data/products';
import type { RootState } from '../../store/store';

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (
      state,
      action: PayloadAction<{ productId: string; quantity?: number }>,
    ) => {
      const { productId, quantity = 1 } = action.payload;
      const existing = state.items.find(item => item.productId === productId);
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({ productId, quantity });
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.productId !== action.payload);
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number }>,
    ) => {
      const { productId, quantity } = action.payload;
      if (quantity <= 0) {
        state.items = state.items.filter(item => item.productId !== productId);
        return;
      }
      const item = state.items.find(i => i.productId === productId);
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: state => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

// ---- Selectors: these replace the useMemo-derived cartCount/cartTotal ----
export const selectCartItems = (state: RootState) => state.cart.items;

export const selectCartCount = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0);

export const selectCartTotal = (state: RootState) =>
  state.cart.items.reduce((sum, item) => {
    const product = getProductById(item.productId);
    return sum + (product ? product.price * item.quantity : 0);
  }, 0);

export default cartSlice.reducer;
```

`removeFromCart`'s payload is a bare `string` (the `productId`), not an
object — keep an eye on that when you dispatch it:
`dispatch(removeFromCart(productId))` vs.
`dispatch(updateQuantity({ productId, quantity }))`.

---

## Step 5 — Wire up the store

**Create `src/store/store.ts`:**

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import cartReducer from '../features/cart/cartSlice';
import favoritesReducer from '../features/favorites/favoritesSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
```

**Create `src/store/hooks.ts`:**

```ts
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
```

**Edit [`App.tsx`](App.tsx)** — replace the three Context providers
with the Redux `Provider`:

```diff
-import { AuthProvider } from './src/context/AuthContext';
-import { CartProvider } from './src/context/CartContext';
-import { FavoritesProvider } from './src/context/FavoritesContext';
+import { Provider } from 'react-redux';
+import { store } from './src/store/store';
 import AppNavigator from './src/navigation/AppNavigator';

 function App() {
   return (
     <SafeAreaProvider>
-      <AuthProvider>
-        <CartProvider>
-          <FavoritesProvider>
-            <AppNavigator />
-          </FavoritesProvider>
-        </CartProvider>
-      </AuthProvider>
+      <Provider store={store}>
+        <AppNavigator />
+      </Provider>
     </SafeAreaProvider>
   );
 }
```

At this point the app won't build yet — every file that still calls
`useCart()`, `useAuth()`, or `useFavorites()` will error because those
hooks no longer exist. That's the checklist for Step 6.

---

## Step 6 — Migrate every consumer

Find every remaining usage:

```bash
grep -rn "useCart\|useAuth\|useFavorites" src App.tsx
```

As of this app's initial version, that's these files — go through
them one at a time:

| File | Old hook calls | Replace with |
|---|---|---|
| [`src/screens/LoginScreen.tsx`](src/screens/LoginScreen.tsx) | `useAuth()` → `login` | `useAppDispatch()`; `dispatch(login({ name, email }))` |
| [`src/screens/ProfileScreen.tsx`](src/screens/ProfileScreen.tsx) | `useAuth()`, `useCart()`, `useFavorites()` | `useAppSelector` for `state.auth.user`, `selectCartCount`, `selectCartTotal`, `state.favorites.favoriteIds`; `useAppDispatch()` + `dispatch(logout())` |
| [`src/navigation/AppNavigator.tsx`](src/navigation/AppNavigator.tsx) | `useAuth()` → `user` | `useAppSelector(state => state.auth.user)` |
| [`src/navigation/MainTabs.tsx`](src/navigation/MainTabs.tsx) | `useCart()`, `useFavorites()` | `useAppSelector(selectCartCount)`, `useAppSelector(state => state.favorites.favoriteIds)` |
| [`src/screens/HomeScreen.tsx`](src/screens/HomeScreen.tsx) | `useCart()` → `cartCount` | `useAppSelector(selectCartCount)` |
| [`src/components/ProductCard.tsx`](src/components/ProductCard.tsx) | `useCart()` → `addToCart`; `useFavorites()` → `isFavorite`, `toggleFavorite` | `useAppDispatch()` + `dispatch(addToCart({ productId }))`; `useAppSelector(state => state.favorites.favoriteIds.includes(product.id))`; `dispatch(toggleFavorite(product.id))` |
| [`src/screens/ProductDetailScreen.tsx`](src/screens/ProductDetailScreen.tsx) | `useCart()` → `addToCart`; `useFavorites()` → `isFavorite`, `toggleFavorite` | same pattern as `ProductCard` |
| [`src/screens/CartScreen.tsx`](src/screens/CartScreen.tsx) | `useCart()` → `items`, `cartTotal`, `clearCart` | `useAppSelector(selectCartItems)`, `useAppSelector(selectCartTotal)`, `useAppDispatch()` + `dispatch(clearCart())` |
| [`src/components/CartListItem.tsx`](src/components/CartListItem.tsx) | `useCart()` → `updateQuantity`, `removeFromCart` | `useAppDispatch()` + `dispatch(updateQuantity({ productId, quantity }))`, `dispatch(removeFromCart(productId))` |
| [`src/screens/WishlistScreen.tsx`](src/screens/WishlistScreen.tsx) | `useFavorites()` → `favoriteIds` | `useAppSelector(state => state.favorites.favoriteIds)` |

Rerun the grep after each file — when it returns nothing, every
consumer has been migrated.

```bash
npx tsc --noEmit   # should be clean once all consumers are migrated
```

---

## Step 7 — Delete the old Context layer

Once the grep above is empty and `tsc --noEmit` passes:

```bash
rm -rf src/context
```

If anything still imports from `src/context/*`, TypeScript will tell
you immediately — that's your signal something got missed in Step 6.

---

## Step 8 — Re-verify the app manually

Redo the same walkthrough to confirm behavior is identical to before
the migration:

1. `npx react-native start`
2. `npx react-native run-android` (or `run-ios`)
3. Log in → confirm you land on the tab bar
4. Home: add a couple of items to cart, favorite one product →
   header badge and tab badges update
5. Cart tab: quantities and total are correct; +/- and remove work;
   Checkout clears the cart
6. Wishlist tab: shows the favorited product
7. Profile tab: cart count/total and wishlist count match what you
   just did; Log Out returns you to the login screen

If all of that matches what you saw before the migration, the
Contexts are fully and correctly replaced.

---

## Optional next steps, once the above works

- **Redux DevTools**: `configureStore` wires this up for free — install
  the `react-native-debugger` or use Flipper's Redux plugin to watch
  actions fire as you tap through the app.
- **`redux-persist`**: persist `auth` (and maybe `cart`) across app
  restarts — a good exercise in middleware/store enhancers.
- **RTK Query**: if you ever swap the static `data/products.ts` catalog
  for a real API, RTK Query replaces manual `fetch` + loading-state
  juggling.
- **Selectors with `createSelector`**: `selectCartTotal` recomputes on
  every render right now (no memoization). Try rewriting it with
  `reselect`'s `createSelector` and confirm — via a console log or the
  DevTools — that it only recomputes when `cart.items` actually changes.
- **Tests**: slices are plain reducers, so they're easy to unit test
  without any React involved — try `cartSlice`'s reducer directly with
  a sequence of actions and assert on the resulting state.
