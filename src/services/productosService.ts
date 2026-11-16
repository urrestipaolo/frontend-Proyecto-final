import { api } from '../lib/axios';

export interface Producto {
  id: number;
  categoriaId: number;
  sku: string;
  nombre: string;
  descripcion: string;
  precioCompra: string | number;
  precioVenta: string | number;
  stock: number;
  activo: boolean;
}

export interface ProductoPayload {
  categoriaId: number;
  sku: string;
  nombre: string;
  precioCompra: number;
  precioVenta: number;
  stock: number;
  activo?: boolean;
}

export const productosService = {
  getAll: async (): Promise<Producto[]> => {
    const response = await api.get('/productos');
    return response.data.data;
  },

  create: async (data: ProductoPayload): Promise<Producto> => {
    const response = await api.post('/productos', data);
    return response.data.data;
  },

  update: async (id: number, data: Partial<ProductoPayload>): Promise<Producto> => {
    const response = await api.patch(`/productos/${id}`, data);
    return response.data.data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/productos/${id}`);
  },
};