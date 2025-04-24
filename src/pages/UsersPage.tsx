import React from 'react';
import { UserPlus, Check, X } from 'lucide-react';
import { mockUsers } from '../data/mockData';

export function UsersPage() {
  const getRoleLabel = (role: string) => {
    const roles = {
      manager: 'Encargado',
      waiter: 'Mesero',
      cashier: 'Cajero',
      chef: 'Chef',
      delivery: 'Repartidor',
    };
    return roles[role as keyof typeof roles] || role;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {getRoleLabel(user.role)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      user.active
                        ? 'text-green-800'
                        : 'text-red-800'
                    }`}
                  >
                    {user.active ? (
                      <>
                        <Check size={16} />
                        Activo
                      </>
                    ) : (
                      <>
                        <X size={16} />
                        Inactivo
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-900">
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}