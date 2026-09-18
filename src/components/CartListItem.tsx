import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types';
import QuantityStepper from './QuantityStepper';
import { useCart } from '../context/CartContext';

interface Props {
  product: Product;
  quantity: number;
}

export default function CartListItem({ product, quantity }: Props) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <View style={styles.row}>
      <Text style={styles.icon}>{product.icon}</Text>
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
      <QuantityStepper
        quantity={quantity}
        onIncrease={() => updateQuantity(product.id, quantity + 1)}
        onDecrease={() => updateQuantity(product.id, quantity - 1)}
      />
      <Pressable hitSlop={8} onPress={() => removeFromCart(product.id)} style={styles.remove}>
        <Text style={styles.removeText}>✕</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1f2937',
  },
  price: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  remove: {
    marginLeft: 12,
    padding: 4,
  },
  removeText: {
    fontSize: 16,
    color: '#d64545',
  },
});
