import React, { useEffect, useState } from 'react';
import { ApiCaja } from '../types/cajas';
import { cajasService } from '../services/cajasService';
import { CajasTabla } from '../componentes/Cajas/CajasTabla';

export const PaginaCajas: React.FC = () => {
  const [cajas, setCajas] = useState<ApiCaja[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCajas = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await cajasService.getAll();
      setCajas(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar las cajas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCajas();
  }, []);

  // Manejador para ver detalles de la caja
  const handleView = (id: number) => {
    console.log('Ver detalle de caja ID:', id);
    // Aquí puedes abrir tu modal de detalles si lo tienes
  };

  // Manejador para editar el estado de la caja POS
  const handleEdit = async (id: number) => {
    const cajaActual = cajas.find((c) => c.id === id);
    const nuevoEstado = prompt(
      `Actualizar estado de la caja POS #${id} (Actual: ${cajaActual?.estado}):`,
      'ABIERTA'
    );

    if (!nuevoEstado) return;

    try {
      await cajasService.update(id, { estado: nuevoEstado.toUpperCase() });
      alert('Caja actualizada con éxito');
      loadCajas();
    } catch (err: any) {
      // 🔍 AQUÍ MOSTRAMOS EL ERROR REAL DEL BACKEND
      const mensajeBackend = err.response?.data?.message || err.message || 'Error desconocido';
      alert(`Error al actualizar la caja: ${mensajeBackend}`);
      console.error("Detalle del error:", err);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Gestión de Cajas POS</h1>
          <p className="text-sm text-gray-500 mt-1">Control de aperturas, cierres y turnos de caja</p>
        </div>
      </header>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      <CajasTabla
        cajas={cajas}
        isLoading={loading}
        onView={handleView}
        onEdit={handleEdit}
      />
    </div>
  );
};