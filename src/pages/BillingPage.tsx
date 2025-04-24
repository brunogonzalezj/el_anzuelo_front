import { Receipt, CreditCard, Wallet } from 'lucide-react';

export function BillingPage() {
  const mockBill = {
    items: [
      { name: 'Pescado Frito', quantity: 2, price: 45, total: 90 },
      { name: 'Limonada Fresca', quantity: 2, price: 12, total: 24 },
    ],
    subtotal: 114,
    tax: 14.82,
    total: 128.82,
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Facturación</h1>
      </div>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Datos del Cliente</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Razón Social
              </label>
              <input
                type="text"
                className="w-full border rounded-lg px-3 py-2"
                placeholder="Nombre o Razón Social"
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
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Detalle de Consumo</h2>
          <table className="w-full mb-4">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Item</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Cant.</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Precio</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {mockBill.items.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 text-sm">{item.name}</td>
                  <td className="px-4 py-2 text-sm text-right">{item.quantity}</td>
                  <td className="px-4 py-2 text-sm text-right">Bs. {item.price}</td>
                  <td className="px-4 py-2 text-sm text-right">Bs. {item.total}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="border-t pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>Bs. {mockBill.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>IVA (13%)</span>
              <span>Bs. {mockBill.tax}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>Bs. {mockBill.total}</span>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Método de Pago</h2>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50">
              <Wallet />
              Efectivo
            </button>
            <button className="flex items-center justify-center gap-2 border rounded-lg px-4 py-2 hover:bg-gray-50">
              <CreditCard />
              QR
            </button>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg flex items-center gap-2">
            <Receipt size={20} />
            Generar Factura
          </button>
        </div>
      </div>
    </div>
  );
}