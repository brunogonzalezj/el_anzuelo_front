import { ApiEndpoints, AuthResponse, MenuItem, Order, Table, User, Extra } from '../types';

// Mock users for testing
const mockUsers = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@elanzuelo.com',
    password: 'admin123',
    role: 'admin',
    active: true,
  },
  {
    id: '2',
    name: 'Cajero',
    email: 'cashier@elanzuelo.com',
    password: 'cashier123',
    role: 'cashier',
    active: true,
  },
  {
    id: '3',
    name: 'Cocinero',
    email: 'chef@elanzuelo.com',
    password: 'chef123',
    role: 'chef',
    active: true,
  },
] as const;

// Mock menu items for testing
const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Pescado Frito',
    description: 'Pescado fresco frito con limón y especias',
    price: 45,
    category: 'fried',
    selectedExtras: []
  },
  {
    id: '2',
    name: 'Parrillada Mixta',
    description: 'Selección de mariscos a la parrilla',
    price: 85,
    category: 'grill',
    selectedExtras: []
  },
  {
    id: '3',
    name: 'Calamares al Ajillo',
    description: 'Calamares frescos al horno con ajo y perejil',
    price: 35,
    category: 'oven',
    selectedExtras: []
  }
];

// Mock extras for testing
const mockExtras: Extra[] = [
  {
    id: '1',
    name: 'Arroz',
    price: 10,
    description: 'Porción de arroz blanco',
    category: 'sides',
    available: true
  },
  {
    id: '2',
    name: 'Ensalada',
    price: 12,
    description: 'Ensalada fresca de la casa',
    category: 'sides',
    available: true
  },
  {
    id: '3',
    name: 'Papas Fritas',
    price: 15,
    description: 'Porción de papas fritas',
    category: 'sides',
    available: true
  }
];

// Mock orders for testing
const mockOrders: Order[] = [
  {
    id: '1',
    tableNumber: 5,
    waiter: 'Carlos Pérez',
    items: [
      { 
        menuItem: mockMenuItems[0], 
        quantity: 2, 
        cookingPreference: 'Bien cocido',
        selectedExtras: [mockExtras[0].id, mockExtras[1].id]
      }
    ],
    status: 'preparing',
    total: 114,
    type: 'dine-in',
    createdAt: new Date()
  }
];

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

// Simulated API endpoints
export const api: ApiEndpoints = {
  auth: {
    login: async (email: string, password: string) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const user = mockUsers.find((u) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const token = btoa(`${user.email}:${user.role}`);
      const response: AuthResponse = {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active
        },
        token
      };
      
      return response;
    },
    logout: async () => {
      localStorage.removeItem('token');
    },
  },
  menu: {
    getAll: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockMenuItems;
    },
    create: async (item: Omit<MenuItem, 'id'>) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const newItem: MenuItem = {
        ...item,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      mockMenuItems.push(newItem);
      return newItem;
    },
    update: async (id: string, item: Partial<MenuItem>) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const index = mockMenuItems.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Menu item not found');
      
      mockMenuItems[index] = { ...mockMenuItems[index], ...item };
      return mockMenuItems[index];
    },
    delete: async (id: string) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const index = mockMenuItems.findIndex(i => i.id === id);
      if (index === -1) throw new Error('Menu item not found');
      
      mockMenuItems.splice(index, 1);
    },
  },
  extras: {
    getAll: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockExtras;
    },
    create: async (extra: Omit<Extra, 'id'>) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const newExtra: Extra = {
        ...extra,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      mockExtras.push(newExtra);
      return newExtra;
    },
    update: async (id: string, extra: Partial<Extra>) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const index = mockExtras.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Extra not found');
      
      mockExtras[index] = { ...mockExtras[index], ...extra };
      return mockExtras[index];
    },
    delete: async (id: string) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const index = mockExtras.findIndex(e => e.id === id);
      if (index === -1) throw new Error('Extra not found');
      
      mockExtras.splice(index, 1);
    },
  },
  orders: {
    getAll: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockOrders;
    },
    create: async (order: Omit<Order, 'id'>) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const newOrder: Order = {
        ...order,
        id: Math.random().toString(36).substr(2, 9)
      };
      
      mockOrders.push(newOrder);
      return newOrder;
    },
    update: async (id: string, order: Partial<Order>) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const index = mockOrders.findIndex(o => o.id === id);
      if (index === -1) throw new Error('Order not found');
      
      mockOrders[index] = { ...mockOrders[index], ...order };
      return mockOrders[index];
    },
    updateStatus: async (id: string, status: Order['status']) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 300));
      
      const index = mockOrders.findIndex(o => o.id === id);
      if (index === -1) throw new Error('Order not found');
      
      mockOrders[index].status = status;
      return mockOrders[index];
    },
  },
  tables: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/tables`, {
        headers: headers(),
      });
      return response.json();
    },
    update: async (id, table) => {
      const response = await fetch(`${API_URL}/tables/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(table),
      });
      return response.json();
    },
  },
  users: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/users`, {
        headers: headers(),
      });
      return response.json();
    },
    create: async (user) => {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(user),
      });
      return response.json();
    },
    update: async (id, user) => {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(user),
      });
      return response.json();
    },
    delete: async (id) => {
      await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
    },
  },
};