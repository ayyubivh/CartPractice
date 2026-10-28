import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types';
import { useFavoritesStore } from '../features/favorites/useFavoritesStore';
import { useCartStore } from '../features/cart/useCartStore';


interface Props {
  product: Product;
  onPress: () => void;
}

// Reused by HomeScreen and WishlistScreen. Note this card reaches directly
// into the cart and favorites stores rather than receiving callbacks as props.
export default function ProductCard({ product, onPress }: Props) {
  const toggleFavorite = useFavoritesStore(state => state.toggleFavorite);
  const addToCart = useCartStore(state => state.addToCart);
  const favorite = useFavoritesStore(state => state.favoriteIds.includes(product.id));

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.iconWrap}>
        <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      </View>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.category}>{product.category}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
      <View style={styles.actions}>
        <Pressable
          hitSlop={8}
          onPress={() => toggleFavorite(product.id)}
          style={styles.favoriteButton}>
          <Text style={styles.favoriteIcon}>{favorite ? '❤️' : '🤍'}</Text>
        </Pressable>
        <Pressable hitSlop={8} onPress={() => addToCart(product.id)} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add</Text>
        </Pressable>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#f3f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  category: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  price: {
    fontSize: 14,
    fontWeight: '700',
    color: '#2f6feb',
    marginTop: 4,
  },
  actions: {
    alignItems: 'center',
    gap: 8,
  },
  favoriteButton: {
    padding: 2,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  addButton: {
    backgroundColor: '#2f6feb',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
});
