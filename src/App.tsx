import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { MenuPage } from './pages/MenuPage';
import { OrdersPage } from './pages/OrdersPage';
import { TablesPage } from './pages/TablesPage';
import { ReservationsPage } from './pages/ReservationsPage';
import { BillingPage } from './pages/BillingPage';
import { InventoryPage } from './pages/InventoryPage';
import { UsersPage } from './pages/UsersPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/menu" replace />} />
          <Route path="menu" element={<MenuPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="tables" element={<TablesPage />} />
          <Route path="reservations" element={<ReservationsPage />} />
          <Route path="billing" element={<BillingPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;