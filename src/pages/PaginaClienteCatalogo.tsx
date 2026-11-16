import React, { useEffect, useState } from 'react';
import { productosService, Producto } from '../services/productosService';
import { carritoService } from '../services/carritosService';
import { useAuthStore } from '../store/useAuthStore';

export const PaginaClienteCatalogo: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [addingId, setAddingId] = useState<number | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  
  const { usuarioId } = useAuthStore();

  useEffect(() => {
    const cargarProductos = async () => {
      try {
        setLoading(true);
        const data = await productosService.getAll();
        setProductos(data);
      } catch (err) {
        console.error('Error al cargar catálogo', err);
      } finally {
        setLoading(false);
      }
    };
    cargarProductos();
  }, []);

  const handleAgregarAlCarrito = async (productoId: number) => {
    if (!usuarioId) {
      setMensaje('Debes iniciar sesión para agregar productos al carrito.');
      return;
    }

    try {
      setAddingId(productoId);
      setMensaje(null);

      await carritoService.addItem(usuarioId, productoId, 1);
      
      setMensaje('¡Producto añadido a tu carrito exitosamente!');
    } catch (err: unknown) {
      let errorMsg = 'Error al agregar producto al carrito.';
      if (typeof err === 'object' && err !== null) {
        const errorObj = err as { response?: { data?: { message?: string } } };
        errorMsg = errorObj.response?.data?.message || errorMsg;
      }
      setMensaje(errorMsg);
    } finally {
      setAddingId(null);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-sm text-gray-500">Cargando vitrina de productos...</div>;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <header className="flex justify-between items-center border-b pb-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Catálogo y Vitrina Web</h1>
          <p className="text-sm text-on-surface-variant">Explora nuestros productos y arma tu carrito de compras</p>
        </div>
      </header>

      {mensaje && (
        <div className="p-4 rounded-xl bg-surface-container text-on-surface text-sm border border-surface-container-high flex items-center justify-between">
          <span>{mensaje}</span>
          <button onClick={() => setMensaje(null)} className="text-xs font-bold text-primary">Cerrar</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {productos.filter((p) => p.activo).map((prod) => (
          <div key={prod.id} className="bg-surface-container-lowest rounded-2xl p-5 shadow-sm flex flex-col justify-between space-y-4 border border-surface-container-low">
            <div>
              <span className="text-[10px] uppercase font-semibold text-primary">{prod.sku}</span>
              <h3 className="font-bold text-base text-on-surface mt-1">{prod.nombre}</h3>
              <p className="text-xs text-on-surface-variant mt-1 line-clamp-2">{prod.descripcion || 'Sin descripción disponible.'}</p>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-on-surface">S/ {Number(prod.precioVenta).toFixed(2)}</span>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${prod.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  Stock: {prod.stock}
                </span>
              </div>

              <button
                onClick={() => handleAgregarAlCarrito(prod.id)}
                disabled={addingId === prod.id || prod.stock <= 0}
                className="w-full py-2.5 rounded-xl bg-primary text-on-primary font-semibold text-xs shadow-sm hover:opacity-90 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {addingId === prod.id ? (
                  'Agregando...'
                ) : prod.stock > 0 ? (
                  <>
                    <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                    Agregar al Carrito
                  </>
                ) : (
                  'Agotado'
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};