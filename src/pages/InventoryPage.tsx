import React, { useState } from 'react';
import { Package, AlertTriangle, Plus, PencilIcon, Trash } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  stock: number;
  unit: string;
  minStock: number;
}

export function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      name: 'Pescado Sábalo',
      category: 'Pescados',
      stock: 25,
      unit: 'kg',
      minStock: 20,
    },
    {
      id: '2',
      name: 'Camarón',
      category: 'Mariscos',
      stock: 15,
      unit: 'kg',
      minStock: 18,
    },
    {
      id: '3',
      name: 'Arroz',
      category: 'Acompañamientos',
      stock: 50,
      unit: 'kg',
      minStock: 30,
    },
    {
      id: '4',
      name: 'Aceite',
      category: 'Insumos',
      stock: 10,
      unit: 'l',
      minStock: 15,
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Pescados',
    stock: '',
    unit: 'kg',
    minStock: '',
  });

  const categories = ['Pescados', 'Mariscos', 'Acompañamientos', 'Insumos'];
  const units = ['kg', 'l', 'unidad'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedItem) {
      setInventory(prev =>
        prev.map(item =>
          item.id === selectedItem.id
            ? {
                ...item,
                name: newItem.name,
                category: newItem.category,
                stock: parseInt(newItem.stock),
                unit: newItem.unit,
                minStock: parseInt(newItem.minStock),
              }
            : item
        )
      );
    } else {
      setInventory(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          name: newItem.name,
          category: newItem.category,
          stock: parseInt(newItem.stock),
          unit: newItem.unit,
          minStock: parseInt(newItem.minStock),
        },
      ]);
    }
    handleCloseModal();
  };

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item);
    setNewItem({
      name: item.name,
      category: item.category,
      stock: item.stock.toString(),
      unit: item.unit,
      minStock: item.minStock.toString(),
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (item: InventoryItem) => {
    if (window.confirm('¿Está seguro que desea eliminar este item?')) {
      setInventory(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedItem(null);
    setNewItem({
      name: '',
      category: 'Pescados',
      stock: '',
      unit: 'kg',
      minStock: '',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Control de Inventario</h1>
        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            Crear Item
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Package size={20} />
            Registrar Compra
          </button>
        </div>
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
                value={newItem.name}
                onChange={e => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                className="w-full px-3 py-2 border rounded-md"
                value={newItem.category}
                onChange={e => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                required
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stock Actual
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newItem.stock}
                  onChange={e => setNewItem(prev => ({ ...prev, stock: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unidad
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newItem.unit}
                  onChange={e => setNewItem(prev => ({ ...prev, unit: e.target.value }))}
                  required
                >
                  {units.map(unit => (
                    <option key={unit} value={unit}>
                      {unit}
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
                value={newItem.minStock}
                onChange={e => setNewItem(prev => ({ ...prev, minStock: e.target.value }))}
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
        {categories.map(category => (
          <div key={category} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-800">{category}</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inventory
                  .filter(item => item.category === category)
                  .map(item => (
                    <div
                      key={item.id}
                      className="border rounded-lg p-4 hover:border-blue-500 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{item.name}</h3>
                        {item.stock < item.minStock && (
                          <AlertTriangle
                            size={20}
                            className="text-yellow-500"
                            title="Stock bajo"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Stock Actual:</span>
                          <span
                            className={
                              item.stock < item.minStock
                                ? 'text-yellow-600 font-medium'
                                : ''
                            }
                          >
                            {item.stock} {item.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Stock Mínimo:</span>
                          <span>
                
                            {item.minStock} {item.unit}
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