import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

interface RutaProtegidaProps {
  allowedRoles?: number[];
}

export const RutaProtegida: React.FC<RutaProtegidaProps> = ({ allowedRoles }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const rolId = useAuthStore((state) => state.rolId);
  const currentRolId = rolId || Number(localStorage.getItem('rolId')) || 3;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(currentRolId)) {
    const rutaAlternativa = currentRolId === 3 ? '/catalogo' : '/';
    return <Navigate to={rutaAlternativa} replace />;
  }

  return <Outlet />;
};