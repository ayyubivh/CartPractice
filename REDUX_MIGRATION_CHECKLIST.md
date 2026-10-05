# Redux Migration Checklist — E-Commerce

Tracker only — no code here. For implementation code/snippets, see
[MIGRATING_TO_REDUX.md](MIGRATING_TO_REDUX.md).

I'll flip each `[ ]` to `[x]` as we finish that step, so this file
always shows current progress at a glance.

---

## Target folder/file structure

```
CartPractice/
├─ App.tsx                          (edited — Provider replaces 3 Context providers)
└─ src/
   ├─ store/                        (NEW)
   │  ├─ store.ts                   (NEW — configureStore, RootState, AppDispatch)
   │  └─ hooks.ts                   (NEW — useAppDispatch, useAppSelector)
   ├─ features/                     (NEW)
   │  ├─ favorites/
   │  │  └─ favoritesSlice.ts       (NEW)
   │  ├─ auth/
   │  │  └─ authSlice.ts            (NEW)
   │  └─ cart/
   │     └─ cartSlice.ts            (NEW)
   ├─ context/                      (DELETE once fully migrated)
   │  ├─ AuthContext.tsx
   │  ├─ CartContext.tsx
   │  └─ FavoritesContext.tsx
   ├─ components/                   (edited — consumers switch off Context hooks)
   │  ├─ CartListItem.tsx
   │  └─ ProductCard.tsx
   ├─ navigation/                   (edited)
   │  ├─ AppNavigator.tsx
   │  └─ MainTabs.tsx
   └─ screens/                      (edited)
      ├─ LoginScreen.tsx
      ├─ ProfileScreen.tsx
      ├─ HomeScreen.tsx
      ├─ ProductDetailScreen.tsx
      ├─ CartScreen.tsx
      └─ WishlistScreen.tsx
```

Migration order: **favorites → auth → cart** (simplest state shape
first, the one with derived selectors last).

---

## Steps

- [x] **Step 0 — Install dependencies**
      `@reduxjs/toolkit` and `react-redux` (already present in
      `package.json` / `node_modules` — nothing to do here).

- [x] **Step 1 — Create the folder structure**
      Add empty `src/store/` and `src/features/{favorites,auth,cart}/`
      directories. Leave `src/context/` in place for now.

- [x] **Step 2 — `favoritesSlice`**
      Created `src/features/favorites/favoritesSlice.ts`. State +
      reducer logic correct. Minor deviation from the plan: the action
      is named `toggleFavorites` (plural) instead of `toggleFavorite` —
      harmless as long as every dispatch/import uses the same name.

- [x] **Step 3 — `authSlice`**
      Created `src/features/auth/authSlice.ts`. Correct — `user`,
      `login`, `logout` all match `AuthContext.tsx`'s shape.

- [x] **Step 4 — `cartSlice`**
      Done — import path correct, selectors
      (`selectCartItems`/`selectCartCount`/`selectCartTotal`) in
      place, and the `removeFromCart`/`updateQuantity` reassignment
      bug is fixed (both now do `state.items = state.items.filter(...)`).

- [x] **Step 5a — `store.ts`**
      Done — registers `auth`, `cart`, `favorites`, exports
      `RootState` and `AppDispatch`.

- [x] **Step 5b — `hooks.ts`**
      Done — typed `useAppDispatch`/`useAppSelector`, matches
      `AppDispatch`/`RootState` from `store.ts` correctly.

- [x] **Step 5c — `App.tsx` Provider**
      Done — `<Provider store={store}>` correctly wraps the app.

- [x] **Step 6 — Migrate every consumer** (10 of 10 done)
      - [x] `LoginScreen.tsx` — dispatches `login({ name, email })`
      - [x] `HomeScreen.tsx` — reads `selectCartCount`
      - [x] `CartScreen.tsx` — `selectCartItems`/`selectCartTotal` +
            `dispatch(clearCart())`
      - [x] `AppNavigator.tsx` — reads `state.auth.user`
      - [x] `MainTabs.tsx` — reads `selectCartCount`/`state.favorites`
            for tab badges (fixed: was wrongly using `selectCartTotal`
            for the cart badge — now correctly `selectCartCount`)
      - [x] `CartListItem.tsx` — dispatches `updateQuantity`/`removeFromCart`
      - [x] `ProductCard.tsx` — dispatches `toggledFavorites`/`addToCart`,
            `favorite` selector uses `.includes()` (fixed a `.map()` bug
            that made the heart icon always show filled)
      - [x] `ProductDetailScreen.tsx` — dispatches `addToCart`/`toggledFavorites`;
            fixed a `react-hooks/rules-of-hooks` violation (`useAppSelector`
            was called after a conditional early return)
      - [x] `ProfileScreen.tsx` — reads `state.auth.user`, `selectCartCount`,
            `selectCartTotal`, `state.favorites.favoriteIds`;
            `dispatch(logout())`
      - [x] `WishlistScreen.tsx` — reads `state.favorites.favoriteIds`
            (the 2 pre-existing implicit-`any` params resolved on their
            own once `favoriteIds` had a real type from `RootState`)

- [x] **Step 7 — Delete the old Context layer**
      `src/context/{AuthContext,CartContext,FavoritesContext}.tsx` are
      deleted, and now validly so — no file references them, confirmed
      by `npx tsc --noEmit` (0 errors) and `npx eslint src App.tsx`
      (0 errors). Also cleaned up a stale comment in `App.tsx` that
      still described the old Context setup.

- [ ] **Step 8 — Re-verify the app manually**
      `tsc` and `eslint` are clean, but that only proves the code is
      well-typed — not that it behaves correctly at runtime. Still need
      to actually run the app: login → home → cart → wishlist → profile
      → log out, and confirm behavior matches pre-migration.

---

## Optional, after Step 8

- [ ] Redux DevTools / Flipper Redux plugin
- [ ] `redux-persist` for `auth` (and maybe `cart`)
- [ ] RTK Query (if `data/products.ts` ever becomes a real API)
- [ ] Memoized selectors via `reselect`'s `createSelector`
- [ ] Unit tests for the slices (plain reducers, no React needed)
