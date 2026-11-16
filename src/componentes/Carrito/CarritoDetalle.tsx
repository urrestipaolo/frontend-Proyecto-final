import React from 'react';
import { ApiCarrito } from '../../types/carritos';

interface CarritoDetalleProps {
  carrito: ApiCarrito | null;
  isLoading?: boolean;
}

export const CarritoDetalle: React.FC<CarritoDetalleProps> = ({ carrito, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-8 text-center shadow-sm">
        <span className="material-symbols-outlined animate-spin text-3xl text-primary mb-2">progress_activity</span>
        <p className="text-sm text-on-surface-variant">Cargando carrito de compras...</p>
      </div>
    );
  }

  if (!carrito || !carrito.detalles || carrito.detalles.length === 0) {
    return (
      <div className="bg-surface-container-lowest rounded-xl p-8 text-center shadow-sm border border-surface-container-high">
        <span className="material-symbols-outlined text-4xl text-outline mb-2">shopping_cart_off</span>
        <p className="text-on-surface font-medium">El carrito está vacío</p>
        <p className="text-xs text-on-surface-variant mt-1">Este usuario no tiene productos agregados actualmente.</p>
      </div>
    );
  }

  const totalCarrito = carrito.detalles.reduce((acc, item) => acc + parseFloat(item.subtotal), 0);

  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col p-6 space-y-6">
      <div className="flex justify-between items-center border-b border-surface-container-high pb-4">
        <div>
          <h3 className="text-lg font-bold text-on-surface">Carrito #{carrito.id}</h3>
          <p className="text-xs text-on-surface-variant">Usuario ID: {carrito.usuarioId}</p>
        </div>
        <span className="px-3 py-1 rounded-full bg-primary-container text-on-primary text-xs font-semibold">
          {carrito.detalles.length} {carrito.detalles.length === 1 ? 'producto' : 'productos'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              <th className="py-3 px-4">Producto</th>
              <th className="py-3 px-4 text-center">SKU</th>
              <th className="py-3 px-4 text-center">Cantidad</th>
              <th className="py-3 px-4 text-right">P. Unitario</th>
              <th className="py-3 px-4 text-right">Subtotal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low text-sm">
            {carrito.detalles.map((detalle) => (
              <tr key={detalle.id} className="hover:bg-surface-container-low/70 transition-colors">
                <td className="py-3.5 px-4 font-medium text-on-surface">
                  {detalle.producto?.nombre || 'Producto desconocido'}
                </td>
                <td className="py-3.5 px-4 text-center text-xs text-on-surface-variant">
                  {detalle.producto?.sku}
                </td>
                <td className="py-3.5 px-4 text-center font-semibold">
                  {detalle.cantidad}
                </td>
                <td className="py-3.5 px-4 text-right tabular-nums text-on-surface-variant">
                  S/ {parseFloat(detalle.precioUnitario).toFixed(2)}
                </td>
                <td className="py-3.5 px-4 text-right tabular-nums font-semibold text-primary">
                  S/ {parseFloat(detalle.subtotal).toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end pt-4 border-t border-surface-container-high">
        <div className="text-right">
          <span className="text-xs text-on-surface-variant block">Total del Carrito</span>
          <span className="text-2xl font-bold text-on-surface tabular-nums">S/ {totalCarrito.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};