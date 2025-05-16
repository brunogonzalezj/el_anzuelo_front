import React, { useState } from 'react';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { mockMenuItems } from '../data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogFooter } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import type { MenuItem } from '../types';

export function MenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [menuItems, setMenuItems] = useState(mockMenuItems);
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'fried',
    price: '',
    description: '',
    image: '',
    sides: [] as string[]
  });

  const categories = {
    fried: 'Fritos',
    grill: 'Parrilla',
    oven: 'Horno',
    drinks: 'Bebidas',
    extras: 'Extras',
    kids: 'Menú Anzuelito',
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDish(prev => ({ ...prev, [name]: value }));
  };

  const handleSidesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const sidesInput = e.target.value;
    const sidesArray = sidesInput.split(',').map(side => side.trim()).filter(side => side !== '');
    setNewDish(prev => ({ ...prev, sides: sidesArray }));
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setNewDish({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      image: item.image,
      sides: item.sides || []
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (item: MenuItem) => {
    if (window.confirm('¿Está seguro que desea eliminar este plato?')) {
      setMenuItems(prev => prev.filter(i => i.id !== item.id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedItem) {
      setMenuItems(prev => prev.map(item => 
        item.id === selectedItem.id 
          ? { 
              ...item, 
              name: newDish.name,
              category: newDish.category as MenuItem['category'],
              price: Number(newDish.price),
              description: newDish.description,
              image: newDish.image,
              sides: newDish.sides
            }
          : item
      ));
    } else {
      setMenuItems(prev => [...prev, {
        id: Math.random().toString(36).substr(2, 9),
        name: newDish.name,
        category: newDish.category as MenuItem['category'],
        price: Number(newDish.price),
        description: newDish.description,
        image: newDish.image,
        sides: newDish.sides
      }]);
    }
    
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedItem(null);
    setNewDish({
      name: '',
      category: 'fried',
      price: '',
      description: '',
      image: '',
      sides: []
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Menú</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Nuevo Plato
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <h2 className="text-xl font-semibold">
              {isEditMode ? 'Editar Plato' : 'Crear Nuevo Plato'}
            </h2>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del plato
                </label>
                <input
                  type="text"
                  name="name"
                  value={newDish.name}
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
                  name="category"
                  value={newDish.category}
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
                  name="price"
                  value={newDish.price}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de imagen
                </label>
                <input
                  type="url"
                  name="image"
                  value={newDish.image}
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
                  name="description"
                  value={newDish.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acompañamientos (separados por comas)
                </label>
                <input
                  type="text"
                  name="sides"
                  value={newDish.sides.join(', ')}
                  onChange={handleSidesChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold">{item.name}</h3>
                  <span className="text-sm text-blue-600">{categories[item.category]}</span>
                </div>
                <span className="text-lg font-bold">Bs. {item.price}</span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{item.description}</p>
              {item.sides && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Acompañamientos:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.sides.map((side) => (
                      <span
                        key={side}
                        className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                      >
                        {side}
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
          </div>
        ))}
      </div>
    </div>
  );
}