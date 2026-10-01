import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Product } from '../types';
import QuantityStepper from './QuantityStepper';
import { useAppDispatch } from '../store/hooks';
import { updateQuantity, removeFromCart } from '../features/cart/cartSlice';

interface Props {
  product: Product;
  quantity: number;
}

export default function CartListItem({ product, quantity }: Props) {
  // const { updateQuantity, removeFromCart } = useCart();
  const dispatch = useAppDispatch()

  return (
    <View style={styles.row}>
      <Image source={{ uri: product.image }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
      </View>
      <QuantityStepper
        quantity={quantity}
        onIncrease={() => dispatch(updateQuantity({productId: product.id, quantity: quantity + 1}))}
        onDecrease={() => dispatch(updateQuantity({productId: product.id, quantity: quantity - 1}))}
      />
      <Pressable hitSlop={8} onPress={() => dispatch(removeFromCart(product.id))} style={styles.remove}>
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
  image: {
    width: 44,
    height: 44,
    borderRadius: 8,
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
