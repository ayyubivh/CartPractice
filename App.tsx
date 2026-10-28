/**
 * E-Commerce
 * A small e-commerce app using Zustand stores for state.
 *
 * @format
 */

import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from './src/features/auth/useAuthStore';
import AppNavigator from './src/navigation/AppNavigator';

function App() {
  useEffect(() => {
    useAuthStore.getState().restoreSession();
  }, []);

  return (
    <SafeAreaProvider>
      <AppNavigator />
    </SafeAreaProvider>
  );
}

export default App;
