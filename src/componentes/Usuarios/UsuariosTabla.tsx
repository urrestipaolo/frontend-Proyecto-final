import React from 'react';
import { ApiUsuario } from '../../types/usuarios';

interface UsuariosTablaProps {
  usuarios: ApiUsuario[];
  onView: (id: number) => void;
  isLoading?: boolean;
}

export const UsuariosTabla: React.FC<UsuariosTablaProps> = ({
  usuarios,
  onView,
  isLoading,
}) => {
  return (
    <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden flex flex-col">
      <div className={`h-0.5 w-full bg-surface-container-high overflow-hidden transition-opacity ${isLoading ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full h-full bg-secondary origin-left animate-pulse"></div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low text-xs uppercase tracking-wider text-on-surface-variant font-semibold">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Nombre y Correo</th>
              <th className="py-3 px-4">Teléfono</th>
              <th className="py-3 px-4 text-center">Rol ID</th>
              <th className="py-3 px-4">Fecha de Registro</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-container-low text-sm">
            {usuarios.length === 0 && !isLoading ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-on-surface-variant text-sm">
                  No hay usuarios registrados.
                </td>
              </tr>
            ) : (
              usuarios.map((usuario) => {
                const fechaFormateada = new Date(usuario.creadoEn).toLocaleString();
                return (
                  <tr 
                    key={usuario.id} 
                    className="hover:bg-surface-container-low/70 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-medium text-primary">#{usuario.id}</td>

                    <td className="py-3.5 px-4">
                      <div>
                        <span className="text-on-surface block font-medium">{usuario.nombre}</span>
                        <span className="text-xs text-on-surface-variant">{usuario.email}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-on-surface-variant">
                      {usuario.telefono || 'Sin teléfono'}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-1 rounded-md bg-surface-container text-on-surface-variant text-xs font-medium">
                        Rol: {usuario.rolId}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-xs text-on-surface-variant">
                      {fechaFormateada}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};