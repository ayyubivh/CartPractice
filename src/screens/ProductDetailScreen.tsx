import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import PrimaryButton from '../components/PrimaryButton';
import QuantityStepper from '../components/QuantityStepper';
import { getProductById } from '../data/products';
import { RootStackParamList } from '../types';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addToCart } from '../features/cart/cartSlice';
import { toggledFavorites } from '../features/favorites/favoritesSlice';

export default function ProductDetailScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ProductDetail'>>();
  const product = getProductById(route.params.productId);

  const [quantity, setQuantity] = useState(1);

  const dispatch = useAppDispatch();

  const favorite = useAppSelector(state =>
    product ? state.favorites.favoriteIds.includes(product.id) : false
  );

  if (!product) {
    return (
      <View style={styles.centered}>
        <Text>Product not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.iconWrap}>
        <Text style={styles.icon}>{product.icon}</Text>
      </View>

      <Text style={styles.category}>{product.category}</Text>
      <Text style={styles.name}>{product.name}</Text>
      <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      <Text style={styles.description}>{product.description}</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Quantity</Text>
        <QuantityStepper
          quantity={quantity}
          onIncrease={() => setQuantity(q => q + 1)}
          onDecrease={() => setQuantity(q => Math.max(1, q - 1))}
        />
      </View>

      <PrimaryButton
        title={`Add to Cart · $${(product.price * quantity).toFixed(2)}`}
        onPress={() => dispatch(addToCart({productId: product.id, quantity: quantity}))}
        style={styles.addButton}
      />
      <PrimaryButton
        title={favorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
        onPress={() => dispatch(toggledFavorites(product.id))}
        variant="secondary"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 20,
  },
  iconWrap: {
    height: 160,
    borderRadius: 16,
    backgroundColor: '#f3f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 72,
  },
  category: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginTop: 4,
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2f6feb',
    marginTop: 6,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 21,
    marginTop: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1f2937',
  },
  addButton: {
    marginBottom: 12,
  },
});
