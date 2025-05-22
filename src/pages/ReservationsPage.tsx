import React, { useState, useEffect } from 'react';
import { PencilIcon, Trash, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useStore } from '../store/useStore';
import type { Reservation } from '../types';

export function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  
  const fetchReservations = useStore((state) => state.fetchReservations);
  const addReservation = useStore((state) => state.addReservation);
  const updateReservation = useStore((state) => state.updateReservation);
  const removeReservation = useStore((state) => state.removeReservation);

  const [newReservation, setNewReservation] = useState({
    nombreCliente: '',
    fecha: format(new Date(), 'yyyy-MM-dd'),
    hora: '',
    cantidadPersonas: '',
    sector: 'A' as const,
    telefono: '',
  });

  useEffect(() => {
    const loadReservations = async () => {
      try {
        const reservationsData = await fetchReservations();
        setReservations(reservationsData);
      } catch (error) {
        console.error('Error loading reservations:', error);
      }
    };
    loadReservations();
  }, [fetchReservations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && selectedReservation) {
        await updateReservation(selectedReservation.id, {
          nombreCliente: newReservation.nombreCliente,
          fecha: newReservation.fecha,
          hora: newReservation.hora,
          cantidadPersonas: parseInt(newReservation.cantidadPersonas),
          sector: newReservation.sector,
          telefono: newReservation.telefono,
        });
      } else {
        await addReservation({
          nombreCliente: newReservation.nombreCliente,
          fecha: newReservation.fecha,
          hora: newReservation.hora,
          cantidadPersonas: parseInt(newReservation.cantidadPersonas),
          sector: newReservation.sector,
          telefono: newReservation.telefono,
        });
      }
      const updatedReservations = await fetchReservations();
      setReservations(updatedReservations);
      handleCloseModal();
    } catch (error) {
      console.error('Error saving reservation:', error);
    }
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setNewReservation({
      nombreCliente: reservation.nombreCliente,
      fecha: reservation.fecha,
      hora: reservation.hora,
      cantidadPersonas: reservation.cantidadPersonas.toString(),
      sector: reservation.sector,
      telefono: reservation.telefono,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = async (reservation: Reservation) => {
    if (window.confirm('¿Está seguro que desea eliminar esta reserva?')) {
      try {
        await removeReservation(reservation.id);
        const updatedReservations = await fetchReservations();
        setReservations(updatedReservations);
      } catch (error) {
        console.error('Error deleting reservation:', error);
      }
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedReservation(null);
    setNewReservation({
      nombreCliente: '',
      fecha: format(new Date(), 'yyyy-MM-dd'),
      hora: '',
      cantidadPersonas: '',
      sector: 'A',
      telefono: '',
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Reservas</h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus size={20} />
          Nueva Reserva
        </button>
      </div>

      <Dialog open={isModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {isEditMode ? 'Editar Reserva' : 'Nueva Reserva'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Cliente
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-md"
                value={newReservation.nombreCliente}
                onChange={e =>
                  setNewReservation(prev => ({ ...prev, nombreCliente: e.target.value }))
                }
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newReservation.fecha}
                  onChange={e =>
                    setNewReservation(prev => ({ ...prev, fecha: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Hora
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newReservation.hora}
                  onChange={e =>
                    setNewReservation(prev => ({ ...prev, hora: e.target.value }))
                  }
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad de Personas
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newReservation.cantidadPersonas}
                  onChange={e =>
                    setNewReservation(prev => ({ ...prev, cantidadPersonas: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sector
                </label>
                <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newReservation.sector}
                  onChange={e =>
                    setNewReservation(prev => ({ ...prev, sector: e.target.value as 'A' | 'B' | 'C' }))
                  }
                  required
                >
                  <option value="A">Sector A</option>
                  <option value="B">Sector B</option>
                  <option value="C">Sector C</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                className="w-full px-3 py-2 border rounded-md"
                value={newReservation.telefono}
                onChange={e =>
                  setNewReservation(prev => ({ ...prev, telefono: e.target.value }))
                }
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button type="submit">
                {isEditMode ? 'Guardar Cambios' : 'Crear Reserva'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cliente
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hora
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Personas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sector
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Teléfono
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reservations.map(reservation => (
              <tr key={reservation.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reservation.nombreCliente}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(reservation.fecha), 'dd/MM/yyyy', { locale: es })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.hora}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.cantidadPersonas}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Sector {reservation.sector}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.telefono}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    className="text-blue-600 hover:text-blue-900 mr-3"
                    onClick={() => handleEdit(reservation)}
                  >
                    <PencilIcon size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-900"
                    onClick={() => handleDelete(reservation)}
                  >
                    <Trash size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}