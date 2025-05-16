import React, { useState } from 'react';
import { Plus, PencilIcon, Trash } from 'lucide-react';
import { mockTables } from '../data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import type { Table } from '../types';

export function TablesPage() {
  const [tables, setTables] = useState(mockTables);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [newTable, setNewTable] = useState({
    number: '',
    sector: 'A',
    seats: '',
    status: 'available' as const,
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedTable) {
      setTables(prev =>
        prev.map(table =>
          table.id === selectedTable.id
            ? {
                ...table,
                number: parseInt(newTable.number),
                sector: newTable.sector as 'A' | 'B' | 'C',
                seats: parseInt(newTable.seats),
                status: newTable.status,
              }
            : table
        )
      );
    } else {
      setTables(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          number: parseInt(newTable.number),
          sector: newTable.sector as 'A' | 'B' | 'C',
          seats: parseInt(newTable.seats),
          status: newTable.status,
        },
      ]);
    }
    handleCloseModal();
  };

  const handleEdit = (table: Table) => {
    setSelectedTable(table);
    setNewTable({
      number: table.number.toString(),
      sector: table.sector,
      seats: table.seats.toString(),
      status: table.status,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (table: Table) => {
    if (window.confirm('¿Está seguro que desea eliminar esta mesa?')) {
      setTables(prev => prev.filter(t => t.id !== table.id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedTable(null);
    setNewTable({
      number: '',
      sector: 'A',
      seats: '',
      status: 'available',
    });
  };

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
                Sector
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newTable.sector}
                onChange={e => setNewTable(prev => ({ ...prev, sector: e.target.value }))}
                required
              >
                <option value="A">Sector A</option>
                <option value="B">Sector B</option>
                <option value="C">Sector C</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Capacidad
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={newTable.seats}
                onChange={e => setNewTable(prev => ({ ...prev, seats: e.target.value }))}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {['A', 'B', 'C'].map(sector => (
          <div key={sector} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Sector {sector}</h2>
            <div className="space-y-4">
              {tables
                .filter(table => table.sector === sector)
                .map(table => (
                  <div
                    key={table.id}
                    className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Mesa {table.number}</span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                          table.status
                        )}`}
                      >
                        {getStatusLabel(table.status)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      Capacidad: {table.seats} personas
                    </p>
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
    </div>
  );
}