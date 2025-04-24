import React from 'react';
import { Package, AlertTriangle } from 'lucide-react';

export function InventoryPage() {
  const mockInventory = [
    {
      id: '1',
      name: 'Pescado Sábalo',
      category: 'Pescados',
      stock: 25,
      unit: 'kg',
      minStock: 20,
    },
    {
      id: '2',
      name: 'Camarón',
      category: 'Mariscos',
      stock: 15,
      unit: 'kg',
      minStock: 18,
    },
    {
      id: '3',
      name: 'Arroz',
      category: 'Acompañamientos',
      stock: 50,
      unit: 'kg',
      minStock: 30,
    },
    {
      id: '4',
      name: 'Aceite',
      category: 'Insumos',
      stock: 10,
      unit: 'l',
      minStock: 15,
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Control de Inventario</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Package size={20} />
          Registrar Compra
        </button>
      </div>

      <div className="grid gap-6">
        {['Pescados', 'Mariscos', 'Acompañamientos', 'Insumos'].map((category) => (
          <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">{category}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockInventory
                  .filter((item) => item.category === category)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.stock < item.minStock && (
                          <AlertTriangle
                            size={20}
                            className="text-yellow-500"
                            title="Stock bajo"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Stock Actual:</span>
                          <span
                            className={
                              item.stock < item.minStock
                                ? 'text-yellow-600 font-medium'
                                : ''
                            }
                          >
                            {item.stock} {item.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Stock Mínimo:</span>
                          <span>{item.minStock} {item.unit}</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}