import { api } from '../lib/axios';
import { ApiUsuario, UsuariosResponse } from '../types/usuarios';

export const usuariosService = {
  getAll: async (): Promise<ApiUsuario[]> => {
    const response = await api.get<UsuariosResponse>('/users');
    return response.data.data;
  },
};