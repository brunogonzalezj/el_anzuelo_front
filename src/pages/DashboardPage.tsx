import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStore } from '../store/useStore';
import type { Order } from '../types';

export function DashboardPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    dailyTotal: 0,
    monthlyTotal: 0,
    totalOrders: 0,
    averageTicket: 0,
  });

  const fetchOrders = useStore((state) => state.fetchOrders);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await fetchOrders();
        setOrders(ordersData);

        // Calculate statistics
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const todaysOrders = ordersData.filter(order => {
          const orderDate = new Date(order.fechaCreacion);
          orderDate.setHours(0, 0, 0, 0);
          return orderDate.getTime() === today.getTime();
        });

        const thisMonth = ordersData.filter(order => {
          const orderDate = new Date(order.fechaCreacion);
          return orderDate.getMonth() === today.getMonth() &&
                 orderDate.getFullYear() === today.getFullYear();
        });

        const dailyTotal = todaysOrders.reduce((sum, order) => sum + order.total, 0);
        const monthlyTotal = thisMonth.reduce((sum, order) => sum + order.total, 0);
        const averageTicket = thisMonth.length > 0 ? monthlyTotal / thisMonth.length : 0;

        setStats({
          dailyTotal,
          monthlyTotal,
          totalOrders: thisMonth.length,
          averageTicket,
        });

      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };
    loadOrders();
  }, [fetchOrders]);

  const StatCard = ({ title, value, icon: Icon, color }: {
    title: string;
    value: string;
    icon: typeof BarChart3;
    color: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  const RecentOrders = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Filtrar solo las órdenes de hoy
    const todaysOrders = orders.filter(order => {
      const orderDate = new Date(order.fechaCreacion);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    // Ordenar las órdenes por fecha de creación (de más reciente a más antigua)
    const sortedOrders = [...todaysOrders].sort((a, b) =>
        new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Pedidos Recientes</h2>
          {sortedOrders.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay pedidos para hoy</p>
          ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Hora</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Tipo</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">Estado</th>
                    <th className="px-4 py-2 text-right text-xs font-medium text-gray-500">Total</th>
                  </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                  {sortedOrders.slice(0, 5).map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm">
                          {format(new Date(order.fechaCreacion), 'HH:mm', { locale: es })}
                        </td>
                        <td className="px-4 py-2 text-sm">
                          {order.tipoPedido === 'DELIVERY' ? 'Delivery' : `Mesa ${order.mesaId}`}
                        </td>
                        <td className="px-4 py-2 text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                        order.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' :
                            order.estado === 'PREPARANDO' ? 'bg-blue-100 text-blue-800' :
                                order.estado === 'LISTO' ? 'bg-green-100 text-green-800' :
                                    'bg-gray-100 text-gray-800'
                    }`}>
                      {order.estado}
                    </span>
                        </td>
                        <td className="px-4 py-2 text-sm text-right">
                          Bs. {order.total}
                        </td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </div>
    );
  };

  const OrdersByType = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysOrders = orders.filter(order => {
      const orderDate = new Date(order.fechaCreacion);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    const deliveryOrders = todaysOrders.filter(order => order.tipoPedido === 'DELIVERY').length;
    const tableOrders = todaysOrders.filter(order => order.tipoPedido === 'MESA').length;
    const total = deliveryOrders + tableOrders;

    const deliveryPercentage = total > 0 ? (deliveryOrders / total) * 100 : 0;
    const tablePercentage = total > 0 ? (tableOrders / total) * 100 : 0;

    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-4">Distribución de Pedidos</h2>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Delivery</span>
              <span>{deliveryOrders} pedidos ({deliveryPercentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full"
                style={{ width: `${deliveryPercentage}%` }}
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Mesa</span>
              <span>{tableOrders} pedidos ({tablePercentage.toFixed(1)}%)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full"
                style={{ width: `${tablePercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Ventas del Día"
          value={`Bs. ${stats.dailyTotal.toFixed(2)}`}
          icon={BarChart3}
          color="bg-blue-100 text-blue-600"
        />
        <StatCard
          title="Ventas del Mes"
          value={`Bs. ${stats.monthlyTotal.toFixed(2)}`}
          icon={TrendingUp}
          color="bg-green-100 text-green-600"
        />
        <StatCard
          title="Pedidos del Mes"
          value={stats.totalOrders.toString()}
          icon={Users}
          color="bg-purple-100 text-purple-600"
        />
        <StatCard
          title="Ticket Promedio"
          value={`Bs. ${stats.averageTicket.toFixed(2)}`}
          icon={DollarSign}
          color="bg-orange-100 text-orange-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div>
          <OrdersByType />
        </div>
      </div>
    </div>
  );
}