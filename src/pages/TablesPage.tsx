import React, { useState, useEffect } from 'react';
import { Plus, PencilIcon, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import type { Table } from '../types';

export function TablesPage() {
  const tables = useStore((state) => state.tables);
  const fetchTables = useStore((state) => state.fetchTables);
  const updateTable = useStore((state) => state.updateTableStatus);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [newTable, setNewTable] = useState({
    number: '',
    capacity: '',
    status: 'available' as const
  });

  useEffect(() => {
    fetchTables();
  }, [fetchTables]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedTable) {
      await updateTable(selectedTable.id, {
        number: parseInt(newTable.number),
        capacity: parseInt(newTable.capacity.toString()),
        status: newTable.status
      });
    } else {
      // Add new table logic here
    }
    handleCloseModal();
  };

  const handleEdit = (table: Table) => {
    setSelectedTable(table);
    setNewTable({
      number: table.number.toString(),
      capacity: table.capacity.toString(),
      status: table.status
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (table: Table) => {
    if (window.confirm('¿Está seguro que desea eliminar esta mesa?')) {
      // Delete table logic here
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedTable(null);
    setNewTable({
      number: '',
      capacity: '',
      status: 'available'
    });
  };

  // Group tables by sector
  const sectors = ['A', 'B', 'C'];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Mesas</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Nueva Mesa
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sectors.map(sector => (
          <div key={sector} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Sector {sector}</h2>
            <div className="space-y-4">
              {tables
                .filter(table => table.sector === sector)
                .map(table => (
                  <div
                    key={table.id}
                    className="border rounded-lg p-4"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium">Mesa {table.number}</h3>
                        <p className="text-sm text-gray-600">
                          Capacidad: {table.capacity} personas
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          table.status
                        )}`}
                      >
                        {getStatusLabel(table.status)}
                      </span>
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                        onClick={() => handleEdit(table)}
                      >
                        <PencilIcon size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:bg-red-50 p-2 rounded"
                        onClick={() => handleDelete(table)}
                      >
                        <Trash size={18} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {isEditMode ? 'Editar Mesa' : 'Crear Nueva Mesa'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de Mesa
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={newTable.number}
                onChange={e => setNewTable(prev => ({ ...prev, number: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={newTable.capacity}
                onChange={e => setNewTable(prev => ({ ...prev, capacity: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newTable.status}
                onChange={e =>
                  setNewTable(prev => ({
                    ...prev,
                    status: e.target.value as Table['status'],
                  }))
                }
                required
              >
                <option value="available">Disponible</option>
                <option value="occupied">Ocupada</option>
                <option value="reserved">Reservada</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditMode ? 'Guardar Cambios' : 'Crear Mesa'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}