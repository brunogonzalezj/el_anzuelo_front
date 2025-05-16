import type { ClassValue } from 'clsx';

export type Role = 'admin' | 'cashier' | 'chef' | 'messeur';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'fried' | 'grill' | 'oven' | 'drinks' | 'extras' | 'kids';
  selectedExtras?: string[];
}

export interface Extra {
  id: string;
  name: string;
  price: number;
  description: string;
  category: 'sides' | 'sauces' | 'drinks' | 'other';
  available: boolean;
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
    selectedExtras?: string[];
  }[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  total: number;
  type: 'dine-in' | 'delivery';
  note?: string;
  deliveryInfo?: {
    customerName: string;
    address: string;
    phone: string;
    deliveryFee: number;
  };
  createdAt: Date;
  paymentStatus?: 'pending' | 'paid';
  paymentMethod?: 'cash' | 'qr';
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiEndpoints {
  auth: {
    login: (email: string, password: string) => Promise<AuthResponse>;
    logout: () => Promise<void>;
  };
  menu: {
    getAll: () => Promise<MenuItem[]>;
    create: (item: Omit<MenuItem, 'id'>) => Promise<MenuItem>;
    update: (id: string, item: Partial<MenuItem>) => Promise<MenuItem>;
    delete: (id: string) => Promise<void>;
  };
  extras: {
    getAll: () => Promise<Extra[]>;
    create: (extra: Omit<Extra, 'id'>) => Promise<Extra>;
    update: (id: string, extra: Partial<Extra>) => Promise<Extra>;
    delete: (id: string) => Promise<void>;
  };
  orders: {
    getAll: () => Promise<Order[]>;
    create: (order: Omit<Order, 'id'>) => Promise<Order>;
    update: (id: string, order: Partial<Order>) => Promise<Order>;
    updateStatus: (id: string, status: Order['status']) => Promise<Order>;
  };
  tables: {
    getAll: () => Promise<Table[]>;
    update: (id: string, table: Partial<Table>) => Promise<Table>;
  };
  users: {
    getAll: () => Promise<User[]>;
    create: (user: Omit<User, 'id'>) => Promise<User>;
    update: (id: string, user: Partial<User>) => Promise<User>;
    delete: (id: string) => Promise<void>;
  };
}