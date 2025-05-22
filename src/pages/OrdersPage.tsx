import React, { useState, useEffect } from 'react';
import { Clock, Check, ChefHat, Truck, Plus, Minus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import type { Order, MenuItem, Table, OrderDetail } from '../types';

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  const fetchOrders = useStore((state) => state.fetchOrders);
  const fetchTables = useStore((state) => state.fetchTables);
  const fetchMenu = useStore((state) => state.fetchMenu);
  const addOrder = useStore((state) => state.addOrder);
  const updateOrderStatus = useStore((state) => state.updateOrderStatus);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({
    tipoPedido: 'MESA' as 'MESA' | 'DELIVERY',
    mesaId: '',
    detalles: [] as OrderDetail[],
    nota: '',
    nombreCliente: '',
    direccionCliente: '',
    telefonoCliente: '',
    estado: 'PENDIENTE' as const,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersData, tablesData, menuData] = await Promise.all([
          fetchOrders(),
          fetchTables(),
          fetchMenu(),
        ]);
        setOrders(ordersData);
        setTables(tablesData);
        setMenuItems(menuData);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [fetchOrders, fetchTables, fetchMenu]);

  const statusMap = {
    PENDIENTE: {
      label: 'Pendiente',
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50',
    },
    PREPARANDO: {
      label: 'Preparando',
      icon: ChefHat,
      color: 'text-blue-600 bg-blue-50',
    },
    LISTO: { label: 'Listo', icon: Check, color: 'text-green-600 bg-green-50' },
    ENTREGADO: {
      label: 'Entregado',
      icon: Truck,
      color: 'text-gray-600 bg-gray-50',
    },
  };

  const handleStatusChange = async (
    orderId: number,
    newStatus: Order['estado']
  ) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getNextStatus = (
    currentStatus: Order['estado']
  ): Order['estado'] | null => {
    const statusFlow = {
      PENDIENTE: 'PREPARANDO',
      PREPARANDO: 'LISTO',
      LISTO: 'ENTREGADO',
      ENTREGADO: null,
    } as const;
    return statusFlow[currentStatus] || null;
  };

  const handleOrderTypeChange = (type: 'MESA' | 'DELIVERY') => {
    setNewOrder((prev) => ({ ...prev, tipoPedido: type }));
  };
  const handleAddItem = (menuItem: MenuItem) => {
    if (!menuItem?.id || typeof menuItem?.precio !== 'number') return;

    setNewOrder((prev) => {
      const existingItem = prev.detalles.find(
        (item) => item.platoId === menuItem.id
      );

      if (existingItem) {
        return {
          ...prev,
          detalles: prev.detalles.map((item) =>
            item.platoId === menuItem.id
              ? {
                  ...item,
                  cantidad: item.cantidad + 1,
                  subtotal: (item.cantidad + 1) * menuItem.precio,
                }
              : item
          ),
        };
      }

      const newDetail: OrderDetail = {
        id: 0, // Este ID será asignado por el backend
        pedidoId: 0, // Este ID será asignado por el backend
        platoId: menuItem.id,
        plato: menuItem, // Incluimos el plato completo
        cantidad: 1,
        subtotal: menuItem.precio,
        detallesExtra: [], // Array vacío de extras inicialmente
      };

      return {
        ...prev,
        detalles: [...prev.detalles, newDetail],
      };
    });
  };

  const handleRemoveItem = (platoId: number) => {
    setNewOrder((prev) => ({
      ...prev,
      detalles: prev.detalles.filter((item) => item.platoId !== platoId),
    }));
  };

  const handleQuantityChange = (platoId: number, delta: number) => {
    setNewOrder((prev) => ({
      ...prev,
      detalles: prev.detalles.map((item) => {
        if (item.platoId === platoId) {
          const newQuantity = item.cantidad + delta;
          if (newQuantity <= 0) {
            return item;
          }
          const menuItem = menuItems.find((m) => m.id === platoId);
          return {
            ...item,
            cantidad: newQuantity,
            subtotal: newQuantity * (menuItem?.precio || 0),
          };
        }
        return item;
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const total = newOrder.detalles.reduce(
        (sum, item) => sum + item.subtotal,
        0
      );

      console.log({
        ...newOrder,
        total,
        estado: 'PENDIENTE',
        mesaId:
          newOrder.tipoPedido === 'MESA'
            ? parseInt(newOrder.mesaId)
            : undefined,
      })

      await addOrder({
        ...newOrder,
        total,
        estado: 'PENDIENTE',
        mesaId:
          newOrder.tipoPedido === 'MESA'
            ? parseInt(newOrder.mesaId)
            : undefined,
      });

      const updatedOrders = await fetchOrders();
      setOrders(updatedOrders);
      handleCloseModal();
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewOrder({
      tipoPedido: 'MESA',
      mesaId: '',
      detalles: [],
      nota: '',
      nombreCliente: '',
      direccionCliente: '',
      telefonoCliente: '',
      estado: 'PENDIENTE',
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
                      {order.tipoPedido === 'DELIVERY'
                        ? 'Delivery'
                        : `Mesa ${order.mesaId}`}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${status.color}`}
                    >
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
                    <p className="text-sm text-gray-600">
                      Mesero: {order.mesero.nombre}
                    </p>
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
                  {order.detalles.map((detalle) => (
                    <div
                      key={detalle.id}
                      className="flex justify-between text-sm"
                    >
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
                  newOrder.tipoPedido === 'MESA'
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
                  newOrder.tipoPedido === 'DELIVERY'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => handleOrderTypeChange('DELIVERY')}
              >
                Delivery
              </button>
            </div>

            {newOrder.tipoPedido === 'MESA' ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mesa
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newOrder.mesaId}
                  onChange={(e) =>
                    setNewOrder((prev) => ({ ...prev, mesaId: e.target.value }))
                  }
                  required
                >
                  <option value="">Seleccionar mesa</option>
                  {tables
                    .filter((table) => table.estado === 'DISPONIBLE')
                    .map((table) => (
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
                    value={newOrder.nombreCliente}
                    onChange={(e) =>
                      setNewOrder((prev) => ({
                        ...prev,
                        nombreCliente: e.target.value,
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
                    value={newOrder.direccionCliente}
                    onChange={(e) =>
                      setNewOrder((prev) => ({
                        ...prev,
                        direccionCliente: e.target.value,
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
                    value={newOrder.telefonoCliente}
                    onChange={(e) =>
                      setNewOrder((prev) => ({
                        ...prev,
                        telefonoCliente: e.target.value,
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
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="flex items-center p-4 border rounded-lg hover:bg-gray-50"
                    onClick={() => handleAddItem(item)}
                  >
                    <div>
                      <div className="font-medium">{item.nombre}</div>
                      <div className="text-sm text-gray-600">
                        Bs. {item.precio}
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {newOrder.detalles.length > 0 && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">Items Seleccionados</h4>
                  <div className="space-y-2">
                    {newOrder.detalles.map((item) => {
                      const menuItem = menuItems.find(
                        (m) => m.id === item.platoId
                      );
                      return menuItem ? (
                        <div
                          key={item.platoId}
                          className="flex items-center justify-between"
                        >
                          <div>
                            <span className="font-medium">
                              {menuItem.nombre}
                            </span>
                            <span className="text-gray-600 ml-2">
                              Bs. {item.subtotal}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={() =>
                                handleQuantityChange(item.platoId, -1)
                              }
                            >
                              <Minus size={16} />
                            </button>
                            <span>{item.cantidad}</span>
                            <button
                              type="button"
                              className="p-1 hover:bg-gray-100 rounded"
                              onClick={() =>
                                handleQuantityChange(item.platoId, 1)
                              }
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              type="button"
                              className="ml-2 text-red-600 hover:bg-red-50 p-1 rounded"
                              onClick={() => handleRemoveItem(item.platoId)}
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ) : null;
                    })}
                  </div>
                  <div className="mt-4 pt-4 border-t flex justify-between font-medium">
                    <span>Total</span>
                    <span>
                      Bs.{' '}
                      {newOrder.detalles.reduce(
                        (sum, item) => sum + item.subtotal,
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
                value={newOrder.nota}
                onChange={(e) =>
                  setNewOrder((prev) => ({ ...prev, nota: e.target.value }))
                }
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
                disabled={
                  newOrder.detalles.length === 0 ||
                  (newOrder.tipoPedido === 'MESA' && !newOrder.mesaId)
                }
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
