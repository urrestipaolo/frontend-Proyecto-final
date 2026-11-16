import { api } from '../lib/axios';
import { ApiVenta, VentasResponse } from '../types/ventas';

export const ventasService = {
  getAll: async (fecha?: string): Promise<ApiVenta[]> => {
    const url = fecha ? `/ventas?fecha=${fecha}` : '/ventas';
    const response = await api.get<VentasResponse>(url);
    return response.data.data;
  },

  createVenta: async (data: {
    clienteId: number;
    tipoOrigen: string;
    metodoPago: string;
    detalles: { productoId: number; cantidad: number }[];
  }) => {
    const response = await api.post('/ventas', data);
    return response.data;
  },

  update: async (id: number, data: { estado?: string; metodoPago?: string }): Promise<any> => {
    const response = await api.patch(`/ventas/${id}`, data); // O put, dependiendo de tu backend
    return response.data;
  },

  delete: async (id: number): Promise<any> => {
    const response = await api.delete(`/ventas/${id}`);
    return response.data;
  },
};