import React, { useState } from 'react';
import { UserPlus, Check, X, PencilIcon, Trash } from 'lucide-react';
import { mockUsers } from '../data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import type { User } from '../types';

export function UsersPage() {
  const [users, setUsers] = useState(mockUsers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState({
    name: '',
    role: 'waiter',
    active: true,
  });

  const roles = {
    manager: 'Encargado',
    waiter: 'Mesero',
    cashier: 'Cajero',
    chef: 'Chef',
    delivery: 'Repartidor',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedUser) {
      setUsers(prev =>
        prev.map(user =>
          user.id === selectedUser.id
            ? {
                ...user,
                name: newUser.name,
                role: newUser.role,
                active: newUser.active,
              }
            : user
        )
      );
    } else {
      setUsers(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newUser.name,
          role: newUser.role,
          active: newUser.active,
        },
      ]);
    }
    handleCloseModal();
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setNewUser({
      name: user.name,
      role: user.role,
      active: user.active,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (user: User) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      setUsers(prev => prev.filter(u => u.id !== user.id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedUser(null);
    setNewUser({
      name: '',
      role: 'waiter',
      active: true,
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Usuarios</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <UserPlus size={20} />
          Nuevo Usuario
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {isEditMode ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={newUser.name}
                onChange={e => setNewUser(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newUser.role}
                onChange={e => setNewUser(prev => ({ ...prev, role: e.target.value }))}
                required
              >
                {Object.entries(roles).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="active"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                checked={newUser.active}
                onChange={e => setNewUser(prev => ({ ...prev, active: e.target.checked }))}
              />
              <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                Usuario activo
              </label>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditMode ? 'Guardar Cambios' : 'Crear Usuario'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {roles[user.role as keyof typeof roles]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      user.active ? 'text-green-800' : 'text-red-800'
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
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleEdit(user)}
                  >
                    <PencilIcon size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(user)}
                  >
                    <Trash size={18} />
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