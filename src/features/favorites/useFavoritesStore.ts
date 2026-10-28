import { create } from 'zustand';

interface FavoritesStore {
  favoriteIds: number[];
  toggleFavorite: (productId: number) => void;
}

export const useFavoritesStore = create<FavoritesStore>(set => ({
  favoriteIds: [],
  toggleFavorite: productId =>
    set(state => ({
      favoriteIds: state.favoriteIds.includes(productId)
        ? state.favoriteIds.filter(id => id !== productId)
        : [...state.favoriteIds, productId],
    })),
}));
