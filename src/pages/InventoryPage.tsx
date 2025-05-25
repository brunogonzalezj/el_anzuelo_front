import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, PencilIcon, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import type { InventoryItem } from '../types';

export function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const fetchInventory = useStore((state) => state.fetchInventory);
  const addInventoryItem = useStore((state) => state.addInventoryItem);
  const updateInventoryItem = useStore((state) => state.updateInventoryItem);
  const removeInventoryItem = useStore((state) => state.removeInventoryItem);

  const [newItem, setNewItem] = useState({
    nombre: '',
    categoria: 'PESCADOS' as InventoryItem['categoria'],
    stockActual: '',
    unidadMedida: 'kg' as InventoryItem['unidadMedida'],
    stockMinimo: '',
  });

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const inventoryData = await fetchInventory();
        setInventory(inventoryData);
      } catch (error) {
        console.error('Error loading inventory:', error);
      }
    };
    loadInventory();
  }, [fetchInventory]);

  const categories = {
    PESCADOS: 'Pescados',
    MARISCOS: 'Mariscos',
    EXTRAS: 'Extras',
    INSUMOS: 'Insumos',
    LIMPIEZA: 'Limpieza',
    VERDURAS: 'Verduras',
  };

  const units = {
    kg: 'Kilogramos',
    l: 'Litros',
    unidad: 'Unidades',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedItem) {
        await updateInventoryItem(selectedItem.id, {
          nombre: newItem.nombre,
          categoria: newItem.categoria,
          stockActual: Number(newItem.stockActual),
          unidadMedida: newItem.unidadMedida,
          stockMinimo: Number(newItem.stockMinimo),
        });
      } else {
        await addInventoryItem({
          nombre: newItem.nombre,
          categoria: newItem.categoria,
          stockActual: Number(newItem.stockActual),
          unidadMedida: newItem.unidadMedida,
          stockMinimo: Number(newItem.stockMinimo),
        });
      }
      const updatedInventory = await fetchInventory();
      setInventory(updatedInventory);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving inventory item:', error);
    }
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setNewItem({
      nombre: item.nombre,
      categoria: item.categoria,
      stockActual: item.stockActual.toString(),
      unidadMedida: item.unidadMedida,
      stockMinimo: item.stockMinimo.toString(),
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: InventoryItem) => {
    if (window.confirm('¿Está seguro que desea eliminar este item?')) {
      try {
        await removeInventoryItem(item.id);
        const updatedInventory = await fetchInventory();
        setInventory(updatedInventory);
      } catch (error) {
        console.error('Error deleting inventory item:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedItem(null);
    setNewItem({
      nombre: '',
      categoria: 'PESCADOS',
      stockActual: '',
      unidadMedida: 'kg',
      stockMinimo: '',
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Control de Inventario</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Crear Item
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {isEditMode ? 'Editar Item' : 'Crear Nuevo Item'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Item
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={newItem.nombre}
                onChange={e => setNewItem(prev => ({ ...prev, nombre: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newItem.categoria}
                onChange={e => setNewItem(prev => ({ ...prev, categoria: e.target.value as InventoryItem['categoria'] }))}
                required
              >
                {Object.entries(categories).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Actual
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newItem.stockActual}
                  onChange={e => setNewItem(prev => ({ ...prev, stockActual: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newItem.unidadMedida}
                  onChange={e => setNewItem(prev => ({ ...prev, unidadMedida: e.target.value as InventoryItem['unidadMedida'] }))}
                  required
                >
                  {Object.entries(units).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Mínimo
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border rounded-md"
                value={newItem.stockMinimo}
                onChange={e => setNewItem(prev => ({ ...prev, stockMinimo: e.target.value }))}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditMode ? 'Guardar Cambios' : 'Crear Item'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid gap-6">
        {Object.entries(categories).map(([category, label]) => (
          <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-4 sm:px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">{label}</h2>
            </div>
            <div className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory
                  .filter(item => item.categoria === category)
                  .map(item => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{item.nombre}</h3>
                        {item.stockActual < item.stockMinimo && (
                          <AlertTriangle
                            size={20}
                            className="text-yellow-500"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Stock Actual:</span>
                          <span
                            className={
                              item.stockActual < item.stockMinimo
                                ? 'text-yellow-600 font-medium'
                                : ''
                            }
                          >
                            {item.stockActual} {units[item.unidadMedida]}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Stock Mínimo:</span>
                          <span>
                            {item.stockMinimo} {units[item.unidadMedida]}
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                          onClick={() => handleEdit(item)}
                        >
                          <PencilIcon size={18} />
                        </button>
                        <button
                          className="text-red-600 hover:bg-red-50 p-2 rounded"
                          onClick={() => handleDelete(item)}
                        >
                          <Trash size={18} />
                        </button>
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