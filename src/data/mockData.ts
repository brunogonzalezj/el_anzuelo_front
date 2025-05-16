import { MenuItem, Order, Table, User } from '../types';

export const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Pescado Frito',
    description: 'Pescado fresco frito con limón y especias',
    price: 45,
    category: 'fried',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363',
    extras: ['Arroz', 'Ensalada', 'Plátanos']
  },
  {
    id: '2',
    name: 'Parrillada Mixta',
    description: 'Selección de mariscos a la parrilla',
    price: 85,
    category: 'grill',
    image: 'https://images.unsplash.com/photo-1559847844-5315695dadae',
    extras: ['Papas', 'Chimichurri', 'Vegetales']
  },
  {
    id: '3',
    name: 'Calamares al Ajillo',
    description: 'Calamares frescos al horno con ajo y perejil',
    price: 35,
    category: 'oven',
    image: 'https://images.unsplash.com/photo-1585545335512-777d0f9f6131',
    extras: ['Pan al Ajo', 'Limón']
  },
  {
    id: '4',
    name: 'Limonada Fresca',
    description: 'Limonada natural con hierba buena',
    price: 12,
    category: 'drinks',
    image: 'https://images.unsplash.com/photo-1523371683773-affcb4a7c97f',
    extras: []
  },
  {
    id: '5',
    name: 'Pescaditos Junior',
    description: 'Pescado empanizado para niños',
    price: 25,
    category: 'kids',
    image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58',
    extras: ['Papas Fritas', 'Salsa de Tomate']
  }
];

export const mockOrders: Order[] = [
  {
    id: '1',
    tableNumber: 5,
    waiter: 'Carlos Pérez',
    items: [
      { menuItem: mockMenuItems[0], quantity: 2, cookingPreference: 'Bien cocido', selectedExtras: ['Arroz', 'Ensalada'] },
      { menuItem: mockMenuItems[3], quantity: 2 }
    ],
    status: 'preparing',
    total: 114,
    type: 'dine-in',
    createdAt: new Date()
  },
  {
    id: '2',
    items: [
      { menuItem: mockMenuItems[1], quantity: 1, selectedExtras: ['Papas', 'Chimichurri'] },
      { menuItem: mockMenuItems[3], quantity: 2 }
    ],
    status: 'pending',
    total: 109,
    type: 'delivery',
    deliveryInfo: {
      customerName: 'Ana García',
      address: 'Calle Principal 123',
      phone: '555-0123',
      deliveryFee: 10
    },
    createdAt: new Date()
  }
];

export const mockTables: Table[] = [
  { id: '1', number: 1, sector: 'A', seats: 4, status: 'available' },
  { id: '2', number: 2, sector: 'A', seats: 6, status: 'occupied' },
  { id: '3', number: 3, sector: 'B', seats: 4, status: 'reserved' },
  { id: '4', number: 4, sector: 'B', seats: 2, status: 'available' },
  { id: '5', number: 5, sector: 'C', seats: 8, status: 'occupied' }
];

export const mockUsers: User[] = [
  { id: '1', name: 'María López', role: 'manager', active: true },
  { id: '2', name: 'Carlos Pérez', role: 'waiter', active: true },
  { id: '3', name: 'Ana García', role: 'cashier', active: true },
  { id: '4', name: 'Juan Martínez', role: 'chef', active: true },
  { id: '5', name: 'Pedro Sánchez', role: 'delivery', active: true }
];