import React, { createContext, useContext, useState } from 'react';

// ============================================================================
// REDUX MIGRATION CANDIDATE #2: favorites/wishlist state
//
// Maps to a `favoritesSlice`:
//   - state:   favoriteIds: string[]
//   - actions: toggleFavorite
//   - selector: isFavorite(id) (currently a plain array `.includes` below)
//
// Read/written from Home, ProductDetail, and Wishlist screens.
// ============================================================================

interface FavoritesContextValue {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  // ---- STATE LIVES HERE (would become the favoritesSlice's initial state + reducer) ----
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  const toggleFavorite = (productId: string) => {
    setFavoriteIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId],
    );
  };

  const isFavorite = (productId: string) => favoriteIds.includes(productId);

  const value: FavoritesContextValue = { favoriteIds, toggleFavorite, isFavorite };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesContextValue {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return ctx;
}
