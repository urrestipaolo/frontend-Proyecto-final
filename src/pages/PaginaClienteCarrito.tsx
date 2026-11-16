import React, { useEffect, useState } from 'react';
import { carritoService } from '../services/carritosService';
import { ApiCarrito } from '../types/carritos';
import { useAuthStore } from '../store/useAuthStore';

export const PaginaClienteCarrito: React.FC = () => {
  const [carrito, setCarrito] = useState<ApiCarrito | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [procesando, setProcesando] = useState<boolean>(false);
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { usuarioId } = useAuthStore();

  const cargarCarritoFresco = async (): Promise<void> => {
    if (!usuarioId) return;
    try {
      setLoading(true);
      const data = await carritoService.getByUsuarioId(usuarioId);
      setCarrito(data);
    } catch (err: unknown) {
      setError('Error al obtener el carrito de compras');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (usuarioId) {
      cargarCarritoFresco();
    }

    const handleFocus = () => {
      if (usuarioId) {
        cargarCarritoFresco();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [usuarioId]);

  const handleConfirmarPedido = async (): Promise<void> => {
    if (!usuarioId) return;
    try {
      setProcesando(true);
      setError(null);
      
      await carritoService.confirmarPedido(usuarioId, 'TARJETA');
      
      setMensajeExito('¡Pedido confirmado con éxito! El stock se ha actualizado en la tienda.');

      await cargarCarritoFresco();
    } catch (err: unknown) {
      let errorMsg = 'Error al procesar la compra (posible falta de stock).';
      if (typeof err === 'object' && err !== null) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        errorMsg = errorObj.response?.data?.message || errorMsg;
      }
      setError(errorMsg);
    } finally {
      setProcesando(false);
    }
  };

  if (!usuarioId) {
    return <div className="p-8 text-center text-sm text-gray-500">Debes iniciar sesión para ver tu carrito.</div>;
  }

  if (loading && !carrito) {
    return <div className="p-8 text-center text-sm text-gray-500">Sincronizando carrito y stock...</div>;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <header className="flex justify-between items-center border-b pb-4">
        <h1 className="text-2xl font-bold text-on-surface">Mi Carrito Web</h1>
        <button 
          onClick={cargarCarritoFresco}
          className="text-xs px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high transition-colors flex items-center gap-1 text-on-surface-variant"
        >
          <span className="material-symbols-outlined text-sm">refresh</span>
          Actualizar Stock y Precios
        </button>
      </header>

      {mensajeExito && (
        <div className="p-4 rounded-xl bg-emerald-50 text-emerald-800 text-sm border border-emerald-200">
          {mensajeExito}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
          {error}
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm space-y-4">
        {!carrito || carrito.detalles.length === 0 ? (
          <p className="text-center py-8 text-sm text-on-surface-variant">Tu carrito web está vacío.</p>
        ) : (
          <div className="space-y-4">
            {carrito.detalles.map((detalle) => (
              <div key={detalle.id} className="flex justify-between items-center border-b border-surface-container-low pb-3">
                <div>
                  <h4 className="font-medium text-sm text-on-surface">{detalle.producto?.nombre}</h4>
                  <span className="text-xs text-on-surface-variant">Cantidad: {detalle.cantidad} | Stock actual en sistema: <strong className="text-primary">{detalle.producto?.stock}</strong></span>
                </div>
                <span className="font-bold text-sm text-on-surface">S/ {Number(detalle.subtotal).toFixed(2)}</span>
              </div>
            ))}

            <div className="pt-4 flex justify-between items-center">
              <span className="font-bold text-base">Total del Pedido</span>
              <button
                onClick={handleConfirmarPedido}
                disabled={procesando}
                className="px-6 py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-md hover:opacity-90 disabled:opacity-50"
              >
                {procesando ? 'Confirmando pedido...' : 'Confirmar Pedido Web'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};