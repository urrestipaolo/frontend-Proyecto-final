import React, { useEffect, useState, useMemo } from 'react';
import { ApiVenta } from '../types/ventas';
import { ventasService } from '../services/ventasService';
import { VentasTabla } from '../componentes/Ventas/VentasTabla';

export const PaginaVentas: React.FC = () => {
  const [ventas, setVentas] = useState<ApiVenta[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const loadVentas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await ventasService.getAll();
      setVentas(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar las ventas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVentas();
  }, []);

  // Manejador para ver detalles
  const handleView = (id: number) => {
    console.log('Ver detalle de venta ID:', id);
  };

  const handleEdit = async (id: number) => {
    const ventaActual = ventas.find((v) => v.id === id);
    const nuevoEstado = prompt(
      `Actualizar estado de la venta #${id} (Actual: ${ventaActual?.estado}):`,
      'PAGADO'
    );

    if (!nuevoEstado) return;

    try {
      await ventasService.update(id, { estado: nuevoEstado.toUpperCase() });
      alert('Venta actualizada con éxito');
      loadVentas();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al actualizar la venta');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la venta #${id}?`)) {
      return;
    }

    try {
      await ventasService.delete(id);
      setVentas((prevVentas) => prevVentas.filter((v) => v.id !== id));
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al eliminar la venta');
    }
  };

  const filteredVentas = useMemo(() => {
    return ventas.filter((item) => {
      const matchId = String(item.id).includes(searchQuery);
      const matchClient = item.usuario?.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      return matchId || matchClient;
    });
  }, [ventas, searchQuery]);

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Ventas Realizadas</h1>
          <p className="text-sm text-gray-500 mt-1">Historial de transacciones y POS</p>
        </div>
      </header>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <VentasTabla
        ventas={filteredVentas}
        isLoading={loading}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};