import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { RootStackParamList } from '../types';
import { useAppSelector } from '../store/hooks';
import { selectProducts } from '../features/products/productsSlice';

export default function WishlistScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const favoriteIds = useAppSelector(state => state.favorites.favoriteIds);
  const allProducts = useAppSelector(selectProducts);

  const products = favoriteIds
    .map(id => allProducts.find(p => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wishlist</Text>
      {products.length === 0 ? (
        <EmptyState icon="🤍" message="No favorites yet. Tap the heart on a product to save it here." />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});
