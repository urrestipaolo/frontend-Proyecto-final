import { api } from '../lib/axios';
import { ApiCaja, CajasResponse } from '../types/cajas';

export const cajasService = {
  getAll: async (): Promise<ApiCaja[]> => {
    const response = await api.get<CajasResponse>('/cajas');
    return response.data.data;
  },

  update: async (id: number, data: { estado?: string; montoCierre?: number }): Promise<any> => {
    const response = await api.patch(`/cajas/${id}`, data);
    return response.data;
  }
};