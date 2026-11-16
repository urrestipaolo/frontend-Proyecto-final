export interface ProductoEnCarrito {
  id: number;
  categoriaId: number;
  sku: string;
  nombre: string;
  precioCompra: string;
  precioVenta: string;
  stock: number;
  activo: boolean;
}

export interface DetalleCarrito {
  id: number;
  ventaOrdenId?: number;
  productoId: number;
  cantidad: number;
  precioUnitario: string;
  subtotal: string;
  producto: ProductoEnCarrito;
}

export interface ApiCarrito {
  id: number;
  usuarioId: number;
  detalles: DetalleCarrito[];
}

export interface CarritoResponse {
  success: boolean;
  data: ApiCarrito;
  timestamp: string;
}