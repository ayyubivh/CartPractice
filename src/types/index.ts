export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  icon: string; // emoji used as a placeholder "image" so the app needs no network access
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface User {
  name: string;
  email: string;
}

// Params for every screen reachable via navigation.navigate(...)
export type RootStackParamList = {
  Login: undefined;
  Main: undefined;
  ProductDetail: { productId: string };
};

export type MainTabParamList = {
  Home: undefined;
  Wishlist: undefined;
  Cart: undefined;
  Profile: undefined;
};
