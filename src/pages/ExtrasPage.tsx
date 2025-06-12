import React, { useState, useEffect } from 'react';
import { Plus, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import type { Extra } from '../types';

export function ExtrasPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const extras = useStore((state) => state.extras);
  const fetchExtras = useStore((state) => state.fetchExtras);
  const addExtra = useStore((state) => state.addExtra);
  const removeExtra = useStore((state) => state.removeExtra);
  const fetchInventory = useStore((state) => state.fetchInventory);
  const inventory = useStore((state) => state.inventory);

  const [newExtra, setNewExtra] = useState({
    nombre: '',
    descripcion: '',
    inventarioId: 0,
    cantidadInventario: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchExtras(), fetchInventory()]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [fetchExtras, fetchInventory]);

  const handleExtraInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewExtra(prev => ({ ...prev, [name]: value }));
  };

  const handleDeleteExtra = async (extra: Extra) => {
    if (window.confirm('¿Está seguro que desea eliminar este acompañamiento?')) {
      try {
        await removeExtra(extra.id);
      } catch (error) {
        console.error('Error deleting extra:', error);
      }
    }
  };

  const handleExtraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addExtra(newExtra);
      handleCloseExtrasModal();
    } catch (error) {
      console.error('Error saving extra:', error);
    }
  };

  const handleCloseExtrasModal = () => {
    setIsModalOpen(false);
    setNewExtra({
      nombre: '',
      descripcion: '',
      inventarioId: 0,
      cantidadInventario: 0,
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Acompañamientos</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Nuevo Acompañamiento
        </button>
      </div>

      {/* Modal para crear acompañamientos */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseExtrasModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Crear Nuevo Acompañamiento
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleExtraSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre
              </label>
              <input
                type="text"
                name="nombre"
                value={newExtra.nombre}
                onChange={handleExtraInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción
              </label>
              <textarea
                name="descripcion"
                value={newExtra.descripcion}
                onChange={handleExtraInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Item de Inventario Vinculado
              </label>
              <select
                name="inventarioId"
                value={newExtra.inventarioId}
                onChange={handleExtraInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Selecciona un item</option>
                {inventory.map(item => (
                  <option key={item.id} value={item.id}>
                    {item.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cantidad a reducir del stock
              </label>
              <input
                type="number"
                name="cantidadInventario"
                min={0}
                value={newExtra.cantidadInventario}
                onChange={handleExtraInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseExtrasModal}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Crear Acompañamiento
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Lista de Acompañamientos */}
      <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {extras.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No hay acompañamientos registrados
            </div>
          ) : (
            extras.map((extra) => (
              <div
                key={extra.id}
                className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-medium text-lg mb-2">{extra.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-3">{extra.descripcion}</p>
                  </div>
                  <button
                    className="text-red-600 hover:bg-red-50 p-2 rounded ml-2"
                    onClick={() => handleDeleteExtra(extra)}
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}