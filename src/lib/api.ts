import { ApiEndpoints } from '../types';

const API_URL = 'https://d538-189-28-70-112.ngrok-free.app/api';
const token = localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'ngrok-skip-browser-warning': 'true',
  Authorization: `Bearer ${token}`,
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

      const data = await response.json();
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.usuario));
      } else {
        throw new Error('No se recibió token del servidor');
      }

      return data;
    },
    logout: async () => {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
  },
  menu: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/platos`, {
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error fetching menu items');
      }
      return response.json();
    },
    create: async (item) => {
      const response = await fetch(`${API_URL}/platos`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error('Error creating menu item');
      }
      return response.json();
    },
    update: async (id, item) => {
      const response = await fetch(`${API_URL}/platos/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error('Error updating menu item');
      }
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_URL}/platos/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error deleting menu item');
      }
    },
  },
  extras: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/extras`, {
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error fetching extras');
      }
      return response.json();
    },
    create: async (extra) => {
      const response = await fetch(`${API_URL}/extras`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(extra),
      });
      if (!response.ok) {
        throw new Error('Error creating extra');
      }
      return response.json();
    },
    update: async (id, extra) => {
      const response = await fetch(`${API_URL}/extras/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(extra),
      });
      if (!response.ok) {
        throw new Error('Error updating extra');
      }
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_URL}/extras/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error deleting extra');
      }
    },
    getByPlato: async (platoId) => {
      const response = await fetch(`${API_URL}/extras/plato/${platoId}`, {
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error fetching extras for plate');
      }
      return response.json();
    },
  },
  orders: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/pedidos`, {
        headers: headers(),
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error('Error fetching orders');
      }
      return response.json();
    },
    create: async (order) => {
      const response = await fetch(`${API_URL}/pedidos`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(order),
      });
      if (!response.ok) {
        throw new Error('Error creating order');
      }
      return response.json();
    },
    update: async (id, order) => {
      const response = await fetch(`${API_URL}/pedidos/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(order),
      });
      if (!response.ok) {
        throw new Error('Error updating order');
      }
      return response.json();
    },
    updateStatus: async (id, estado) => {
      const response = await fetch(`${API_URL}/pedidos/${id}/estado`, {
        method: 'PATCH',
        headers: headers(),
        body: JSON.stringify({ estado }),
      });
      if (!response.ok) {
        throw new Error('Error updating order status');
      }
      return response.json();
    },
  },
  tables: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/mesas`, {
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error fetching tables');
      }
      return response.json();
    },
    update: async (id, table) => {
      const response = await fetch(`${API_URL}/mesas/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(table),
      });
      if (!response.ok) {
        throw new Error('Error updating table');
      }
      return response.json();
    },
    create: async (table) => {
      const response = await fetch(`${API_URL}/mesas`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(table),
      });
      if (!response.ok) {
        throw new Error('Error creating table');
      }
      return response.json();
    },
  },
  reservations: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/reservas`, {
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error fetching reservations');
      }
      return response.json();
    },
    create: async (reservation) => {
      const response = await fetch(`${API_URL}/reservas`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(reservation),
      });
      if (!response.ok) {
        throw new Error('Error creating reservation');
      }
      return response.json();
    },
    update: async (id, reservation) => {
      const response = await fetch(`${API_URL}/reservas/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(reservation),
      });
      if (!response.ok) {
        throw new Error('Error updating reservation');
      }
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_URL}/reservas/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error deleting reservation');
      }
    },
  },
  users: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/usuarios`, {
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error fetching users');
      }
      return response.json();
    },
    create: async (user) => {
      const response = await fetch(`${API_URL}/usuarios`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Error creating user');
      }
      return response.json();
    },
    update: async (id, user) => {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(user),
      });
      if (!response.ok) {
        throw new Error('Error updating user');
      }
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_URL}/usuarios/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error deleting user');
      }
    },
  },
  inventory: {
    getAll: async () => {
      const response = await fetch(`${API_URL}/inventario`, {
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error fetching inventory');
      }
      return response.json();
    },
    create: async (item) => {
      const response = await fetch(`${API_URL}/inventario`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error('Error creating inventory item');
      }
      return response.json();
    },
    update: async (id, item) => {
      const response = await fetch(`${API_URL}/inventario/${id}`, {
        method: 'PUT',
        headers: headers(),
        body: JSON.stringify(item),
      });
      if (!response.ok) {
        throw new Error('Error updating inventory item');
      }
      return response.json();
    },
    delete: async (id) => {
      const response = await fetch(`${API_URL}/inventario/${id}`, {
        method: 'DELETE',
        headers: headers(),
      });
      if (!response.ok) {
        throw new Error('Error deleting inventory item');
      }
    },
  },
};