import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PrimaryButton from '../components/PrimaryButton';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useFavorites } from '../context/FavoritesContext';

// Pulls from all three contexts at once — a good "is this screen worth the
// prop-drilling pain" example: without Context/Redux, getting user, cart,
// and favorites data here would mean threading all three down through the
// tab + stack navigators.
export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { cartCount, cartTotal } = useCart();
  const { favoriteIds } = useFavorites();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.card}>
        <Text style={styles.avatar}>🙂</Text>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </View>

      <View style={styles.stats}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{cartCount}</Text>
          <Text style={styles.statLabel}>Items in Cart</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>${cartTotal.toFixed(2)}</Text>
          <Text style={styles.statLabel}>Cart Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{favoriteIds.length}</Text>
          <Text style={styles.statLabel}>Wishlist</Text>
        </View>
      </View>

      <PrimaryButton title="Log Out" onPress={logout} variant="danger" style={styles.logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f8fa',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eef0f3',
    marginBottom: 16,
  },
  avatar: {
    fontSize: 40,
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
  },
  email: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eef0f3',
  },
  statValue: {
    fontSize: 17,
    fontWeight: '700',
    color: '#2f6feb',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 4,
    textAlign: 'center',
  },
  logout: {
    marginTop: 'auto',
  },
});
