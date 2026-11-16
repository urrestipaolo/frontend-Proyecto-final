import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarraBusqueda } from './BarraBusqueda';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../lib/axios';

interface HeaderProps {
  onSearch: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const logout = useAuthStore((state) => state.logout);
  const usuarioId = useAuthStore((state) => state.usuarioId);
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userName = localStorage.getItem('user_name') || 'Usuario';
  const avatarUrl = localStorage.getItem('user_avatar');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !usuarioId) return;

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await api.patch(`/users/${usuarioId}/avatar`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const nuevaRutaAvatar = response.data?.data?.avatarUrl || response.data?.avatarUrl;

      if (nuevaRutaAvatar) {
        localStorage.setItem('user_avatar', nuevaRutaAvatar);
        alert('¡Foto de perfil actualizada con éxito!');
        window.location.reload();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error al subir la foto de perfil');
    }
  };


  const initials = userName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="fixed top-0 left-72 right-0 h-16 bg-surface-container-lowest/80 backdrop-blur-xl z-40 shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-surface-container-high">
      <div className="w-full px-6 h-full flex items-center justify-between gap-6">
        
        <div className="flex items-center gap-2 min-w-max">
          <span className="text-on-surface-variant text-xs font-medium">Portal</span>
          <span className="text-outline-variant text-xs">/</span>
          <span className="text-sm font-medium text-on-surface">Gestión de productos</span>
        </div>

        <div className="flex items-center gap-4 min-w-max">
          <div className="flex items-center gap-3 pl-3 border-l border-surface-container-high">
            
            {/* Input de archivo oculto */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept="image/*" 
              className="hidden" 
            />

            {/* Avatar clickeable que muestra la imagen o las iniciales */}
            <div 
              onClick={handleAvatarClick}
              className="w-9 h-9 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs overflow-hidden cursor-pointer hover:opacity-80 transition-opacity relative group"
              title="Haz clic para cambiar tu foto de perfil"
            >
              {avatarUrl ? (
                <img 
                  src={`https://proyecto-final-backend-jbj4.onrender.com/${avatarUrl}`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                initials
              )}
              {/* Overlay con icono de cámara al pasar el mouse */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="material-symbols-outlined text-white text-xs">photo_camera</span>
              </div>
            </div>

            <div className="flex flex-col text-left">
              <span className="text-xs font-semibold text-on-surface leading-tight">
                {userName}
              </span>
              <span className="text-[11px] text-on-surface-variant leading-tight">
                Sesión Activa
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container transition-colors"
              title="Cerrar sesión"
            >
              <span className="material-symbols-outlined text-lg">logout</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};