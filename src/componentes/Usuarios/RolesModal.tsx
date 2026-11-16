import React, { useEffect, useState } from 'react';
import { ApiRol } from '../../services/rolesService';
import { rolesService } from '../../services/rolesService';

interface RolesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RolesModal: React.FC<RolesModalProps> = ({ isOpen, onClose }) => {
  const [roles, setRoles] = useState<ApiRol[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchRoles = async () => {
        try {
          setLoading(true);
          setError(null);
          const data = await rolesService.getAll();
          setRoles(data);
        } catch (err: any) {
          setError(err.response?.data?.message || err.message || 'Error al cargar los roles');
        } finally {
          setLoading(false);
        }
      };
      fetchRoles();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest rounded-2xl shadow-xl max-w-md w-full p-6 space-y-6 border border-surface-container-high animate-in fade-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between border-b border-surface-container-high pb-4">
          <div>
            <h3 className="text-lg font-bold text-on-surface">Roles del Sistema</h3>
            <p className="text-xs text-on-surface-variant">Listado de permisos y perfiles disponibles</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-on-surface-variant hover:bg-surface-container-high transition-colors"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs border border-red-200">
            {error}
          </div>
        )}

        <div className="space-y-2 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="text-center py-8 text-sm text-on-surface-variant flex items-center justify-center gap-2">
              <span className="material-symbols-outlined animate-spin text-lg">progress_activity</span>
              Cargando roles...
            </div>
          ) : roles.length === 0 ? (
            <p className="text-center py-8 text-sm text-on-surface-variant">No se encontraron roles registrados.</p>
          ) : (
            roles.map((rol) => (
              <div
                key={rol.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-surface-container-low border border-surface-container hover:bg-surface-container transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-primary-container text-on-primary flex items-center justify-center font-bold text-xs">
                    #{rol.id}
                  </span>
                  <span className="font-semibold text-sm text-on-surface tracking-wide">
                    {rol.nombre}
                  </span>
                </div>
                <span className="text-[11px] px-2.5 py-1 rounded-md bg-surface-container-lowest text-on-surface-variant font-medium">
                  Activo
                </span>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-surface-container text-on-surface font-medium text-sm hover:bg-surface-container-high transition-all"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};