  import React, { useState } from 'react';
  import { ApiCarrito } from '../types/carritos';
  import { carritoService } from '../services/carritosService';
  import { CarritoDetalle } from '../componentes/Carrito/CarritoDetalle';

  export const PaginaCarritos: React.FC = () => {
    const [usuarioIdInput, setUsuarioIdInput] = useState('5');
    const [carrito, setCarrito] = useState<ApiCarrito | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleSearchCarrito = async (e: React.FormEvent) => {
      e.preventDefault();
      const idNum = parseInt(usuarioIdInput, 10);
      if (isNaN(idNum)) {
        setError('Por favor ingresa un ID de usuario válido.');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await carritoService.getByUsuarioId(idNum);
        setCarrito(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Error al obtener el carrito del usuario');
        setCarrito(null);
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="space-y-6 p-6">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Consulta de Carrito por Usuario</h1>
            <p className="text-sm text-gray-500 mt-1">Busca y administra el carrito de compras activo de un cliente</p>
          </div>
        </header>

        <form onSubmit={handleSearchCarrito} className="bg-surface-container-lowest p-6 rounded-xl shadow-sm flex items-end gap-4">
          <div className="flex-1 max-w-xs">
            <label className="block text-xs font-semibold uppercase tracking-wider text-on-surface-variant mb-1.5">
              ID de Usuario
            </label>
            <input
              type="number"
              value={usuarioIdInput}
              onChange={(e) => setUsuarioIdInput(e.target.value)}
              placeholder="Ej. 5"
              className="w-full px-4 py-2 bg-surface-container border border-transparent rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-primary text-on-primary font-medium text-sm shadow-md hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Buscando...' : 'Buscar Carrito'}
          </button>
        </form>

        {error && (
          <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
            <strong>Error:</strong> {error}
          </div>
        )}

        <CarritoDetalle carrito={carrito} isLoading={loading} />
      </div>
    );
  };