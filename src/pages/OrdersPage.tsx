import React, { useState, useEffect } from 'react';
import { Clock, Check, ChefHat, Truck, Plus, Minus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import type { Order, MenuItem, Table } from '../types';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const fetchOrders = useStore((state) => state.fetchOrders);
  const fetchTables = useStore((state) => state.fetchTables);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    type: 'MESA' as const,
    tableNumber: '',
    items: [] as { menuItem: MenuItem; quantity: number; cookingPreference?: string }[],
    note: '',
    deliveryInfo: {
      customerName: '',
      address: '',
      phone: '',
      deliveryFee: 10
    }
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, tablesData] = await Promise.all([
          fetchOrders(),
          fetchTables()
        ]);
        setOrders(ordersData || []);
        setTables(tablesData || []);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    
    loadData();
  }, [fetchOrders, fetchTables]);

  const statusMap = {
    PENDIENTE: { label: 'Pendiente', icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    PREPARANDO: { label: 'Preparando', icon: ChefHat, color: 'text-blue-600 bg-blue-50' },
    LISTO: { label: 'Listo', icon: Check, color: 'text-green-600 bg-green-50' },
    ENTREGADO: { label: 'Entregado', icon: Truck, color: 'text-gray-600 bg-gray-50' },
  };

  const handleStatusChange = (orderId: string, newStatus: Order['estado']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId
          ? { ...order, estado: newStatus }
          : order
      )
    );
  };

  const getNextStatus = (currentStatus: Order['estado']): Order['estado'] | null => {
    const statusFlow = {
      PENDIENTE: 'PREPARANDO',
      PREPARANDO: 'LISTO',
      LISTO: 'ENTREGADO',
      ENTREGADO: null,
    } as const;
    return statusFlow[currentStatus] || null;
  };

  const handleOrderTypeChange = (type: 'MESA' | 'DELIVERY') => {
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
          if (newQuantity <= 0) {
            return item;
          }
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const total = newOrder.items.reduce(
      (sum, item) => sum + item.menuItem.precio * item.quantity,
      0
    );

    const newOrderData: Partial<Order> = {
      tipoPedido: newOrder.type,
      estado: 'PENDIENTE',
      total: total + (newOrder.type === 'DELIVERY' ? newOrder.deliveryInfo.deliveryFee : 0),
      mesaId: newOrder.type === 'MESA' ? parseInt(newOrder.tableNumber) : undefined,
      nombreCliente: newOrder.type === 'DELIVERY' ? newOrder.deliveryInfo.customerName : undefined,
      direccionCliente: newOrder.type === 'DELIVERY' ? newOrder.deliveryInfo.address : undefined,
      telefonoCliente: newOrder.type === 'DELIVERY' ? newOrder.deliveryInfo.phone : undefined,
      detalles: newOrder.items.map(item => ({
        platoId: item.menuItem.id,
        cantidad: item.quantity,
        subtotal: item.menuItem.precio * item.quantity
      }))
    };

    // Here you would typically call the API to create the order
    console.log('New order:', newOrderData);

    setIsModalOpen(false);
    setNewOrder({
      type: 'MESA',
      tableNumber: '',
      items: [],
      note: '',
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
          const status = statusMap[order.estado];
          const StatusIcon = status.icon;
          const nextStatus = getNextStatus(order.estado);

          return (
            <div key={order.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg font-semibold">
                      {order.tipoPedido === 'DELIVERY' ? 'Delivery' : `Mesa ${order.mesaId}`}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${status.color}`}>
                      <StatusIcon size={16} />
                      {status.label}
                    </span>
                  </div>
                  {order.tipoPedido === 'DELIVERY' && (
                    <div className="text-sm text-gray-600">
                      <p>Cliente: {order.nombreCliente}</p>
                      <p>Dirección: {order.direccionCliente}</p>
                      <p>Teléfono: {order.telefonoCliente}</p>
                    </div>
                  )}
                  {order.mesero && (
                    <p className="text-sm text-gray-600">Mesero: {order.mesero.nombre}</p>
                  )}
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-xl font-bold">Bs. {order.total}</span>
                  {nextStatus && (
                    <button
                      className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors"
                      onClick={() => handleStatusChange(order.id.toString(), nextStatus)}
                    >
                      Marcar como {statusMap[nextStatus].label}
                    </button>
                  )}
                </div>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Detalle del Pedido:</h4>
                <div className="space-y-2">
                  {order.detalles.map((detalle) => (
                    <div key={detalle.id} className="flex justify-between text-sm">
                      <span>
                        {detalle.cantidad}x {detalle.plato.nombre}
                      </span>
                      <span>Bs. {detalle.subtotal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
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
                  newOrder.type === 'MESA'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOrderTypeChange('MESA')}
              >
                Para Mesa
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 rounded-lg border ${
                  newOrder.type === 'DELIVERY'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOrderTypeChange('DELIVERY')}
              >
                Delivery
              </button>
            </div>

            {newOrder.type === 'MESA' ? (
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
                  {tables
                    .filter(table => table.estado === 'DISPONIBLE')
                    .map(table => (
                      <option key={table.id} value={table.numero}>
                        Mesa {table.numero} - Sector {table.sector}
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
              <div className="grid grid-cols-2 gap-4 mb-4 max-h-48 overflow-y-auto">
                {/* Here you would map through your menu items */}
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
                          <span className="font-medium">{item.menuItem.nombre}</span>
                          <span className="text-gray-600 ml-2">
                            Bs. {item.menuItem.precio * item.quantity}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => handleQuantityChange(item.menuItem.id.toString(), -1)}
                          >
                            <Minus size={16} />
                          </button>
                          <span>{item.quantity}</span>
                          <button
                            type="button"
                            className="p-1 hover:bg-gray-100 rounded"
                            onClick={() => handleQuantityChange(item.menuItem.id.toString(), 1)}
                          >
                            <Plus size={16} />
                          </button>
                          <button
                            type="button"
                            className="ml-2 text-red-600 hover:bg-red-50 p-1 rounded"
                            onClick={() => handleRemoveItem(item.menuItem.id.toString())}
                          >
                            ×
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
                        (sum, item) => sum + item.menuItem.precio * item.quantity,
                        0
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nota del pedido
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-md"
                value={newOrder.note}
                onChange={(e) => setNewOrder(prev => ({ ...prev, note: e.target.value }))}
                placeholder="Especificaciones especiales del cliente..."
                rows={3}
              />
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
                disabled={newOrder.items.length === 0 || (newOrder.type === 'MESA' && !newOrder.tableNumber)}
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