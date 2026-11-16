export interface ApiUsuario {
  id: number;
  email: string;
  nombre: string;
  telefono: string;
  rolId: number;
  creadoEn: string;
}

export interface UsuariosResponse {
  success: boolean;
  data: ApiUsuario[];
  timestamp?: string;
}