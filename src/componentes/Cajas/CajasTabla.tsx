import React from 'react';
import { ApiCaja } from '../../types/cajas';

interface CajasTablaProps {
  cajas: ApiCaja[];
  onView: (id: number) => void;
  onEdit: (id: number) => void; // <--- Prop añadida para editar
  isLoading?: boolean;
}

export const CajasTabla: React.FC<CajasTablaProps> = ({
  cajas,
  onView,
  onEdit,
  isLoading,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className={`h-0.5 w-full bg-surface-container-high overflow-hidden transition-opacity ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full h-full bg-secondary origin-left animate-pulse"></div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              <th className="py-3 px-space-md">ID Caja</th>
              <th className="py-3 px-space-md">Responsable</th>
              <th className="py-3 px-space-md text-right">Monto Apertura</th>
              <th className="py-3 px-space-md text-center">Estado</th>
              <th className="py-3 px-space-md text-center">Ventas Realizadas</th>
              <th className="py-3 px-space-md">Fecha Apertura</th>
              <th className="py-3 px-space-md text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low text-sm">
            {cajas.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={7} className="py-6 text-center text-on-surface-variant text-sm">
                  No hay registros de cajas POS disponibles.
                </td>
              </tr>
            ) : (
              cajas.map((caja) => {
                const fechaAperturaFormateada = new Date(caja.fechaApertura).toLocaleString();
                return (
                  <tr 
                    key={caja.id} 
                    className="hover:bg-surface-container-low/70 transition-colors group"
                  >
                    <td className="py-3.5 px-space-md font-medium text-primary">#{caja.id}</td>
                    <td className="py-3.5 px-space-md">
                      <div>
                        <span className="text-on-surface block font-medium">{caja.usuario?.nombre || 'Desconocido'}</span>
                        <span className="text-xs text-on-surface-variant">{caja.usuario?.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-space-md text-right tabular-nums font-semibold text-on-surface">
                      S/ {Number(caja.montoApertura).toFixed(2)}
                    </td>
                    <td className="py-3.5 px-space-md text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        caja.estado === 'ABIERTA' ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-container-high text-on-surface-variant'
                      }`}>
                        {caja.estado}
                      </span>
                    </td>
                    <td className="py-3.5 px-space-md text-center">
                      <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-xs font-medium">
                        {caja._count?.ventas ?? 0} ventas
                      </span>
                    </td>
                    <td className="py-3.5 px-space-md text-xs text-on-surface-variant">
                      {fechaAperturaFormateada}
                    </td>
                    <td className="py-3.5 px-space-md text-right">
                      <div className="flex items-center justify-end gap-1">
                        
                        {/* Botón Editar Estado */}
                        <button 
                          onClick={() => onEdit(caja.id)}
                          className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
                          title="Editar estado de caja"
                        >
                          <span className="material-symbols-outlined text-lg">edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};