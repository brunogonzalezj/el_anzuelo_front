import { ApiEndpoints, AuthResponse, MenuItem, Order, Table, User, Extra } from '../types';

const API_URL = 'http://localhost:3000/api';

const headers = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.getItem('token')}`,
});

export const api: ApiEndpoints = {
  auth: {
    login: async (username: string, password: string) => {
      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      
      if (!response.ok) {
        throw new Error('Invalid credentials');
      }
      
      return response.json();
    },
    logout: async () => {
      localStorage.removeItem('token');
    },
  },
  menu: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/platos`, {
        headers: headers(),
      });
      return response.json();
    },
    create: async (item) => {
      const response = await fetch(`${API_URL}/platos`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(item),
      });
      return response.json();
    },
    update: async (id, item) => {
      const response = await fetch(`${API_URL}/platos/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(item),
      });
      return response.json();
    },
    delete: async (id) => {
      await fetch(`${API_URL}/platos/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
    },
  },
  extras: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/extras`, {
        headers: headers(),
      });
      return response.json();
    },
    create: async (extra) => {
      const response = await fetch(`${API_URL}/extras`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(extra),
      });
      return response.json();
    },
    update: async (id, extra) => {
      const response = await fetch(`${API_URL}/extras/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(extra),
      });
      return response.json();
    },
    delete: async (id) => {
      await fetch(`${API_URL}/extras/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
    },
    getByPlato: async (platoId) => {
      const response = await fetch(`${API_URL}/extras/plato/${platoId}`, {
        headers: headers(),
      });
      return response.json();
    },
  },
  orders: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/pedidos`, {
        headers: headers(),
      });
      return response.json();
    },
    create: async (order) => {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(order),
      });
      return response.json();
    },
    update: async (id, order) => {
      const response = await fetch(`${API_URL}/pedidos/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(order),
      });
      return response.json();
    },
    updateStatus: async (id, estado) => {
      const response = await fetch(`${API_URL}/pedidos/${id}/estado`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify({ estado }),
      });
      return response.json();
    },
  },
  tables: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/mesas`, {
        headers: headers(),
      });
      return response.json();
    },
    update: async (id, table) => {
      const response = await fetch(`${API_URL}/mesas/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(table),
      });
      return response.json();
    },
  },
  users: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/usuarios`, {
        headers: headers(),
      });
      return response.json();
    },
    create: async (user) => {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(user),
      });
      return response.json();
    },
    update: async (id, user) => {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(user),
      });
      return response.json();
    },
    delete: async (id) => {
      await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
    },
  },
};