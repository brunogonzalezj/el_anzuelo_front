import React, { useState } from 'react';
import { Clock, Check, ChefHat, Truck, Plus, Minus } from 'lucide-react';
import { mockOrders, mockMenuItems, mockTables } from '../data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import type { Order, MenuItem } from '../types';

export function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    type: 'dine-in' as const,
    tableNumber: '',
    items: [] as { menuItem: MenuItem; quantity: number; cookingPreference?: string }[],
    deliveryInfo: {
      customerName: '',
      address: '',
      phone: '',
      deliveryFee: 10
    }
  });

  const statusMap = {
    pending: { label: 'Pendiente', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    preparing: { label: 'Preparando', icon: ChefHat, color: 'text-blue-600 bg-blue-50' },
    ready: { label: 'Listo', icon: Check, color: 'text-green-600 bg-green-50' },
    delivered: { label: 'Entregado', icon: Truck, color: 'text-gray-600 bg-gray-50' },
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  const getNextStatus = (currentStatus: Order['status']): Order['status'] | null => {
    const statusFlow = {
      pending: 'preparing',
      preparing: 'ready',
      ready: 'delivered',
      delivered: null,
    };
    return statusFlow[currentStatus] || null;
  };

  const handleOrderTypeChange = (type: 'dine-in' | 'delivery') => {
    setNewOrder(prev => ({ ...prev, type }));
  };

  const handleAddItem = (menuItem: MenuItem) => {
    setNewOrder(prev => {
      const existingItem = prev.items.find(item => item.menuItem.id === menuItem.id);
      if (existingItem) {
        return {
          ...prev,
          items: prev.items.map(item =>
            item.menuItem.id === menuItem.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        };
      }
      return {
        ...prev,
        items: [...prev.items, { menuItem, quantity: 1 }]
      };
    });
  };

  const handleRemoveItem = (menuItemId: string) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.filter(item => item.menuItem.id !== menuItemId)
    }));
  };

  const handleQuantityChange = (menuItemId: string, delta: number) => {
    setNewOrder(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.menuItem.id === menuItemId) {
          const newQuantity = item.quantity + delta;
          return newQuantity > 0
            ? { ...item, quantity: newQuantity }
            : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = newOrder.items.reduce(
      (sum, item) => sum + item.menuItem.price * item.quantity,
      0
    );

    const newOrderData: Order = {
      id: Math.random().toString(36).substr(2, 9),
      ...newOrder,
      status: 'pending',
      total: total + (newOrder.type === 'delivery' ? newOrder.deliveryInfo.deliveryFee : 0),
      createdAt: new Date(),
    };

    setOrders(prev => [...prev, newOrderData]);
    setIsModalOpen(false);
    setNewOrder({
      type: 'dine-in',
      tableNumber: '',
      items: [],
      deliveryInfo: {
        customerName: '',
        address: '',
        phone: '',
        deliveryFee: 10
      }
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Nuevo Pedido
        </button>
      </div>

      <div className="grid gap-6">
        {orders.map((order) => {
          const status = statusMap[order.status];
          const StatusIcon = status.icon;
          const nextStatus = getNextStatus(order.status);

          return (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-semibold">
                      {order.type === 'delivery' ? 'Delivery' : `Mesa ${order.tableNumber}`}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${status.color}`}>
                      <StatusIcon size={16} />
                      {status.label}
                    </span>
                  </div>
                  {order.type === 'delivery' && order.deliveryInfo && (
                    <div className="text-sm text-gray-600">
                      <p>Cliente: {order.deliveryInfo.customerName}</p>
                      <p>Dirección: {order.deliveryInfo.address}</p>
                      <p>Teléfono: {order.deliveryInfo.phone}</p>
                    </div>
                  )}
                  {order.waiter && (
                    <p className="text-sm text-gray-600">Mesero: {order.waiter}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xl font-bold">Bs. {order.total}</span>
                  {nextStatus && (
                    <button
                      className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                      onClick={() => handleStatusChange(order.id, nextStatus)}
                    >
                      Marcar como {statusMap[nextStatus].label}
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Detalle del Pedido:</h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>
                        {item.quantity}x {item.menuItem.name}
                        {item.cookingPreference && (
                          <span className="text-gray-500"> ({item.cookingPreference})</span>
                        )}
                      </span>
                      <span>Bs. {item.menuItem.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Crear Nuevo Pedido
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4">
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  newOrder.type === 'dine-in'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOrderTypeChange('dine-in')}
              >
                Para Mesa
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  newOrder.type === 'delivery'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOrderTypeChange('delivery')}
              >
                Delivery
              </button>
            </div>

            {newOrder.type === 'dine-in' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesa
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newOrder.tableNumber}
                  onChange={(e) => setNewOrder(prev => ({ ...prev, tableNumber: e.target.value }))}
                  required
                >
                  <option value="">Seleccionar mesa</option>
                  {mockTables
                    .filter(table => table.status === 'available')
                    .map(table => (
                      <option key={table.id} value={table.number}>
                        Mesa {table.number} - Sector {table.sector}
                      </option>
                    ))}
                </select>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newOrder.deliveryInfo.customerName}
                    onChange={(e) =>
                      setNewOrder(prev => ({
                        ...prev,
                        deliveryInfo: { ...prev.deliveryInfo, customerName: e.target.value }
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newOrder.deliveryInfo.address}
                    onChange={(e) =>
                      setNewOrder(prev => ({
                        ...prev,
                        deliveryInfo: { ...prev.deliveryInfo, address: e.target.value }
                      }))
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border rounded-md"
                    value={newOrder.deliveryInfo.phone}
                    onChange={(e) =>
                      setNewOrder(prev => ({
                        ...prev,
                        deliveryInfo: { ...prev.deliveryInfo, phone: e.target.value }
                      }))
                    }
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <h3 className="font-medium mb-2">Agregar Items</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                {mockMenuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                    onClick={() => handleAddItem(item)}
                  >
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-gray-600">Bs. {item.price}</div>
                    </div>
                  </button>
                ))}
              </div>

              {newOrder.items.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Items Seleccionados</h4>
                  <div className="space-y-2">
                    {newOrder.items.map((item) => (
                      <div
                        key={item.menuItem.id}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <span className="font-medium">{item.menuItem.name}</span>
                          <span className="text-gray-600 ml-2">
                            Bs. {item.menuItem.price * item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => handleQuantityChange(item.menuItem.id, -1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => handleQuantityChange(item.menuItem.id, 1)}
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      Bs.{' '}
                      {newOrder.items.reduce(
                        (sum, item) => sum + item.menuItem.price * item.quantity,
                        0
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={newOrder.items.length === 0 || (newOrder.type === 'dine-in' && !newOrder.tableNumber)}
              >
                Crear Pedido
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}