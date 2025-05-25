import { useState, useEffect } from 'react';
import { Receipt, CreditCard, Wallet } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useStore } from '../store/useStore';
import type { Order } from '../types';

export function BillingPage() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'qr' | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    nit: '',
  });

  const fetchOrders = useStore((state) => state.fetchOrders);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const ordersData = await fetchOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    };
    loadOrders();
  }, [fetchOrders]);

  const todaysOrders = orders.filter(
    (order) =>
      format(new Date(order.fechaCreacion), 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd')
  );

  const handlePaymentMethodSelect = (method: 'cash' | 'qr') => {
    setPaymentMethod(method);
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.13;
  };

  const generatePDF = () => {
    if (!selectedOrder || !paymentMethod) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Encabezado
    doc.setFontSize(20);
    doc.text('El Anzuelo', pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text('Factura', pageWidth / 2, 30, { align: 'center' });
    
    // Información del cliente y factura
    doc.setFontSize(10);
    doc.text(`Fecha: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 20, 40);
    doc.text(`Cliente: ${customerInfo.name}`, 20, 45);
    doc.text(`NIT/CI: ${customerInfo.nit}`, 20, 50);
    doc.text(`Método de pago: ${paymentMethod === 'cash' ? 'Efectivo' : 'QR'}`, 20, 55);

    // Tabla de items
    const tableData = selectedOrder.detalles.map((detalle) => [
      detalle.plato.nombre,
      detalle.cantidad.toString(),
      `Bs. ${detalle.plato.precio.toFixed(2)}`,
      `Bs. ${detalle.subtotal.toFixed(2)}`,
    ]);

    (doc as any).autoTable({
      startY: 65,
      head: [['Item', 'Cantidad', 'Precio', 'Total']],
      body: tableData,
      theme: 'grid',
      headStyles: { fillColor: [0, 102, 204] },
    });

    // Totales
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.text(`Subtotal: Bs. ${selectedOrder.total.toFixed(2)}`, 140, finalY);
    doc.text(`IVA (13%): Bs. ${calculateTax(selectedOrder.total).toFixed(2)}`, 140, finalY + 5);
    doc.text(`Total: Bs. ${(selectedOrder.total + calculateTax(selectedOrder.total)).toFixed(2)}`, 140, finalY + 10);

    // Pie de página
    doc.setFontSize(8);
    doc.text('Gracias por su preferencia', pageWidth / 2, finalY + 25, { align: 'center' });

    // Guardar PDF
    doc.save(`factura-${format(new Date(), 'yyyyMMdd-HHmmss')}.pdf`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Facturación</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selección de pedido */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Pedidos del día</h2>
          <div className="space-y-4">
            {orders.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No hay pedidos para el día de hoy.
                </div>
            ) : (
            todaysOrders.map((order) => (
              <div
                key={order.id}
                className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedOrder?.id === order.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'hover:border-gray-400'
                }`}
                onClick={() => setSelectedOrder(order)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-medium">
                      {order.tipoPedido === 'DELIVERY'
                        ? `Delivery - ${order.nombreCliente}`
                        : `Mesa ${order.mesaId}`}
                    </span>
                    <p className="text-sm text-gray-600">
                      {format(new Date(order.fechaCreacion), 'HH:mm', { locale: es })}
                    </p>
                  </div>
                  <span className="font-bold">Bs. {order.total}</span>
                </div>
                <div className="text-sm text-gray-600">
                  {order.detalles.map((detalle) => (
                    <div key={detalle.id}>
                      {detalle.cantidad}x {detalle.plato.nombre}
                    </div>
                  ))}
                </div>
              </div>
            ))
            )}
          </div>
        </div>

        {/* Formulario de facturación */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">Datos del Cliente</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Razón Social
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="Nombre o Razón Social"
                  value={customerInfo.name}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({ ...prev, name: e.target.value }))
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIT
                </label>
                <input
                  type="text"
                  className="w-full border rounded-lg px-3 py-2"
                  placeholder="NIT o CI"
                  value={customerInfo.nit}
                  onChange={(e) =>
                    setCustomerInfo((prev) => ({ ...prev, nit: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>

          {selectedOrder && (
            <>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-4">Detalle de Consumo</h2>
                <table className="w-full mb-4">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                        Item
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                        Cant.
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                        Precio
                      </th>
                      <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {selectedOrder.detalles.map((detalle) => (
                      <tr key={detalle.id}>
                        <td className="px-4 py-2 text-sm">{detalle.plato.nombre}</td>
                        <td className="px-4 py-2 text-sm text-right">
                          {detalle.cantidad}
                        </td>
                        <td className="px-4 py-2 text-sm text-right">
                          Bs. {detalle.plato.precio}
                        </td>
                        <td className="px-4 py-2 text-sm text-right">
                          Bs. {detalle.subtotal}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>Bs. {selectedOrder.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>IVA (13%)</span>
                    <span>
                      Bs. {calculateTax(selectedOrder.total).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>
                      Bs.{' '}
                      {(
                        selectedOrder.total + calculateTax(selectedOrder.total)
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-lg font-semibold mb-4">Método de Pago</h2>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    className={`flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition-colors ${
                      paymentMethod === 'cash'
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handlePaymentMethodSelect('cash')}
                  >
                    <Wallet />
                    Efectivo
                  </button>
                  <button
                    className={`flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition-colors ${
                      paymentMethod === 'qr'
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => handlePaymentMethodSelect('qr')}
                  >
                    <CreditCard />
                    QR
                  </button>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  className={`bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    !paymentMethod || !customerInfo.name || !customerInfo.nit
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-700'
                  }`}
                  onClick={generatePDF}
                  disabled={!paymentMethod || !customerInfo.name || !customerInfo.nit}
                >
                  <Receipt size={20} />
                  Generar Factura
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}