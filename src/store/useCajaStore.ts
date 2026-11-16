import { create } from 'zustand';
import { api } from '../lib/axios';

export interface PosItem {
  productoId: number;
  nombre: string;
  precioVenta: number;
  cantidad: number;
  stockMaximo: number;
}

interface PosState {
  clienteId: number;
  tipoOrigen: string;
  metodoPago: string;
  items: PosItem[];
  loading: boolean;
  error: string | null;
  successVenta: any | null;

  setClienteId: (id: number) => void;
  setMetodoPago: (metodo: string) => void;
  addItem: (producto: { id: number; nombre: string; precioVenta: number; stock: number }) => void;
  updateQuantity: (productoId: number, cantidad: number) => void;
  removeItem: (productoId: number) => void;
  clearPos: () => void;
  checkout: () => Promise<boolean>;
}

export const usePosStore = create<PosState>((set, get) => ({
  clienteId: 1,
  tipoOrigen: 'POS',
  metodoPago: 'EFECTIVO',
  items: [],
  loading: false,
  error: null,
  successVenta: null,

  setClienteId: (id) => set({ clienteId: id }),
  setMetodoPago: (metodo) => set({ metodoPago: metodo }),

  addItem: (producto) => {
    const items = get().items;
    const existingIndex = items.findIndex((i) => i.productoId === producto.id);

    if (existingIndex > -1) {
      const updated = [...items];
      const newQty = updated[existingIndex].cantidad + 1;
      
      if (newQty > producto.stock) {
        set({ error: `Stock insuficiente para ${producto.nombre}` });
        return;
      }
      
      updated[existingIndex].cantidad = newQty;
      set({ items: updated, error: null });
    } else {
      if (producto.stock <= 0) {
        set({ error: `El producto ${producto.nombre} no tiene stock disponible` });
        return;
      }
      set({
        items: [
          ...items,
          {
            productoId: producto.id,
            nombre: producto.nombre,
            precioVenta: Number(producto.precioVenta),
            cantidad: 1,
            stockMaximo: producto.stock,
          },
        ],
        error: null,
      });
    }
  },

  updateQuantity: (productoId, cantidad) => {
    if (cantidad <= 0) {
      get().removeItem(productoId);
      return;
    }

    const items = get().items;
    const item = items.find((i) => i.productoId === productoId);
    if (item && cantidad > item.stockMaximo) {
      set({ error: `Stock máximo superado (${item.stockMaximo} disponibles)` });
      return;
    }

    set({
      items: items.map((i) => (i.productoId === productoId ? { ...i, cantidad } : i)),
      error: null,
    });
  },

  removeItem: (productoId) => {
    set({ items: get().items.filter((i) => i.productoId !== productoId), error: null });
  },

  clearPos: () => {
    set({ items: [], error: null, successVenta: null });
  },

  checkout: async () => {
    const state = get();
    if (state.items.length === 0) {
      set({ error: 'El carrito del POS está vacío' });
      return false;
    }

    set({ loading: true, error: null, successVenta: null });

    try {
      const payload = {
        clienteId: Number(state.clienteId),
        tipoOrigen: state.tipoOrigen,
        metodoPago: state.metodoPago,
        detalles: state.items.map((i) => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
        })),
      };

      const response = await api.post('/ventas', payload);
      
      set({
        loading: false,
        successVenta: response.data.data || response.data,
        items: [],
      });
      return true;
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al procesar la venta';
      set({ loading: false, error: errorMsg });
      return false;
    }
  },
}));