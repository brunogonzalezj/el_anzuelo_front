import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  UtensilsCrossed,
  ClipboardList,
  LayoutGrid,
  Calendar,
  Receipt,
  Package,
  Users,
  LogOut,
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: UtensilsCrossed, label: 'Menú', path: '/menu' },
  { icon: ClipboardList, label: 'Pedidos', path: '/orders' },
  { icon: LayoutGrid, label: 'Mesas', path: '/tables' },
  { icon: Calendar, label: 'Reservas', path: '/reservations' },
  { icon: Receipt, label: 'Facturación', path: '/billing' },
  { icon: Package, label: 'Inventario', path: '/inventory' },
  { icon: Users, label: 'Usuarios', path: '/users' },
];

export function Layout() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside className="w-64 bg-white shadow-lg">
        <div className="h-16 flex items-center px-6 border-b">
          <h1 className="text-xl font-bold text-blue-600">El Anzuelo</h1>
        </div>
        <nav className="p-4 space-y-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                'flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                location.pathname === path
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          ))}
          <button className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors mt-8">
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}