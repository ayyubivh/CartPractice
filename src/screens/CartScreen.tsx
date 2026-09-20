import React from 'react';
import { Alert, FlatList, StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import CartListItem from '../components/CartListItem';
import EmptyState from '../components/EmptyState';
import { getProductById } from '../data/products';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectCartItems, selectCartTotal, clearCart } from '../features/cart/cartSlice';

export default function CartScreen() {
   const items = useAppSelector(selectCartItems);
   const cartTotal = useAppSelector(selectCartTotal);
   const dispatch = useAppDispatch();

  const confirmCheckout = () => {
    Alert.alert('Checkout', `Order total: $${cartTotal.toFixed(2)}`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Place Order', onPress: () => dispatch(clearCart()) },
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
        keyExtractor={item => item.productId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const product = getProductById(item.productId);
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
