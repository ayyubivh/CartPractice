import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import CartListItem from '../components/CartListItem';
import EmptyState from '../components/EmptyState';
import { useCartStore, useCartTotal } from '../features/cart/useCartStore';
import { useProductsStore } from '../features/products/useProductsStore';

export default function CartScreen() {
   const items = useCartStore(state => state.items);
   const clearCart = useCartStore(state => state.clearCart);
   const cartTotal = useCartTotal();
   const products = useProductsStore(state => state.items);

  const confirmCheckout = () => {
    Alert.alert('Checkout', `Order total: $${cartTotal.toFixed(2)}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Place Order', onPress: () => clearCart() },
    ]);
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Cart</Text>
        <EmptyState icon="🛒" message="Your cart is empty. Add something from the shop!" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cart</Text>
      <FlatList
        data={items}
        keyExtractor={item => String(item.productId)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;
          return <CartListItem product={product} quantity={item.quantity} />;
        }}
      />
      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${cartTotal.toFixed(2)}</Text>
        </View>
        <PrimaryButton title="Checkout" onPress={confirmCheckout} />
      </View>
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
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#ffffff',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2f6feb',
  },
});
