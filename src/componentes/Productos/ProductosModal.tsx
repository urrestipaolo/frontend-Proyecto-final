import React, { useState, useEffect } from 'react';
import { Producto, ProductoPayload } from '../../services/productosService';

interface ProductosModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ProductoPayload, id?: number) => Promise<void>;
  productoToEdit?: Producto | null;
}

export const ProductosModal: React.FC<ProductosModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productoToEdit,
}) => {
  const [formData, setFormData] = useState<ProductoPayload>({
    categoriaId: 1,
    sku: '',
    nombre: '',
    precioCompra: 0,
    precioVenta: 0,
    stock: 0,
    activo: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (productoToEdit) {
      setFormData({
        categoriaId: productoToEdit.categoriaId,
        sku: productoToEdit.sku,
        nombre: productoToEdit.nombre,
        precioCompra: Number(productoToEdit.precioCompra),
        precioVenta: Number(productoToEdit.precioVenta),
        stock: productoToEdit.stock,
        activo: productoToEdit.activo,
      });
    } else {
      setFormData({
        categoriaId: 1,
        sku: '',
        nombre: '',
        precioCompra: 0,
        precioVenta: 0,
        stock: 0,
        activo: true,
      });
    }
  }, [productoToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      await onSave(formData, productoToEdit?.id);
      onClose();
    } catch (error) {
      console.error('Error al guardar producto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-6 border border-surface-container-high animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
          <h3 className="text-lg font-bold text-on-surface">
            {productoToEdit ? 'Editar Producto' : 'Crear Nuevo Producto'}
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Nombre</label>
              <input
                type="text"
                required
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="w-full px-4 py-2 bg-surface-container border border-transparent rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary"
                placeholder="Ej. Teclado Mecánico"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">SKU</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-2 bg-surface-container border border-transparent rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary"
                placeholder="Ej. PROD-005"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">P. Compra</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.precioCompra}
                onChange={(e) => setFormData({ ...formData, precioCompra: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-surface-container border border-transparent rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">P. Venta</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.precioVenta}
                onChange={(e) => setFormData({ ...formData, precioVenta: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2 bg-surface-container border border-transparent rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Stock</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-4 py-2 bg-surface-container border border-transparent rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1">Categoría ID</label>
              <input
                type="number"
                required
                value={formData.categoriaId}
                onChange={(e) => setFormData({ ...formData, categoriaId: parseInt(e.target.value, 10) || 1 })}
                className="w-full px-4 py-2 bg-surface-container border border-transparent rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary"
              />
            </div>
            <div className="flex items-center pt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-4 h-4 text-primary rounded border-surface-container focus:ring-primary"
                />
                <span className="text-sm font-medium text-on-surface">Producto Activo</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-surface-container-high">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-surface-container text-on-surface font-medium text-sm hover:bg-surface-container-high"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 rounded-xl bg-primary text-on-primary font-medium text-sm shadow-md hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Guardando...' : productoToEdit ? 'Actualizar Producto' : 'Crear Producto'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};