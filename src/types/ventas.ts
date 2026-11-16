export interface ApiUser {
  id: number;
  nombre: string;
  email: string;
}

export interface ApiProductDetail {
  id: number;
  categoriaId: number;
  sku: string;
  nombre: string;
  precioCompra: string;
  precioVenta: string;
  stock: number;
  activo: boolean;
}

export interface VentaDetail {
  id: number;
  ventaOrdenId: number;
  productoId: number;
  cantidad: number;
  precioUnitario: string;
  subtotal: string;
  producto: ApiProductDetail;
}

export interface ApiVenta {
  id: number;
  usuarioId: number;
  cajaId: number | null;
  direccionId: number | null;
  tipoOrigen: string;
  estado: string;
  metodoPago: string;
  total: string;      
  creadoEn: string;
  usuario: ApiUser;
  detalles: VentaDetail[];
}

export interface VentasResponse {
  success: boolean;
  data: ApiVenta[];
}