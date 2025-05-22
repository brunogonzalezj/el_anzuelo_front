export type Role = 'ENCARGADO' | 'MESERO' | 'CAJERO' | 'CHEF' | 'REPARTIDOR';
export type Status = 'ACTIVO' | 'INACTIVO';

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  username: string;
  rol: Role;
  estado: Status;
}

export interface MenuItem {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: string;
  extras?: Extra[];
}

export interface Extra {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Table {
  id: number;
  numero: number;
  sector: 'A' | 'B' | 'C';
  estado: 'DISPONIBLE' | 'RESERVADA' | 'OCUPADA';
  capacidad: number;
}

export interface OrderDetail {
  id: number;
  pedidoId: number;
  platoId: number;
  cantidad: number;
  subtotal: number;
  plato: MenuItem;
  detallesExtra: {
    id: number;
    extraId: number;
    cantidad: number;
    extra: Extra;
  }[];
}

export interface Order {
  id: number;
  fechaCreacion: Date;
  estado: 'PENDIENTE' | 'PREPARANDO' | 'LISTO' | 'ENTREGADO';
  tipoPedido: 'MESA' | 'DELIVERY';
  mesaId?: number;
  meseroId?: number;
  nombreCliente?: string;
  direccionCliente?: string;
  telefonoCliente?: string;
  repartidorId?: number;
  total: number;
  detalles: OrderDetail[];
  mesa?: Table;
  mesero?: User;
  repartidor?: User;
}

export interface AuthResponse {
  usuario: User;
  token: string;
}

export interface ApiError {
  message: string;
  status: number;
}

export interface ApiEndpoints {
  auth: {
    login: (username: string, password: string) => Promise<AuthResponse>;
    logout: () => Promise<void>;
  };
  menu: {
    getAll: () => Promise<MenuItem[]>;
    create: (item: Omit<MenuItem, 'id'>) => Promise<MenuItem>;
    update: (id: number, item: Partial<MenuItem>) => Promise<MenuItem>;
    delete: (id: number) => Promise<void>;
  };
  extras: {
    getAll: () => Promise<Extra[]>;
    create: (extra: { nombre: string; descripcion: string }) => Promise<Extra>;
    update: (id: number, extra: { nombre?: string; descripcion?: string }) => Promise<Extra>;
    delete: (id: number) => Promise<void>;
    getByPlato: (platoId: number) => Promise<Extra[]>;
  };
  orders: {
    getAll: () => Promise<Order[]>;
    create: (order: Omit<Order, 'id' | 'fechaCreacion'>) => Promise<Order>;
    update: (id: number, order: Partial<Order>) => Promise<Order>;
    updateStatus: (id: number, estado: Order['estado']) => Promise<Order>;
  };
  tables: {
    getAll: () => Promise<Table[]>;
    update: (id: number, table: Partial<Table>) => Promise<Table>;
  };
  users: {
    getAll: () => Promise<User[]>;
    create: (user: Omit<User, 'id'>) => Promise<User>;
    update: (id: number, user: Partial<User>) => Promise<User>;
    delete: (id: number) => Promise<void>;
  };
}