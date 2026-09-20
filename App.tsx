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
