import { create } from 'zustand';
import type { MenuItem, Order, Table, User } from '../types';

interface Store {
  // Menu State
  menu: MenuItem[];
  addMenuItem: (item: MenuItem) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  removeMenuItem: (id: string) => void;

  // Orders State
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (id: string, order: Partial<Order>) => void;

  // Tables State
  tables: Table[];
  updateTableStatus: (id: string, status: Table['status']) => void;

  // Users State
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const useStore = create<Store>((set) => ({
  menu: [],
  addMenuItem: (item) => set((state) => ({ menu: [...state.menu, item] })),
  updateMenuItem: (id, item) =>
    set((state) => ({
      menu: state.menu.map((menuItem) =>
        menuItem.id === id ? { ...menuItem, ...item } : menuItem
      ),
    })),
  removeMenuItem: (id) =>
    set((state) => ({
      menu: state.menu.filter((item) => item.id !== id),
    })),

  orders: [],
  addOrder: (order) => set((state) => ({ orders: [...state.orders, order] })),
  updateOrder: (id, order) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === id ? { ...o, ...order } : o)),
    })),

  tables: [],
  updateTableStatus: (id, status) =>
    set((state) => ({
      tables: state.tables.map((table) =>
        table.id === id ? { ...table, status } : table
      ),
    })),

  users: [],
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
}));