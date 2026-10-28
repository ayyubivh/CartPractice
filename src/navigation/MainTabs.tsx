import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import WishlistScreen from '../screens/WishlistScreen';
import CartScreen from '../screens/CartScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MainTabParamList } from '../types';
import { useCartStore, selectCartCount } from '../features/cart/useCartStore';
import { useFavoritesStore } from '../features/favorites/useFavoritesStore';


const Tab = createBottomTabNavigator<MainTabParamList>();

const ICONS: Record<keyof MainTabParamList, string> = {
  Home: '🏠',
  Wishlist: '🤍',
  Cart: '🛒',
  Profile: '👤',
};

const HomeIcon = () => <Text>{ICONS.Home}</Text>;
const WishlistIcon = () => <Text>{ICONS.Wishlist}</Text>;
const CartIcon = () => <Text>{ICONS.Cart}</Text>;
const ProfileIcon = () => <Text>{ICONS.Profile}</Text>;

export default function MainTabs() {
  const cartCount = useCartStore(selectCartCount);
  const favoriteIds = useFavoritesStore(state => state.favoriteIds);

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: HomeIcon }} />
      <Tab.Screen
        name="Wishlist"
        component={WishlistScreen}
        options={{
          tabBarIcon: WishlistIcon,
          tabBarBadge: favoriteIds.length > 0 ? favoriteIds.length : undefined,
        }}
      />
      <Tab.Screen
        name="Cart"
        component={CartScreen}
        options={{
          tabBarIcon: CartIcon,
          tabBarBadge: cartCount > 0 ? cartCount : undefined,
        }}
      />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ tabBarIcon: ProfileIcon }} />
    </Tab.Navigator>
  );
}
