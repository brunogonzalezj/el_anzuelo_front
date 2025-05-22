import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import type {MenuItem, Order, Table, User, Role, Extra} from '../types';
import {api} from '../lib/api';

interface AuthState {
    user: User | null;
    token: string | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
}

interface MenuState {
    menu: MenuItem[];
    fetchMenu: () => Promise<MenuItem[]>;
    addMenuItem: (item: Omit<MenuItem, 'id'>) => Promise<void>;
    updateMenuItem: (id: number, item: Partial<MenuItem>) => Promise<void>;
    removeMenuItem: (id: number) => Promise<void>;
}

interface ExtrasState {
    extras: Extra[];
    fetchExtras: () => Promise<Extra[]>;
    addExtra: (extra: {
        name: string;
        price: number;
        description: string;
        category: string;
        available: boolean
    }) => Promise<void>;
    updateExtra: (id: number, extra: Partial<Extra>) => Promise<void>;
    removeExtra: (id: number) => Promise<void>;
}

interface OrderState {
    orders: Order[];
    fetchOrders: () => Promise<Order[]>;
    addOrder: (order: Omit<Order, 'id' | 'fechaCreacion'>) => Promise<void>;
    updateOrder: (id: number, order: Partial<Order>) => Promise<void>;
    updateOrderStatus: (id: number, estado: Order['estado']) => Promise<void>;
}

interface TableState {
    tables: Table[];
    fetchTables: () => Promise<Table[]>;
    updateTableStatus: (id: number, estado: Table['estado']) => Promise<void>;
}

interface UserState {
    users: User[];
    fetchUsers: () => Promise<User[]>;
    addUser: (user: Omit<User, 'id'>) => Promise<void>;
    updateUser: (id: number, user: Partial<User>) => Promise<void>;
    removeUser: (id: number) => Promise<void>;
}

interface Store extends AuthState, MenuState, ExtrasState, OrderState, TableState, UserState {
    hasAccess: (allowedRoles: Role[]) => boolean;
}

export const useStore = create<Store>()(
    persist(
        (set, get) => ({
            // Auth State
            user: null,
            token: null,
            login: async (username, password) => {
                const response = await api.auth.login(username, password);
                set({user: response.usuario, token: response.token});
            },
            logout: async () => {
                await api.auth.logout();
                set({user: null, token: null});
            },

            // Menu State
            menu: [],
            fetchMenu: async () => {
                const menu = await api.menu.getAll();
                set({menu});
                return menu;
            },
            addMenuItem: async (item) => {
                const newItem = await api.menu.create(item);
                set((state) => ({menu: [...state.menu, newItem]}));
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

            // Extras State
            extras: [],
            fetchExtras: async () => {
                const extras = await api.extras.getAll();
                set({extras});
                return extras;
            },
            addExtra: async (extra) => {
                const newExtra = await api.extras.create(extra);
                set((state) => ({extras: [...state.extras, newExtra]}));
            },
            updateExtra: async (id, extra) => {
                const updatedExtra = await api.extras.update(id, extra);
                set((state) => ({
                    extras: state.extras.map((item) =>
                        item.id === id ? updatedExtra : item
                    ),
                }));
            },
            removeExtra: async (id) => {
                await api.extras.delete(id);
                set((state) => ({
                    extras: state.extras.filter((item) => item.id !== id),
                }));
            },

            // Orders State
            orders: [],
            fetchOrders: async () => {
                const orders = await api.orders.getAll();
                set({orders});
                return orders;
            },
            addOrder: async (order) => {
                const newOrder = await api.orders.create(order);
                set((state) => ({orders: [...state.orders, newOrder]}));
            },
            updateOrder: async (id, order) => {
                const updatedOrder = await api.orders.update(id, order);
                set((state) => ({
                    orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
                }));
            },
            updateOrderStatus: async (id, estado) => {
                const updatedOrder = await api.orders.updateStatus(id, estado);
                set((state) => ({
                    orders: state.orders.map((o) => (o.id === id ? updatedOrder : o)),
                }));
            },

            // Tables State
            tables: [],
            fetchTables: async () => {
                const tables = await api.tables.getAll();
                set({tables});
                return tables;
            },
            updateTableStatus: async (id, estado) => {
                const updatedTable = await api.tables.update(id, {estado});
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
                set({users});
                return users;
            },
            addUser: async (user) => {
                const newUser = await api.users.create(user);
                set((state) => ({users: [...state.users, newUser]}));
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
                return user ? allowedRoles.includes(user.rol) : false;
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