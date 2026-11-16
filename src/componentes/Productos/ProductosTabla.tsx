import React from 'react'
import { Producto } from '../../types/productos'
import { useAuthStore } from '../../store/useAuthStore'

interface ProductoTablaProps {
  products: Producto[]
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string, name: string) => void
  isLoading?: boolean
}

export const ProductoTabla: React.FC<ProductoTablaProps> = ({
  products,
  onView,
  onEdit,
  onDelete,
  isLoading,
}) => {
  const rolId = useAuthStore((state) => state.rolId);
  const esPersonalAutorizado = rolId === 1 || rolId === 2;

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className={`h-0.5 w-full bg-surface-container-high overflow-hidden transition-opacity ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full h-full bg-secondary origin-left animate-pulse"></div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              <th className="py-3 px-space-md">ID</th>
              <th className="py-3 px-space-md">Producto</th>
              <th className="py-3 px-space-md">Categoría</th>
              <th className="py-3 px-space-md text-right">P. Compra</th>
              <th className="py-3 px-space-md text-right">P. Venta</th>
              <th className="py-3 px-space-md text-center">Stock</th>
              <th className="py-3 px-space-md text-center">Estado</th>
              {esPersonalAutorizado && (
                <th className="py-3 px-space-md text-right">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low text-sm">
            {products.map((prd) => (
              <tr 
                key={prd.id} 
                className={`hover:bg-surface-container-low/70 transition-colors group ${prd.status === 'Inactivo' ? 'opacity-85' : ''}`}
              >
                <td className="py-3.5 px-space-md font-medium text-primary">#{prd.id}</td>
                
                <td className="py-3.5 px-space-md">
                  <div>
                    <span className="text-on-surface block font-medium">{prd.name}</span>
                    {prd.description && (
                      <span className="text-xs text-on-surface-variant">{prd.description}</span>
                    )}
                  </div>
                </td>

                <td className="py-3.5 px-space-md">
                  <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-xs font-medium">
                    {prd.category}
                  </span>
                </td>
                <td className="py-3.5 px-space-md text-right tabular-nums text-on-surface-variant">
                  S/ {prd.purchasePrice.toFixed(2)}
                </td>
                <td className="py-3.5 px-space-md text-right tabular-nums font-semibold text-on-surface">
                  S/ {prd.salePrice.toFixed(2)}
                </td>
                <td className="py-3.5 px-space-md text-center">
                  {prd.stock === 0 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-error-container text-error text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-error"></span> Agotado (0)
                    </span>
                  ) : prd.stock <= 10 ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> {prd.stock} uds.
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span> {prd.stock} uds.
                    </span>
                  )}
                </td>
                <td className="py-3.5 px-space-md text-center">
                  <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    prd.status === 'Activo' ? 'bg-emerald-50 text-emerald-700' : 'bg-surface-container-high text-on-surface-variant'
                  }`}>
                    {prd.status}
                  </span>
                </td>

                {esPersonalAutorizado && (
                  <td className="py-3.5 px-space-md text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => onView(prd.id)}
                        className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                        title="Ver detalles"
                      >
                        <span className="material-symbols-outlined text-lg">visibility</span>
                      </button>
                      <button 
                        onClick={() => onEdit(prd.id)}
                        className="p-1.5 rounded-lg text-outline hover:text-primary hover:bg-primary-fixed transition-colors"
                        title="Editar"
                      >
                        <span className="material-symbols-outlined text-lg">edit</span>
                      </button>
                      <button 
                        onClick={() => onDelete(prd.id, prd.name)}
                        className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container transition-colors"
                        title="Eliminar"
                      >
                        <span className="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}