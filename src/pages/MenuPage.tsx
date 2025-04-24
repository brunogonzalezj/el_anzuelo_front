import React from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { mockMenuItems } from '../data/mockData';

export function MenuPage() {
  const categories = {
    fried: 'Fritos',
    grill: 'Parrilla',
    oven: 'Horno',
    drinks: 'Bebidas',
    extras: 'Extras',
    kids: 'Menú Anzuelito',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Menú</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus size={20} />
          Nuevo Plato
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMenuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="text-sm text-blue-600">{categories[item.category]}</span>
                </div>
                <span className="text-lg font-bold">Bs. {item.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              {item.sides && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Acompañamientos:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.sides.map((side) => (
                      <span
                        key={side}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {side}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div className="flex justify-end gap-2 mt-4">
                <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                  <Edit size={18} />
                </button>
                <button className="text-red-600 hover:bg-red-50 p-2 rounded">
                  <Trash size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}