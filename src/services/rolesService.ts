import { api } from '../lib/axios';

export interface ApiRol {
  id: number;
  nombre: string;
}

export interface RolesResponse {
  success: boolean;
  data: ApiRol[];
  timestamp?: string;
}

export const rolesService = {
  getAll: async (): Promise<ApiRol[]> => {
    const response = await api.get<RolesResponse>('/roles');
    return response.data.data;
  },
};