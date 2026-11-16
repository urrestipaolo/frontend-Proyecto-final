import React from 'react';
import { ApiVenta } from '../../types/ventas';

interface VentasTablaProps {
  ventas: ApiVenta[];
  onView: (id: number) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading?: boolean;
}

export const VentasTabla: React.FC<VentasTablaProps> = ({
  ventas,
  onView,
  onEdit,
  onDelete,
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
              <th className="py-3 px-space-md">ID Venta</th>
              <th className="py-3 px-space-md">Cliente</th>
              <th className="py-3 px-space-md">Origen</th>
              <th className="py-3 px-space-md text-center">Método Pago</th>
              <th className="py-3 px-space-md text-center">Estado</th>
              <th className="py-3 px-space-md text-right">Total</th>
              <th className="py-3 px-space-md">Fecha</th>
              <th className="py-3 px-space-md text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low text-sm">
            {ventas.map((venta) => {
              const fechaFormateada = new Date(venta.creadoEn).toLocaleString();
              return (
                <tr 
                  key={venta.id} 
                  className="hover:bg-surface-container-low/70 transition-colors group"
                >
                  <td className="py-3.5 px-space-md font-medium text-primary">#{venta.id}</td>
                  <td className="py-3.5 px-space-md">
                    <div>
                      <span className="text-on-surface block font-medium">{venta.usuario?.nombre || 'Cliente General'}</span>
                      <span className="text-xs text-on-surface-variant">{venta.usuario?.email}</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-space-md">
                    <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-xs font-medium">
                      {venta.tipoOrigen}
                    </span>
                  </td>
                  <td className="py-3.5 px-space-md text-center">
                    <span className="text-xs font-semibold text-on-surface-variant">
                      {venta.metodoPago}
                    </span>
                  </td>

                  <td className="py-3.5 px-space-md text-center">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      venta.estado === 'PAGADO' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {venta.estado}
                    </span>
                  </td>

                  <td className="py-3.5 px-space-md text-right tabular-nums font-semibold text-on-surface">
                    S/ {parseFloat(venta.total).toFixed(2)}
                  </td>

                  <td className="py-3.5 px-space-md text-xs text-on-surface-variant">
                    {fechaFormateada}
                  </td>

                  <td className="py-3.5 px-space-md text-right">
                    <div className="flex items-center justify-end gap-1">

                      {/* Botón Editar */}
                      <button 
                        onClick={() => onEdit(venta.id)}
                        className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-surface-container-high transition-colors"
                        title="Editar venta"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>

                      {/* Botón Eliminar */}
                      <button 
                        onClick={() => onDelete(venta.id)}
                        className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/30 transition-colors"
                        title="Eliminar venta"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};