import React, { useState } from 'react';
import { Calendar as CalendarIcon, PencilIcon, Trash, Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/Dialog';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface Reservation {
  id: string;
  customerName: string;
  date: string;
  time: string;
  people: number;
  sector: string;
  phone: string;
}

export function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([
    {
      id: '1',
      customerName: 'Roberto Méndez',
      date: '2024-03-20',
      time: '19:00',
      people: 4,
      sector: 'A',
      phone: '555-0101',
    },
    {
      id: '2',
      customerName: 'María Sánchez',
      date: '2024-03-20',
      time: '20:30',
      people: 6,
      sector: 'B',
      phone: '555-0102',
    },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [newReservation, setNewReservation] = useState({
    customerName: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    time: '',
    people: '',
    sector: 'A',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditMode && selectedReservation) {
      setReservations(prev =>
        prev.map(reservation =>
          reservation.id === selectedReservation.id
            ? {
                ...reservation,
                customerName: newReservation.customerName,
                date: newReservation.date,
                time: newReservation.time,
                people: parseInt(newReservation.people),
                sector: newReservation.sector,
                phone: newReservation.phone,
              }
            : reservation
        )
      );
    } else {
      setReservations(prev => [
        ...prev,
        {
          id: Math.random().toString(36).substr(2, 9),
          customerName: newReservation.customerName,
          date: newReservation.date,
          time: newReservation.time,
          people: parseInt(newReservation.people),
          sector: newReservation.sector,
          phone: newReservation.phone,
        },
      ]);
    }
    handleCloseModal();
  };

  const handleEdit = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setNewReservation({
      customerName: reservation.customerName,
      date: reservation.date,
      time: reservation.time,
      people: reservation.people.toString(),
      sector: reservation.sector,
      phone: reservation.phone,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleDelete = (reservation: Reservation) => {
    if (window.confirm('¿Está seguro que desea eliminar esta reserva?')) {
      setReservations(prev => prev.filter(r => r.id !== reservation.id));
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditMode(false);
    setSelectedReservation(null);
    setNewReservation({
      customerName: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      time: '',
      people: '',
      sector: 'A',
      phone: '',
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
                value={newReservation.customerName}
                onChange={e =>
                  setNewReservation(prev => ({ ...prev, customerName: e.target.value }))
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
                  value={newReservation.date}
                  onChange={e =>
                    setNewReservation(prev => ({ ...prev, date: e.target.value }))
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
                  value={newReservation.time}
                  onChange={e =>
                    setNewReservation(prev => ({ ...prev, time: e.target.value }))
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
                  value={newReservation.people}
                  onChange={e =>
                    setNewReservation(prev => ({ ...prev, people: e.target.value }))
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
                    setNewReservation(prev => ({ ...prev, sector: e.target.value }))
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
                value={newReservation.phone}
                onChange={e =>
                  setNewReservation(prev => ({ ...prev, phone: e.target.value }))
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
                    {reservation.customerName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {format(new Date(reservation.date), 'dd/MM/yyyy', { locale: es })}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.time}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.people}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">Sector {reservation.sector}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{reservation.phone}</div>
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