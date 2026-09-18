import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  icon: string;
  message: string;
}

export default function EmptyState({ icon, message }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 48,
    marginBottom: 12,
  },
  message: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
  },
});
