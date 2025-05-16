import React, { useState } from 'react';
import { Clock, Check, ChefHat, Truck, Plus } from 'lucide-react';
import { mockOrders } from '../data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import type { Order } from '../types';

export function OrdersPage() {
  const [orders, setOrders] = useState(mockOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Crear Nuevo Pedido
            </DialogTitle>
          </DialogHeader>
          {/* Aquí irá el formulario para crear nuevos pedidos */}
          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit">
              Crear Pedido
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}