import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

// Reusable +/- control. Used by ProductDetailScreen and CartScreen, both of
// which call back into CartContext's updateQuantity/addToCart — this
// component itself holds no state.
export default function QuantityStepper({ quantity, onIncrease, onDecrease }: Props) {
  return (
    <View style={styles.row}>
      <Pressable style={styles.button} onPress={onDecrease}>
        <Text style={styles.buttonText}>−</Text>
      </Pressable>
      <Text style={styles.quantity}>{quantity}</Text>
      <Pressable style={styles.button} onPress={onIncrease}>
        <Text style={styles.buttonText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#2f6feb',
    fontWeight: '700',
  },
  quantity: {
    minWidth: 32,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
});
