import React, { useEffect, useState, useMemo } from 'react';
import { Producto, productosService, ProductoPayload } from '../services/productosService';
import { ProductosModal } from '../componentes/Productos/ProductosModal';
import { useAuthStore } from '../store/useAuthStore';

export const PaginaProductos: React.FC = () => {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productoToEdit, setProductoToEdit] = useState<Producto | null>(null);
  const rolId = useAuthStore((state) => state.rolId);
  const esPersonalAutorizado = rolId === 1 || rolId === 2;

  const fetchProductos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productosService.getAll();
      setProductos(data);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Error al cargar los productos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const handleSaveProducto = async (data: ProductoPayload, id?: number) => {
    if (id) {
      await productosService.update(id, data);
    } else {
      await productosService.create(data);
    }
    fetchProductos();
  };

  const handleOpenCreate = () => {
    setProductoToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (producto: Producto) => {
    setProductoToEdit(producto);
    setIsModalOpen(true);
  };

  const filteredProductos = useMemo(() => {
    return productos.filter((item) =>
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [productos, searchQuery]);

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Gestión de Productos</h1>
          <p className="text-sm text-gray-500 mt-1">Administra el inventario de tu tienda</p>
        </div>
        {esPersonalAutorizado && (
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-medium text-sm shadow-md hover:opacity-90 transition-all self-start md:self-auto"
          >
            <span className="material-symbols-outlined text-xl">add</span>
            Nuevo Producto
          </button>
        )}
      </header>

      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre"
          className="w-full max-w-sm px-4 py-2 bg-surface-container border border-transparent rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary"
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Nombre</th>
              <th className="py-3 px-4 text-right">P. Compra</th>
              <th className="py-3 px-4 text-right">P. Venta</th>
              <th className="py-3 px-4 text-center">Stock</th>
              <th className="py-3 px-4 text-center">Estado</th>
              {esPersonalAutorizado && (
                <th className="py-3 px-4 text-right">Acciones</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low text-sm">
            {filteredProductos.map((prod) => (
              <tr key={prod.id} className="hover:bg-surface-container-low/70 transition-colors">
                <td className="py-3.5 px-4 font-medium text-primary">{prod.sku}</td>
                <td className="py-3.5 px-4 font-medium text-on-surface">{prod.nombre}</td>
                <td className="py-3.5 px-4 text-right tabular-nums">S/ {Number(prod.precioCompra).toFixed(2)}</td>
                <td className="py-3.5 px-4 text-right tabular-nums font-semibold">S/ {Number(prod.precioVenta).toFixed(2)}</td>
                <td className="py-3.5 px-4 text-center font-medium">{prod.stock}</td>
                <td className="py-3.5 px-4 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${prod.activo ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                    {prod.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </td>
                {esPersonalAutorizado && (
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleOpenEdit(prod)}
                      className="p-1.5 rounded-lg text-outline hover:text-on-surface hover:bg-surface-container-high transition-colors"
                      title="Editar producto"
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductosModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveProducto}
        productoToEdit={productoToEdit}
      />
    </div>
  );
};