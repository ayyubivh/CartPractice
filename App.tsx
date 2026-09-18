/**
 * CartPractice
 * A small e-commerce app built with local Context state, meant as a
 * starting point for practicing a migration to Redux.
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { FavoritesProvider } from './src/context/FavoritesContext';
import AppNavigator from './src/navigation/AppNavigator';

// ----------------------------------------------------------------------------
// This is the single spot that will change the most when you add Redux:
// these three Providers + their useState-backed contexts get replaced by
// one `<Provider store={store}>` wrapping the app, with AuthProvider,
// CartProvider, and FavoritesProvider each becoming a slice (see the
// "REDUX MIGRATION CANDIDATE" comments in src/context/*.tsx).
// ----------------------------------------------------------------------------
function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <CartProvider>
          <FavoritesProvider>
            <AppNavigator />
          </FavoritesProvider>
        </CartProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

export default App;
