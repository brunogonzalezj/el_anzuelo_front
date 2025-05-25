import React, { useState, useEffect } from 'react';
import { Plus, PencilIcon, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import type { Table } from '../types';

export function TablesPage() {
  const [tables, setTables] = useState<Table[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const fetchTables = useStore((state) => state.fetchTables);
  const updateTableStatus = useStore((state) => state.updateTableStatus);
  const createTable = useStore((state) => state.createTable);

  const [newTable, setNewTable] = useState<{
    numero: string;
    sector: string;
    capacidad: string;
    estado: 'DISPONIBLE' | 'OCUPADA' | 'RESERVADA';
  }>({
    numero: '',
    sector: 'A',
    capacidad: '',
    estado: 'DISPONIBLE',
  });

  useEffect(() => {
    const loadTables = async () => {
      try {
        const tablesData = await fetchTables();
        setTables(tablesData || []);
      } catch (error) {
        console.error('Error loading tables:', error);
      }
    };
    loadTables();
  }, [fetchTables]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DISPONIBLE':
        return 'bg-green-100 text-green-800';
      case 'OCUPADA':
        return 'bg-red-100 text-red-800';
      case 'RESERVADA':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'DISPONIBLE':
        return 'Disponible';
      case 'OCUPADA':
        return 'Ocupada';
      case 'RESERVADA':
        return 'Reservada';
      default:
        return status;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedTable) {
        await updateTableStatus(
          selectedTable.id,
          newTable.estado as 'DISPONIBLE' | 'OCUPADA' | 'RESERVADA'
        );
        const updatedTables = await fetchTables();
        setTables(updatedTables);
      } else {
        await createTable({
          numero: parseInt(newTable.numero),
          sector: newTable.sector as 'A' | 'B' | 'C',
          capacidad: parseInt(newTable.capacidad),
          estado: newTable.estado,
        });
        const updatedTables = await fetchTables();
        setTables(updatedTables);
      }
      handleCloseModal();
    } catch (error) {
      console.error('Error saving table:', error);
    }
  };

  const handleEdit = (table: Table) => {
    setSelectedTable(table);
    setNewTable({
      numero: table.numero.toString(),
      sector: table.sector,
      capacidad: table.capacidad.toString(),
      estado: table.estado || 'DISPONIBLE',
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedTable(null);
    setNewTable({
      numero: '',
      sector: 'A',
      capacidad: '',
      estado: 'DISPONIBLE',
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Mesas</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
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
                value={newTable.numero}
                onChange={e => setNewTable(prev => ({ ...prev, numero: e.target.value }))}
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
                value={newTable.capacidad}
                onChange={e => setNewTable(prev => ({ ...prev, capacidad: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newTable.estado}
                onChange={e =>
                  setNewTable(prev => ({
                    ...prev,
                    estado: e.target.value as 'DISPONIBLE' | 'OCUPADA' | 'RESERVADA',
                  }))
                }
                required
              >
                <option value="DISPONIBLE">Disponible</option>
                <option value="OCUPADA">Ocupada</option>
                <option value="RESERVADA">Reservada</option>
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
          <div key={sector} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
            <h2 className="text-xl font-semibold mb-4">Sector {sector}</h2>
            <div className="space-y-4">
              {tables
                .filter(table => table.sector === sector)
                .map(table => (
                  <div
                    key={table.id}
                    className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div>
                        <span className="font-medium">Mesa {table.numero}</span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${getStatusColor(
                              table.estado || 'DISPONIBLE'
                            )}`}
                          >
                            {getStatusLabel(table.estado || 'DISPONIBLE')}
                          </span>
                          <span className="text-sm text-gray-600">
                            {table.capacidad} personas
                          </span>
                        </div>
                      </div>
                      <button
                        className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                        onClick={() => handleEdit(table)}
                      >
                        <PencilIcon size={18} />
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