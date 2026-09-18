import { Product } from '../types';

// Static mock catalog — in a real app this would come from an API.
export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Wireless Headphones',
    price: 79.99,
    category: 'Electronics',
    description: 'Over-ear headphones with active noise cancellation and 30-hour battery life.',
    icon: '🎧',
  },
  {
    id: 'p2',
    name: 'Smart Watch',
    price: 149.99,
    category: 'Electronics',
    description: 'Fitness tracking, heart-rate monitor, and smartphone notifications on your wrist.',
    icon: '⌚',
  },
  {
    id: 'p3',
    name: 'Running Shoes',
    price: 64.5,
    category: 'Footwear',
    description: 'Lightweight breathable running shoes with cushioned soles.',
    icon: '👟',
  },
  {
    id: 'p4',
    name: 'Ceramic Coffee Mug',
    price: 12.0,
    category: 'Home',
    description: 'Double-walled ceramic mug that keeps drinks hot for longer.',
    icon: '☕',
  },
  {
    id: 'p5',
    name: 'Backpack',
    price: 45.0,
    category: 'Accessories',
    description: 'Water-resistant backpack with a padded laptop compartment.',
    icon: '🎒',
  },
  {
    id: 'p6',
    name: 'Desk Lamp',
    price: 28.75,
    category: 'Home',
    description: 'Adjustable LED desk lamp with three brightness levels.',
    icon: '💡',
  },
  {
    id: 'p7',
    name: 'Sunglasses',
    price: 39.99,
    category: 'Accessories',
    description: 'Polarized UV-protection sunglasses with a classic frame.',
    icon: '🕶️',
  },
  {
    id: 'p8',
    name: 'Yoga Mat',
    price: 22.5,
    category: 'Fitness',
    description: 'Non-slip yoga mat, 6mm thick, includes carry strap.',
    icon: '🧘',
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find(p => p.id === id);
}
