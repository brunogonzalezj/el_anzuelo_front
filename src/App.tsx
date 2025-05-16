import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { LoginForm } from './components/LoginForm';
import { ProtectedRoute } from './components/ProtectedRoute';
import { MenuPage } from './pages/MenuPage';
import { OrdersPage } from './pages/OrdersPage';
import { TablesPage } from './pages/TablesPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { BillingPage } from './pages/BillingPage';
import { InventoryPage } from './pages/InventoryPage';
import { UsersPage } from './pages/UsersPage';
import { ToastProvider } from './components/ui/Toast';
import { useStore } from './store/useStore';

function App() {
  const user = useStore((state) => state.user);

  // Determinar la ruta inicial basada en el rol del usuario
  const getInitialRoute = () => {
    if (!user) return '/login';
    
    switch (user.role) {
      case 'admin':
        return '/menu';
      case 'cashier':
        return '/orders';
      case 'chef':
        return '/orders';
      default:
        return '/login';
    }
  };

  return (
    <BrowserRouter>
      <ToastProvider>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route
            path="/"
            element={
              <ProtectedRoute allowedRoles={['admin', 'cashier', 'chef']}>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to={getInitialRoute()} replace />} />
            <Route
              path="menu"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <MenuPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute allowedRoles={['admin', 'cashier', 'chef']}>
                  <OrdersPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="tables"
              element={
                <ProtectedRoute allowedRoles={['admin', 'cashier']}>
                  <TablesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="reservations"
              element={
                <ProtectedRoute allowedRoles={['admin', 'cashier']}>
                  <ReservationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="billing"
              element={
                <ProtectedRoute allowedRoles={['admin', 'cashier']}>
                  <BillingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="inventory"
              element={
                <ProtectedRoute allowedRoles={['admin', 'chef']}>
                  <InventoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="users"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <UsersPage />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to={getInitialRoute()} replace />} />
        </Routes>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;