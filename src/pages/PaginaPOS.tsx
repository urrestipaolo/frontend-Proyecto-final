import React, { useEffect, useState, useMemo } from 'react';
import { usePosStore, PosItem } from '../store/useCajaStore';
import { productosService, Producto } from '../services/productosService';
import { usuariosService } from '../services/usuariosService';
import { ApiUsuario } from '../types/usuarios';

export const PaginaPOS: React.FC = () => {
  const {
    clienteId,
    setClienteId,
    metodoPago,
    setMetodoPago,
    items,
    addItem,
    updateQuantity,
    removeItem,
    clearPos,
    checkout,
    loading,
    error,
    successVenta,
  } = usePosStore();

  const [productos, setProductos] = useState<Producto[]>([]);
  const [usuarios, setUsuarios] = useState<ApiUsuario[]>([]);
  const [searchProd, setSearchProd] = useState<string>('');
  const [fetchingData, setFetchingData] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        setFetchingData(true);
        const [prodData, userData] = await Promise.all([
          productosService.getAll(),
          usuariosService.getAll(),
        ]);
        setProductos(prodData);
        setUsuarios(userData);
      } catch (err: unknown) {
        console.error('Error al cargar datos para el POS', err);
      } finally {
        setFetchingData(false);
      }
    };
    loadData();
  }, []);

  const filteredProducts = useMemo(() => {
    return productos.filter(
      (p: Producto) =>
        p.activo &&
        (p.nombre.toLowerCase().includes(searchProd.toLowerCase()) ||
          p.sku.toLowerCase().includes(searchProd.toLowerCase()))
    );
  }, [productos, searchProd]);

  const totalGeneral = items.reduce(
    (acc: number, item: PosItem) => acc + item.precioVenta * item.cantidad,
    0
  );

  const handleCheckout = async (): Promise<void> => {
    const success = await checkout();
    if (success) {
      const prodData = await productosService.getAll();
      setProductos(prodData);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Punto de Venta (POS)</h1>
          <p className="text-sm text-gray-500 mt-1">Registra ventas rápidas y gestiona stock en tiempo real</p>
        </div>
      </header>
      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl">error</span>
            <span><strong>Rechazado:</strong> {error}</span>
          </div>
        </div>
      )}
      {successVenta && (
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                ✓
              </span>
              <div>
                <h3 className="text-base font-bold">¡Venta Registrada con Éxito!</h3>
                <p className="text-xs text-emerald-700">Comprobante generado y stock descontado automáticamente.</p>
              </div>
            </div>
            <button
              onClick={() => clearPos()}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-medium hover:bg-emerald-700 transition-colors"
            >
              Nueva Venta
            </button>
          </div>
          <div className="bg-white/60 p-4 rounded-xl text-xs space-y-1 font-mono">
            <p><strong>ID Venta:</strong> #{successVenta.id}</p>
            <p><strong>Origen:</strong> {successVenta.tipoOrigen} | <strong>Método de Pago:</strong> {successVenta.metodoPago}</p>
            <p><strong>Total Pagado:</strong> S/ {Number(successVenta.total).toFixed(2)}</p>
          </div>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-on-surface">Catálogo de Productos</h3>
            <input
              type="text"
              value={searchProd}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchProd(e.target.value)}
              placeholder="Buscar producto por nombre o SKU..."
              className="px-4 py-2 bg-surface-container border border-transparent rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary w-64"
            />
          </div>
          {fetchingData ? (
            <div className="py-12 text-center text-sm text-on-surface-variant">Cargando productos...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-[550px] overflow-y-auto pr-1">
              {filteredProducts.map((prod: Producto) => (
                <div
                  key={prod.id}
                  onClick={() => addItem({ id: prod.id, nombre: prod.nombre, precioVenta: Number(prod.precioVenta), stock: prod.stock })}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                    prod.stock > 0
                      ? 'bg-surface-container-low/50 border-surface-container hover:border-primary hover:bg-surface-container-low'
                      : 'bg-surface-container/30 border-transparent opacity-50 cursor-not-allowed'
                  }`}
                >
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-primary">{prod.sku}</span>
                    <h4 className="font-medium text-xs text-on-surface line-clamp-2 mt-0.5">{prod.nombre}</h4>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="font-bold text-xs text-on-surface">S/ {Number(prod.precioVenta).toFixed(2)}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${prod.stock > 0 ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                      Stock: {prod.stock}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-surface-container-high pb-3">
              <h3 className="font-bold text-base text-on-surface">Carrito Actual</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary-container text-on-primary font-semibold">
                {items.length} ítems
              </span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Cliente</label>
                <select
                  value={clienteId}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setClienteId(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-surface-container rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  {usuarios.map((u: ApiUsuario) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Método de Pago</label>
                <select
                  value={metodoPago}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setMetodoPago(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container rounded-xl text-xs text-on-surface focus:outline-none focus:border-primary"
                >
                  <option value="EFECTIVO">EFECTIVO</option>
                  <option value="TARJETA">TARJETA</option>
                  <option value="YAPE">YAPE</option>
                  <option value="PLIN">PLIN</option>
                </select>
              </div>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {items.length === 0 ? (
                <div className="text-center py-10 text-xs text-on-surface-variant">
                  No hay productos en el carrito. Selecciona del catálogo.
                </div>
              ) : (
                items.map((item: PosItem) => (
                  <div key={item.productoId} className="p-3 rounded-xl bg-surface-container-low flex items-center justify-between gap-2">
                    <div className="flex-1">
                      <span className="font-medium text-xs text-on-surface block">{item.nombre}</span>
                      <span className="text-[11px] text-on-surface-variant">S/ {item.precioVenta.toFixed(2)} c/u</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productoId, item.cantidad - 1)}
                        className="w-6 h-6 rounded-lg bg-surface-container-lowest flex items-center justify-center font-bold text-xs shadow-sm hover:bg-surface-container-high"
                      >
                        -
                      </button>
                      <span className="text-xs font-semibold w-5 text-center">{item.cantidad}</span>
                      <button
                        onClick={() => updateQuantity(item.productoId, item.cantidad + 1)}
                        className="w-6 h-6 rounded-lg bg-surface-container-lowest flex items-center justify-center font-bold text-xs shadow-sm hover:bg-surface-container-high"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.productoId)}
                        className="text-outline hover:text-red-600 ml-1"
                        title="Quitar"
                      >
                        <span className="material-symbols-outlined text-base">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="space-y-4 pt-4 border-t border-surface-container-high">
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface-variant font-medium">Total a Pagar</span>
              <span className="text-2xl font-bold text-on-surface tabular-nums">S/ {totalGeneral.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading || items.length === 0}
              className="w-full py-3 rounded-xl bg-primary text-on-primary font-semibold text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
                  Procesando venta...
                </>
              ) : (
                'Confirmar y Cobrar Venta'
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};