export type Role = 'manager' | 'waiter' | 'cashier' | 'chef' | 'delivery';

export interface User {
  id: string;
  name: string;
  role: Role;
  active: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'fried' | 'grill' | 'oven' | 'drinks' | 'extras' | 'kids';
  image: string;
  sides?: string[];
}

export interface Table {
  id: string;
  number: number;
  sector: 'A' | 'B' | 'C';
  seats: number;
  status: 'available' | 'occupied' | 'reserved';
}

export interface Order {
  id: string;
  tableNumber?: number;
  waiter?: string;
  items: {
    menuItem: MenuItem;
    quantity: number;
    cookingPreference?: string;
  }[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  total: number;
  type: 'dine-in' | 'delivery';
  deliveryInfo?: {
    customerName: string;
    address: string;
    phone: string;
    deliveryFee: number;
  };
  createdAt: Date;
}