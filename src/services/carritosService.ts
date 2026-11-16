import { api } from '../lib/axios';
import { ApiCarrito, CarritoResponse } from '../types/carritos';

export const carritoService = {
  getByUsuarioId: async (usuarioId: number): Promise<ApiCarrito> => {
    const response = await api.get<CarritoResponse>(`/carritos/usuario/${usuarioId}`);
    return response.data.data;
  },

  addItem: async (usuarioId: number, productoId: number, cantidad: number): Promise<unknown> => {
    const response = await api.post(`/carritos/items`, {
      usuarioId: Number(usuarioId),
      productoId: Number(productoId),
      cantidad: Number(cantidad),
    });
    return response.data;
  },

  confirmarPedido: async (usuarioId: number, metodoPago: string): Promise<unknown> => {
    const response = await api.post(`/carritos/checkout`, {
      usuarioId: Number(usuarioId),
      metodoPago,
      tipoOrigen: 'WEB',
    });
    return response.data;
  },
};