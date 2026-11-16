import { create } from 'zustand';
import { authService, LoginCredentials } from '../services/authService';

interface AuthState {
  isAuthenticated: boolean;
  usuarioId: number | null;
  rolId: number | null;
  loading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
}

const decodificarPayloadDelToken = (token: string): Record<string, unknown> => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return {};
  }
};

const obtenerRolIdInicial = (): number | null => {
  const rolIdStr = localStorage.getItem('rolId');
  if (rolIdStr) return Number(rolIdStr);

  const userRole = localStorage.getItem('user_role')?.toLowerCase();
  if (userRole === 'admin' || userRole === 'administrador') return 1;
  if (userRole === 'cajero') return 2;
  if (userRole === 'cliente') return 3;

  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: authService.isAuthenticated(),
  usuarioId: Number(localStorage.getItem('usuarioId') || localStorage.getItem('usuarioid')) || null,
  rolId: obtenerRolIdInicial(),
  loading: false,
  error: null,

  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const data = await authService.login(credentials);
      
      const responseAny = data as Record<string, unknown>;
      const token = (responseAny.token as string) || (authService.getToken ? authService.getToken() : null);
      
      const usuarioObj = responseAny.usuario as { id?: number; nombre?: string; name?: string; rolId?: number; roleId?: number; rol?: number; role?: string } | undefined;
      
      let idUsuario = usuarioObj?.id || (responseAny.id as number);
      let idRol = usuarioObj?.rolId || usuarioObj?.roleId || usuarioObj?.rol || (responseAny.rolId as number);
      let rolTexto = usuarioObj?.role;

      // Extraemos el nombre real del usuario de la respuesta del backend
      let nombreUsuario = usuarioObj?.nombre || usuarioObj?.name || (responseAny.nombre as string) || (responseAny.name as string);

      if (token) {
        const payload = decodificarPayloadDelToken(token);
        if (!idUsuario) {
          idUsuario = (payload.sub as number) || (payload.id as number) || (payload.usuarioId as number);
        }
        if (!idRol) {
          idRol = (payload.rolId as number) || (payload.roleId as number) || (payload.rol as number);
        }
        if (!rolTexto) {
          rolTexto = (payload.role as string) || (payload.rol as string);
        }
        // Si el token incluye el nombre, lo respaldamos
        if (!nombreUsuario) {
          nombreUsuario = (payload.nombre as string) || (payload.name as string);
        }
      }

      if (!idRol && rolTexto) {
        const rLower = rolTexto.toLowerCase();
        if (rLower === 'admin' || rLower === 'administrador') idRol = 1;
        else if (rLower === 'cajero') idRol = 2;
        else if (rLower === 'cliente') idRol = 3;
      }

      if (!idRol) {
        if (credentials.email.includes('admin')) idRol = 1;
        else if (credentials.email.includes('cajero')) idRol = 2;
        else idRol = 3;
      }

      if (data && token && idUsuario) {
        localStorage.setItem('usuarioId', String(idUsuario));
        localStorage.setItem('rolId', String(idRol));
        localStorage.setItem('user_role', idRol === 1 ? 'admin' : idRol === 2 ? 'cajero' : 'cliente');
        
        // Guardamos el nombre real obtenido en el localStorage para que el Header lo lea
        if (nombreUsuario) {
          localStorage.setItem('user_name', String(nombreUsuario));
        } else {
          localStorage.setItem('user_name', credentials.email.split('@')[0]);
        }

        set({ 
          isAuthenticated: true, 
          usuarioId: Number(idUsuario), 
          rolId: Number(idRol), 
          loading: false 
        });
        return true;
      }

      set({ error: 'Credenciales inválidas', loading: false });
      return false;
    } catch (err: unknown) {
      let errorMsg = 'Error al iniciar sesión';
      if (typeof err === 'object' && err !== null) {
        const errorObj = err as { response?: { data?: { message?: string } }; message?: string };
        errorMsg = errorObj.response?.data?.message || errorObj.message || errorMsg;
      }
      set({ error: errorMsg, loading: false });
      return false;
    }
  },

  logout: () => {
    authService.logout();
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('rolId');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_name'); // Limpiamos también el nombre al cerrar sesión
    set({ isAuthenticated: false, usuarioId: null, rolId: null });
  },
}));