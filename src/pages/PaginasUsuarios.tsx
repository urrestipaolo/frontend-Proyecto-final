import React, { useEffect, useState, useMemo } from 'react';
import { ApiUsuario } from '../types/usuarios';
import { usuariosService } from '../services/usuariosService';
import { UsuariosTabla } from '../componentes/Usuarios/UsuariosTabla';
import { RolesModal } from '../componentes/Usuarios/RolesModal';

export const PaginaUsuarios: React.FC = () => {
  const [usuarios, setUsuarios] = useState<ApiUsuario[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isRolesModalOpen, setIsRolesModalOpen] = useState(false);

  useEffect(() => {
    const loadUsuarios = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await usuariosService.getAll();
        setUsuarios(data);
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Error al cargar los usuarios');
      } finally {
        setLoading(false);
      }
    };

    loadUsuarios();
  }, []);

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((user) => {
      const matchName = user.nombre?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      const matchEmail = user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false;
      return matchName || matchEmail;
    });
  }, [usuarios, searchQuery]);

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-surface">Gestión de Usuarios</h1>
          <p className="text-sm text-gray-500 mt-1">Lista de clientes y administradores registrados en el sistema</p>
        </div>

        <button
          onClick={() => setIsRolesModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-medium text-sm shadow-md hover:opacity-90 transition-all self-start md:self-auto"
        >
          <span className="material-symbols-outlined text-xl">admin_panel_settings</span>
          Ver Roles del Sistema
        </button>
      </header>

      <div className="bg-surface-container-lowest p-4 rounded-xl shadow-sm flex items-center gap-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="w-full max-w-sm px-4 py-2 bg-surface-container border border-transparent rounded-xl text-sm text-on-surface focus:outline-none focus:bg-surface-container-lowest focus:border-primary transition-all"
        />
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      <UsuariosTabla
        usuarios={filteredUsuarios}
        isLoading={loading}
        onView={(id) => console.log('Ver detalle de usuario ID:', id)}
      />

      <RolesModal
        isOpen={isRolesModalOpen}
        onClose={() => setIsRolesModalOpen(false)}
      />
    </div>
  );
};