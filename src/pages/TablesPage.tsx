import React from 'react';
import { mockTables } from '../data/mockData';

export function TablesPage() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800';
      case 'occupied':
        return 'bg-red-100 text-red-800';
      case 'reserved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Disponible';
      case 'occupied':
        return 'Ocupada';
      case 'reserved':
        return 'Reservada';
      default:
        return status;
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Mesas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['A', 'B', 'C'].map((sector) => (
          <div key={sector} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Sector {sector}</h2>
            <div className="space-y-4">
              {mockTables
                .filter((table) => table.sector === sector)
                .map((table) => (
                  <div
                    key={table.id}
                    className="border rounded-lg p-4 hover:border-blue-500 transition-colors cursor-pointer"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Mesa {table.number}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(table.status)}`}>
                        {getStatusLabel(table.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      Capacidad: {table.seats} personas
                    </p>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}