# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Requires Node >= 22.11. Plain React Native CLI app (no Expo), TypeScript.

```sh
npm start                      # Metro dev server
npm run ios                    # build + run on iOS simulator
npm run android                # build + run on Android
npm run lint                   # eslint .
npm test                       # jest (preset: @react-native/jest-preset)
npx jest __tests__/App.test.tsx            # single test file
npx jest -t "renders correctly"            # single test by name
npx tsc --noEmit               # type-check (no script defined)
```

iOS native deps: `bundle install` once, then `cd ios && bundle exec pod install` after changing native dependencies.

## Naming

The app is branded **E-Commerce**, but the repo folder, Xcode project/target (`ios/CartPractice*`, Podfile target) and Android package/applicationId (`com.cartpractice`) still use the old `CartPractice` name. The registered RN component name is `ECommerce` and must match in three places: `app.json` (`name`, read by `index.js`), `ios/CartPractice/AppDelegate.swift` (`withModuleName`), and `android/.../MainActivity.kt` (`getMainComponentName`). Native rebuild is needed after changing display names.

## Architecture

State management is Redux Toolkit (migrated from Context; `MIGRATING_TO_REDUX.md` / `REDUX_MIGRATION_CHECKLIST.md` document the history). `App.tsx` wraps `AppNavigator` in `<Provider store>` + `SafeAreaProvider`.

- **Store** (`src/store/store.ts`): four slices — `auth`, `cart`, `favorites`, `products` — each in `src/features/<name>/<name>Slice.ts`, exporting its reducer, actions, and `select*` selectors. Components use the typed `useAppDispatch` / `useAppSelector` from `src/store/hooks.ts`, not raw react-redux hooks.
- **Cart and favorites store only IDs** (`CartItem = {productId, quantity}`), not product objects. Product data lives in `products.items`; screens join the two (e.g. via `selectProductById`). There is no persistence — state resets on app restart, including auth.
- **API** (`src/api/client.ts`): single `apiFetch<T>(path, options)` wrapper over `fetch` with a hardcoded `BASE_URL` (a Render-hosted Node backend). It throws `Error` with the server's `details[].message` / `error` text, which thunks surface through `action.error.message` into slice `error` fields. Dev-mode request logging is gated on `__DEV__`. Auth endpoints: `POST /api/auth/login|signup`; products: `GET /api/products` (`{products: [...]}`).
- **Auth flow / navigation** (`src/navigation/AppNavigator.tsx`): the root native stack switches on `state.auth.user` — signed out shows only `Login`; signed in shows `Main` (bottom tabs in `MainTabs.tsx`) plus `ProductDetail`. Logging in/out changes the navigator's screen set; there is no imperative navigate to Main. Route param types are in `RootStackParamList` in `src/types/index.ts`, alongside the shared domain types (`Product`, `User`, `AuthResponse`, `CartItem`).
- Async slices follow `createAsyncThunk` + `extraReducers` with `status` / `error` fields (`auth` uses `'idle' | 'loading' | 'failed'`; `products` also has `'succeeded'`).

## Notes

- `__tests__/App.test.tsx` is the only test (a render smoke test of `<App />`); it exercises the real store.
- The header comment in `App.tsx` still describes the app as using local Context state — it predates the Redux migration.
