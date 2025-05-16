import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { useStore } from '../store/useStore';
import type { MenuItem, Extra } from '../types';

export function MenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExtrasModalOpen, setIsExtrasModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const menuItems = useStore((state) => state.menu);
  const extras = useStore((state) => state.extras);
  const fetchMenu = useStore((state) => state.fetchMenu);
  const fetchExtras = useStore((state) => state.fetchExtras);
  const addMenuItem = useStore((state) => state.addMenuItem);
  const updateMenuItem = useStore((state) => state.updateMenuItem);
  const removeMenuItem = useStore((state) => state.removeMenuItem);
  const addExtra = useStore((state) => state.addExtra);
  const updateExtra = useStore((state) => state.updateExtra);
  const removeExtra = useStore((state) => state.removeExtra);

  const [newDish, setNewDish] = useState({
    name: '',
    category: 'fried' as const,
    price: '',
    description: '',
    image: '',
    selectedExtras: [] as string[]
  });

  const [newExtra, setNewExtra] = useState({
    name: '',
    price: '',
    description: '',
    category: 'sides' as const,
    available: true
  });

  useEffect(() => {
    fetchMenu();
    fetchExtras();
  }, [fetchMenu, fetchExtras]);

  const categories = {
    fried: 'Fritos',
    grill: 'Parrilla',
    oven: 'Horno',
    drinks: 'Bebidas',
    extras: 'Extras',
    kids: 'Menú Anzuelito',
  };

  const extraCategories = {
    sides: 'Acompañamientos',
    sauces: 'Salsas',
    drinks: 'Bebidas',
    other: 'Otros'
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewDish(prev => ({ ...prev, [name]: value }));
  };

  const handleExtraInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewExtra(prev => ({ ...prev, [name]: value }));
  };

  const handleExtraToggle = (extraId: string) => {
    setNewDish(prev => {
      const isSelected = prev.selectedExtras.includes(extraId);
      return {
        ...prev,
        selectedExtras: isSelected
          ? prev.selectedExtras.filter(id => id !== extraId)
          : [...prev.selectedExtras, extraId]
      };
    });
  };

  const handleEdit = (item: MenuItem) => {
    setSelectedItem(item);
    setNewDish({
      name: item.name,
      category: item.category,
      price: item.price.toString(),
      description: item.description,
      image: item.image,
      selectedExtras: item.selectedExtras || []
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (item: MenuItem) => {
    if (window.confirm('¿Está seguro que desea eliminar este plato?')) {
      await removeMenuItem(item.id);
    }
  };

  const handleDeleteExtra = async (extra: Extra) => {
    if (window.confirm('¿Está seguro que desea eliminar este acompañamiento?')) {
      await removeExtra(extra.id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedItem) {
      await updateMenuItem(selectedItem.id, {
        name: newDish.name,
        category: newDish.category,
        price: Number(newDish.price),
        description: newDish.description,
        image: newDish.image,
        selectedExtras: newDish.selectedExtras
      });
    } else {
      await addMenuItem({
        name: newDish.name,
        category: newDish.category,
        price: Number(newDish.price),
        description: newDish.description,
        image: newDish.image,
        selectedExtras: newDish.selectedExtras
      });
    }
    handleCloseModal();
  };

  const handleExtraSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addExtra({
      name: newExtra.name,
      price: Number(newExtra.price),
      description: newExtra.description,
      category: newExtra.category,
      available: newExtra.available
    });
    handleCloseExtrasModal();
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
      selectedExtras: []
    });
  };

  const handleCloseExtrasModal = () => {
    setIsExtrasModalOpen(false);
    setNewExtra({
      name: '',
      price: '',
      description: '',
      category: 'sides',
      available: true
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Menú</h1>
        <div className="flex gap-2">
          <button 
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setIsExtrasModalOpen(true)}
          >
            <Plus size={20} />
            Nuevo Acompañamiento
          </button>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={20} />
            Nuevo Plato
          </button>
        </div>
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
                  Acompañamientos
                </label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {extras.map((extra) => (
                    <label
                      key={extra.id}
                      className={`flex items-center p-2 rounded border ${
                        newDish.selectedExtras.includes(extra.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={newDish.selectedExtras.includes(extra.id)}
                        onChange={() => handleExtraToggle(extra.id)}
                        className="mr-2"
                      />
                      <span>{extra.name}</span>
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

      {/* Modal para crear acompañamientos */}
      <Dialog open={isExtrasModalOpen} onOpenChange={handleCloseExtrasModal}>
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
                name="name"
                value={newExtra.name}
                onChange={handleExtraInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Precio (Bs.)
              </label>
              <input
                type="number"
                name="price"
                value={newExtra.price}
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
                name="description"
                value={newExtra.description}
                onChange={handleExtraInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                rows={2}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoría
              </label>
              <select
                name="category"
                value={newExtra.category}
                onChange={handleExtraInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              >
                {Object.entries(extraCategories).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
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
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Acompañamientos</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {extras.map((extra) => (
            <div
              key={extra.id}
              className="bg-white rounded-lg shadow-md p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{extra.name}</h3>
                  <p className="text-sm text-gray-600">{extra.description}</p>
                  <p className="text-sm font-medium mt-1">Bs. {extra.price}</p>
                </div>
                <button
                  className="text-red-600 hover:bg-red-50 p-2 rounded"
                  onClick={() => handleDeleteExtra(extra)}
                >
                  <Trash size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lista de Platos */}
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
              {item.selectedExtras && item.selectedExtras.length > 0 && (
                <div className="mb-3">
                  <span className="text-sm font-medium text-gray-700">Acompañamientos:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {item.selectedExtras.map((extraId) => {
                      const extra = extras.find(e => e.id === extraId);
                      return extra ? (
                        <span
                          key={extraId}
                          className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                        >
                          {extra.name}
                        </span>
                      ) : null;
                    })}
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