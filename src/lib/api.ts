import { ApiEndpoints, AuthResponse, MenuItem, Order, Table, User } from '../types';

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
      const response = await fetch(`${API_URL}/menu`, {
        headers: headers(),
      });
      return response.json();
    },
    create: async (item) => {
      const response = await fetch(`${API_URL}/menu`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(item),
      });
      return response.json();
    },
    update: async (id, item) => {
      const response = await fetch(`${API_URL}/menu/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(item),
      });
      return response.json();
    },
    delete: async (id) => {
      await fetch(`${API_URL}/menu/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
    },
  },
  orders: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/orders`, {
        headers: headers(),
      });
      return response.json();
    },
    create: async (order) => {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(order),
      });
      return response.json();
    },
    update: async (id, order) => {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(order),
      });
      return response.json();
    },
    updateStatus: async (id, status) => {
      const response = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ status }),
      });
      return response.json();
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