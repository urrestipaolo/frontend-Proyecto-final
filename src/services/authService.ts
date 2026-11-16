import { api } from '../lib/axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

const decodificarPayloadDelToken = (token: string): Record<string, any> => {
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
    console.error('Error al decodificar el token', e);
    return {};
  }
};

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    
    // Extraemos los datos de la respuesta (adaptado a diferentes estructuras de backend)
    const responseData = response.data?.data || response.data;
    const token = responseData?.token || responseData;
    const usuarioObj = responseData?.usuario || responseData?.user;

    if (token) {
      localStorage.setItem('token', typeof token === 'string' ? token : token.token);

      const tokenStr = typeof token === 'string' ? token : token.token;
      const payload = decodificarPayloadDelToken(tokenStr);

      // Obtenemos el ID del usuario (de la respuesta o del token)
      const usuarioId = usuarioObj?.id || payload.sub || payload.id || payload.usuarioId || 9;
      localStorage.setItem('usuarioId', String(usuarioId));

      // Obtenemos el nombre y lo guardamos para el Header
      const nombreUsuario = usuarioObj?.nombre || usuarioObj?.name || payload.nombre || payload.name;
      if (nombreUsuario) {
        localStorage.setItem('user_name', String(nombreUsuario));
      } else {
        localStorage.setItem('user_name', credentials.email.split('@')[0]);
      }

      // Obtenemos el avatar si el usuario ya lo tiene registrado
      const avatarUrl = usuarioObj?.avatarUrl || payload.avatarUrl;
      if (avatarUrl) {
        localStorage.setItem('user_avatar', String(avatarUrl));
      } else {
        localStorage.removeItem('user_avatar');
      }

      return { 
        success: true, 
        token: tokenStr, 
        usuario: { 
          id: usuarioId, 
          nombre: nombreUsuario,
          avatarUrl: avatarUrl 
        } 
      };
    }

    throw new Error('No se encontró el token en la respuesta del servidor');
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_avatar');
    localStorage.removeItem('rolId');
    localStorage.removeItem('user_role');
  },

  getToken: (): string | null => {
    return localStorage.getItem('token');
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },
};