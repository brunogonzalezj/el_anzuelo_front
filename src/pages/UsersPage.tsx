import React, { useState, useEffect } from 'react';
import { UserPlus, Check, X, PencilIcon, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import type { User, Role, Status } from '../types';

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const fetchUsers = useStore((state) => state.fetchUsers);
  const addUser = useStore((state) => state.addUser);
  const updateUser = useStore((state) => state.updateUser);
  const removeUser = useStore((state) => state.removeUser);

  const [newUser, setNewUser] = useState({
    nombre: '',
    apellido: '',
    username: '',
    rol: 'MESERO' as Role,
    estado: 'ACTIVO' as Status,
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData);
      } catch (error) {
        console.error('Error loading users:', error);
      }
    };
    loadUsers();
  }, [fetchUsers]);

  const roles = {
    ENCARGADO: 'Encargado',
    MESERO: 'Mesero',
    CAJERO: 'Cajero',
    CHEF: 'Chef',
    REPARTIDOR: 'Repartidor',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedUser) {
        await updateUser(selectedUser.id, newUser);
      } else {
        await addUser(newUser);
      }
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setNewUser({
      nombre: user.nombre,
      apellido: user.apellido,
      username: user.username,
      rol: user.rol,
      estado: user.estado,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (user: User) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      try {
        await removeUser(user.id);
        const updatedUsers = await fetchUsers();
        setUsers(updatedUsers);
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedUser(null);
    setNewUser({
      nombre: '',
      apellido: '',
      username: '',
      rol: 'MESERO',
      estado: 'ACTIVO',
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
                value={newUser.nombre}
                onChange={e => setNewUser(prev => ({ ...prev, nombre: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={newUser.apellido}
                onChange={e => setNewUser(prev => ({ ...prev, apellido: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Usuario
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={newUser.username}
                onChange={e => setNewUser(prev => ({ ...prev, username: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rol
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newUser.rol}
                onChange={e => setNewUser(prev => ({ ...prev, rol: e.target.value as Role }))}
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
                checked={newUser.estado === 'ACTIVO'}
                onChange={e => setNewUser(prev => ({ 
                  ...prev, 
                  estado: e.target.checked ? 'ACTIVO' : 'INACTIVO' 
                }))}
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
                Usuario
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
                  <div className="text-sm font-medium text-gray-900">
                    {user.nombre} {user.apellido}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{user.username}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    {roles[user.rol]}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex items-center gap-1 ${
                      user.estado === 'ACTIVO' ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    {user.estado === 'ACTIVO' ? (
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