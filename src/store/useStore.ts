import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { MenuItem, Order, Table, User, Role } from '../types';
import { api } from '../lib/api';

interface AuthState {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface MenuState {
  menu: MenuItem[];
  fetchMenu: () => Promise<void>;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => Promise<void>;
  removeMenuItem: (id: string) => Promise<void>;
}

interface OrderState {
  orders: Order[];
  fetchOrders: () => Promise<void>;
  addOrder: (order: Omit<Order, 'id'>) => Promise<void>;
  updateOrder: (id: string, order: Partial<Order>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
}

interface TableState {
  tables: Table[];
  fetchTables: () => Promise<void>;
  updateTableStatus: (id: string, status: Table['status']) => Promise<void>;
}

interface UserState {
  users: User[];
  fetchUsers: () => Promise<void>;
  addUser: (user: Omit<User, 'id'>) => Promise<void>;
  updateUser: (id: string, user: Partial<User>) => Promise<void>;
  removeUser: (id: string) => Promise<void>;
}

interface Store extends AuthState, MenuState, OrderState, TableState, UserState {
  hasAccess: (allowedRoles: Role[]) => boolean;
}

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      login: async (email, password) => {
        const response = await api.auth.login(email, password);
        set({ user: response.user, token: response.token });
      },
      logout: async () => {
        await api.auth.logout();
        set({ user: null, token: null });
      },

      // Menu State
      menu: [],
      fetchMenu: async () => {
        const menu = await api.menu.getAll();
        set({ menu });
      },
      addMenuItem: async (item) => {
        const newItem = await api.menu.create(item);
        set((state) => ({ menu: [...state.menu, newItem] }));
      },
      updateMenuItem: async (id, item) => {
        const updatedItem = await api.menu.update(id, item);
        set((state) => ({
          menu: state.menu.map((menuItem) =>
            menuItem.id === id ? updatedItem : menuItem
          ),
        }));
      },
      removeMenuItem: async (id) => {
        await api.menu.delete(id);
        set((state) => ({
          menu: state.menu.filter((item) => item.id !== id),
        }));
      },

      // Orders State
      orders: [],
      fetchOrders: async () => {
        const orders = await api.orders.getAll();
        set({ orders });
      },
      addOrder: async (order) => {
        const newOrder = await api.orders.create(order);
        set((state) => ({ orders: [...state.orders, newOrder] }));
      },
      updateOrder: async (id, order) => {
        const updatedOrder = await api.orders.update(id, order);
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
        }));
      },
      updateOrderStatus: async (id, status) => {
        const updatedOrder = await api.orders.updateStatus(id, status);
        set((state) => ({
          orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
        }));
      },

      // Tables State
      tables: [],
      fetchTables: async () => {
        const tables = await api.tables.getAll();
        set({ tables });
      },
      updateTableStatus: async (id, status) => {
        const updatedTable = await api.tables.update(id, { status });
        set((state) => ({
          tables: state.tables.map((table) =>
            table.id === id ? updatedTable : table
          ),
        }));
      },

      // Users State
      users: [],
      fetchUsers: async () => {
        const users = await api.users.getAll();
        set({ users });
      },
      addUser: async (user) => {
        const newUser = await api.users.create(user);
        set((state) => ({ users: [...state.users, newUser] }));
      },
      updateUser: async (id, user) => {
        const updatedUser = await api.users.update(id, user);
        set((state) => ({
          users: state.users.map((u) => (u.id === id ? updatedUser : u)),
        }));
      },
      removeUser: async (id) => {
        await api.users.delete(id);
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }));
      },

      // Access Control
      hasAccess: (allowedRoles: Role[]) => {
        const user = get().user;
        return user ? allowedRoles.includes(user.role) : false;
      },
    }),
    {
      name: 'restaurant-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);