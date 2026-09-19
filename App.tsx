/**
 * CartPractice
 * A small e-commerce app built with local Context state, meant as a
 * starting point for practicing a migration to Redux.
 *
 * @format
 */

import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { store } from './src/store/store';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from 'react-redux';

// ----------------------------------------------------------------------------
// This is the single spot that will change the most when you add Redux:
// these three Providers + their useState-backed contexts get replaced by
// one `<Provider store={store}>` wrapping the app, with AuthProvider,
// CartProvider, and FavoritesProvider each becoming a slice (see the
// "REDUX MIGRATION CANDIDATE" comments in src/context/*.tsx).
// ----------------------------------------------------------------------------
function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
            <AppNavigator />
    </SafeAreaProvider>
    </Provider>
  );
}

export default App;
