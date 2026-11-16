export interface ApiUserCaja {
  id: number;
  nombre: string;
  email: string;
}

export interface ApiCaja {
  id: number;
  usuarioId: number;
  montoApertura: string | number;
  montoCierre?: string | number | null;
  fechaApertura: string;
  fechaCierre?: string | null;
  estado: string;
  usuario: ApiUserCaja;
  _count: {
    ventas: number;
  };
}

export interface CajasResponse {
  success: boolean;
  data: ApiCaja[];
  timestamp: string;
}