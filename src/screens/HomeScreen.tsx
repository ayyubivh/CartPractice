import React, { useEffect } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import ProductCard from '../components/ProductCard';
import { RootStackParamList } from '../types';
import { useCartStore, selectCartCount } from '../features/cart/useCartStore';
import { useProductsStore } from '../features/products/useProductsStore';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const cartCount = useCartStore(selectCartCount);
  const products = useProductsStore(state => state.items);
  const status = useProductsStore(state => state.status);
  const error = useProductsStore(state => state.error);
  const fetchProducts = useProductsStore(state => state.fetchProducts);

  useEffect(() => {
  if (status === 'idle') {
    fetchProducts();
  }
}, [status, fetchProducts]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shop</Text>
        {cartCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{cartCount} in cart</Text>
          </View>
        )}
      </View>

      {status === 'loading' && (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#2f6feb" />
        </View>
      )}

      {status === 'failed' && (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <Text style={styles.retry} onPress={() => fetchProducts()}>
            Tap to retry
          </Text>
        </View>
      )}

      {status === 'succeeded' && (
        <FlatList
          data={products}   
          keyExtractor={
            item => String(item.id)
          }
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
  },
  badge: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#2f6feb',
    fontSize: 12,
    fontWeight: '600',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: '#d64545',
    textAlign: 'center',
    marginBottom: 12,
  },
  retry: {
    color: '#2f6feb',
    fontWeight: '600',
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
});