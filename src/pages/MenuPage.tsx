import React, { useState } from 'react';
import { Plus, Edit, Trash, X } from 'lucide-react';
import { mockMenuItems } from '../data/mockData';

export function MenuPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDish, setNewDish] = useState({
    name: '',
    category: 'fried',
    price: '',
    description: '',
    image: '',
    sides: []
  });

  const categories = {
    fried: 'Fritos',
    grill: 'Parrilla',
    oven: 'Horno',
    drinks: 'Bebidas',
    extras: 'Extras',
    kids: 'Menú Anzuelito',
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDish(prev => ({ ...prev, [name]: value }));
  };

  const handleSidesChange = (e) => {
    const sidesInput = e.target.value;
    const sidesArray = sidesInput.split(',').map(side => side.trim()).filter(side => side !== '');
    setNewDish(prev => ({ ...prev, sides: sidesArray }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para guardar el nuevo plato
    console.log('Nuevo plato:', newDish);
    setIsModalOpen(false);
    // Resetear el formulario
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

      {/* Modal para nuevo plato */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">Crear Nuevo Plato</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
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
              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Crear Plato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockMenuItems.map((item) => (
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
                <button className="text-blue-600 hover:bg-blue-50 p-2 rounded">
                  <Edit size={18} />
                </button>
                <button className="text-red-600 hover:bg-red-50 p-2 rounded">
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
