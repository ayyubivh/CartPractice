export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  description: string;
  stock: number;
  image: string;
}

export interface CartItem {
  productId: number;
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
  ProductDetail: { productId: number };
};

export type MainTabParamList = {
  Home: undefined;
  Wishlist: undefined;
  Cart: undefined;
  Profile: undefined;
};
