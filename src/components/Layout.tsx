import {Link, Outlet, useLocation, useNavigate} from 'react-router-dom';
import {
    UtensilsCrossed,
    ClipboardList,
    LayoutGrid,
    Calendar,
    Receipt,
    Package,
    Users,
    LogOut,
    Menu as MenuIcon,
    X,
    BarChart3
} from 'lucide-react';
import {cn} from '../lib/utils';
import {useStore} from '../store/useStore';
import type {Role} from '../types';
import { useState } from 'react';

const navItems = [
    {icon: BarChart3, label: 'Dashboard', path: '/dashboard', roles: ['ENCARGADO']},
    {icon: UtensilsCrossed, label: 'Menú', path: '/menu', roles: ['ENCARGADO']},
    {icon: ClipboardList, label: 'Pedidos', path: '/orders', roles: ['ENCARGADO', 'CAJERO', 'CHEF']},
    {icon: LayoutGrid, label: 'Mesas', path: '/tables', roles: ['ENCARGADO', 'CAJERO']},
    {icon: Calendar, label: 'Reservas', path: '/reservations', roles: ['ENCARGADO', 'CAJERO']},
    {icon: Receipt, label: 'Facturación', path: '/billing', roles: ['ENCARGADO', 'CAJERO']},
    {icon: Package, label: 'Inventario', path: '/inventory', roles: ['ENCARGADO', 'CHEF']},
    {icon: Users, label: 'Usuarios', path: '/users', roles: ['ENCARGADO']},
] as const;

export function Layout() {
    const location = useLocation();
    const navigate = useNavigate();
    const user = useStore((state) => state.user);
    const logout = useStore((state) => state.logout);
    const hasAccess = useStore((state) => state.hasAccess);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const filteredNavItems = navItems.filter((item) =>
        hasAccess(item.roles as unknown as Role[])
    );

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile menu button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-white shadow-lg"
                onClick={toggleSidebar}
            >
                {isSidebarOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>

            {/* Sidebar */}
            <aside className={cn(
                "w-64 bg-white shadow-lg fixed h-screen flex flex-col transition-transform duration-300 ease-in-out z-40",
                "lg:translate-x-0",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-28 flex items-center justify-center  px-6 border-b">
                    <img src="/elanzuelo_logo.webp" alt="Logo" className={"w-24 h-24"}/>
                </div>
                <div className="px-6 py-4 border-b">
                    <p className="text-sm font-medium text-gray-600">
                        Bienvenido, {user?.nombre}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                        {user?.rol === 'ENCARGADO'
                            ? 'Administrador'
                            : user?.rol === 'CAJERO'
                                ? 'Cajero'
                                : user?.rol === 'CHEF'
                                    ? 'Cocinero' : 'Mesero'}
                    </p>
                </div>
                <nav className="p-4 space-y-2 flex-grow overflow-y-auto">
                    {filteredNavItems.map(({icon: Icon, label, path}) => (
                        <Link
                            key={path}
                            to={path}
                            onClick={() => setIsSidebarOpen(false)}
                            className={cn(
                                'flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors',
                                location.pathname === path
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-600 hover:bg-gray-100'
                            )}
                        >
                            <Icon size={20}/>
                            <span>{label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t mt-auto">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20}/>
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main content */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-0 lg:ml-64 w-full">
                <div className="max-w-7xl mx-auto">
                    <Outlet/>
                </div>
            </main>
        </div>
    );
}