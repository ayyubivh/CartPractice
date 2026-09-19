# Redux Migration Checklist — CartPractice

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

- [ ] **Step 5b — `hooks.ts`**
      Still empty (0 bytes). Needs `useAppDispatch`/`useAppSelector`.

- [x] **Step 5c — `App.tsx` Provider**
      Done — `<Provider store={store}>` correctly wraps the app.

- [ ] **Step 6 — Migrate every consumer**
      `CartScreen.tsx` was touched but is broken — it imports a
      `useCart` hook from `cartSlice.ts` that doesn't exist there
      (that's the old Context pattern, not how RTK selectors work; see
      Step 4). The other 9 files still import from the deleted
      `src/context/*`.

- [ ] **Step 7 — Delete the old Context layer** ⚠️ done out of order
      `src/context/{AuthContext,CartContext,FavoritesContext}.tsx` are
      already deleted in the working tree — but this happened *before*
      Step 6, not after. That's why `npx tsc --noEmit` currently fails
      with ~17 errors. They're still recoverable with
      `git checkout -- src/context` if needed; otherwise push forward
      through Steps 4–6 to make the deletion valid.

- [ ] **Step 8 — Re-verify the app manually**
      Re-run the login → home → cart → wishlist → profile walkthrough
      and confirm behavior matches pre-migration.

---

## Optional, after Step 8

- [ ] Redux DevTools / Flipper Redux plugin
- [ ] `redux-persist` for `auth` (and maybe `cart`)
- [ ] RTK Query (if `data/products.ts` ever becomes a real API)
- [ ] Memoized selectors via `reselect`'s `createSelector`
- [ ] Unit tests for the slices (plain reducers, no React needed)
