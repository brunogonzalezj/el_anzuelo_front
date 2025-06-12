import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import type { MenuItem } from '../types';

export function MenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);

  const menuItems = useStore((state) => state.menu);
  const extras = useStore((state) => state.extras);
  const fetchMenu = useStore((state) => state.fetchMenu);
  const fetchExtras = useStore((state) => state.fetchExtras);
  const addMenuItem = useStore((state) => state.addMenuItem);
  const updateMenuItem = useStore((state) => state.updateMenuItem);
  const removeMenuItem = useStore((state) => state.removeMenuItem);
  const fetchInventory = useStore((state) => state.fetchInventory);
  const inventory = useStore((state) => state.inventory);

  const [newDish, setNewDish] = useState({
    nombre: '',
    categoria: 'fritos',
    precio: '',
    descripcion: '',
    extras: [] as number[],
    inventarioId: 0,
    cantidadInventario: 0
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([fetchMenu(), fetchExtras(), fetchInventory()]);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [fetchMenu, fetchExtras, fetchInventory]);

  const categories = {
    fritos: 'Fritos',
    parrilla: 'Parrilla',
    horno: 'Horno',
    bebidas: 'Bebidas',
    extras: 'Extras',
    infante: 'Menú Anzuelito',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDish(prev => ({ ...prev, [name]: value }));
  };

  const handleExtraToggle = (extraId: number) => {
    setNewDish(prev => {
      const isSelected = prev.extras.includes(extraId);
      return {
        ...prev,
        extras: isSelected
            ? prev.extras.filter(id => id !== extraId)
            : [...prev.extras, extraId]
      };
    });
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setNewDish({
      nombre: item.nombre,
      categoria: item.categoria,
      precio: item.precio.toString(),
      descripcion: item.descripcion,
      extras: item.extras ?
          item.extras.map(extra => extra.extra?.id || extra.id) : [],
      inventarioId: item.inventarioId || 0,
      cantidadInventario: item.cantidadInventario || 0,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: MenuItem) => {
    if (window.confirm('¿Está seguro que desea eliminar este plato?')) {
      try {
        await removeMenuItem(item.id);
      } catch (error) {
        console.error('Error deleting menu item:', error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedItem) {
        await updateMenuItem(selectedItem.id, {
          nombre: newDish.nombre,
          categoria: newDish.categoria,
          precio: Number(newDish.precio),
          descripcion: newDish.descripcion,
          extras: newDish.extras
        });
      } else {
        await addMenuItem({
          nombre: newDish.nombre,
          categoria: newDish.categoria,
          precio: Number(newDish.precio),
          descripcion: newDish.descripcion,
          extras: newDish.extras
        });
      }
      handleCloseModal();
      fetchMenu();
      fetchExtras();
    } catch (error) {
      console.error('Error saving menu item:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedItem(null);
    setNewDish({
      nombre: '',
      categoria: 'fritos',
      precio: '',
      descripcion: '',
      extras: [],
      inventarioId: 0,
      cantidadInventario: 0,
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Platos</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-full sm:w-auto"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Nuevo Plato
        </button>
      </div>

      {/* Lista de Platos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="text-lg font-semibold">{item.nombre}</h3>
                <span className="text-sm text-blue-600">{categories[item.categoria as keyof typeof categories]}</span>
              </div>
              <span className="text-lg font-bold">Bs. {item.precio}</span>
            </div>
            <p className="text-gray-600 text-sm mb-3">{item.descripcion}</p>
            {item.extras && item.extras.length > 0 && (
              <div className="mb-3">
                <span className="text-sm font-medium text-gray-700">Acompañamientos:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.extras.map((extra) => (
                    <span
                      key={extra.extra?.id}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                    >
                      {extra.extra?.nombre}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex justify-end gap-2 mt-4">
              <button 
                className="text-blue-600 hover:bg-blue-50 p-2 rounded"
                onClick={() => handleEdit(item)}
              >
                <Edit size={18} />
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

      {/* Modal para crear/editar platos */}
      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {isEditMode ? 'Editar Plato' : 'Crear Nuevo Plato'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del plato
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={newDish.nombre}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  name="categoria"
                  value={newDish.categoria}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  {Object.entries(categories).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio (Bs.)
                </label>
                <input
                  type="number"
                  name="precio"
                  min={0}
                  value={newDish.precio}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={newDish.descripcion}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item de Inventario Vinculado
                </label>
                <select
                  name="inventarioId"
                  value={newDish.inventarioId}
                  onChange={handleInputChange}
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
                  value={newDish.cantidadInventario}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acompañamientos
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {extras.map((extra) => (
                    <label
                      key={extra.id}
                      className={`flex items-center p-2 rounded border ${
                        newDish.extras.includes(extra.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newDish.extras.includes(extra.id)}
                        onChange={() => handleExtraToggle(extra.id)}
                        className="mr-2"
                      />
                      <span>{extra.nombre}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleCloseModal}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditMode ? 'Guardar Cambios' : 'Crear Plato'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}