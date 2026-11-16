import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Header } from './Header';
import { SidebarLink } from './BarraLateral';
import { useAuthStore } from '../store/useAuthStore';

const navItems = [
  { to: '/', icon: 'dashboard', label: 'Dashboard', roles: [1, 2, 3] },
  { to: '/productos', icon: 'inventory_2', label: 'Productos', roles: [1, 2, 3] },
  { to: '/ventas', icon: 'receipt_long', label: 'Ventas', roles: [1, 2] },
  { to: '/cajas', icon: 'point_of_sale', label: 'Cajas POS', roles: [1, 2] },
  { to: '/carrito', icon: 'shopping_cart', label: 'Carritos', roles: [1] },
  { to: '/users', icon: 'group', label: 'Usuarios', roles: [1] },
  { to: '/pos', icon: 'point_of_sale', label: 'Punto de Venta (POS)', roles: [1, 2] },
  { to: '/micarrito', icon: 'shopping_cart', label: 'Mi Carrito Web', roles: [3] },
  { to: '/catalogo', icon: 'storefront', label: 'Catálogo Web', roles: [3] },
];

export const MainLayout: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const rolId = useAuthStore((state) => state.rolId);
  const navigate = useNavigate();

  // Obtenemos el rol actual (respaldado con localStorage si fuera necesario)
  const currentRolId = rolId || Number(localStorage.getItem('rolId')) || 3;

  // Filtramos los enlaces según el rol del usuario conectado
  const visibleLinks = navItems.filter((item) => item.roles.includes(currentRolId));

  const handleGlobalSearch = (term: string) => {
    console.log('Búsqueda global:', term);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-surface font-sans text-on-surface">
      <aside className="fixed left-0 top-0 h-screen w-72 bg-surface-container-lowest z-50 flex flex-col justify-between shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-r border-surface-container-high">
        <div className="flex flex-col">
          <div className="h-16 px-6 flex items-center gap-3">
            <span className="font-semibold text-lg text-primary tracking-tight">PAOLO E-COMMERCE</span>
          </div>
          <nav className="flex flex-col gap-1 px-4 mt-4">
            {visibleLinks.map((link) => (
              <SidebarLink 
                key={link.to} 
                to={link.to} 
                icon={link.icon} 
                label={link.label} 
              />
            ))}
          </nav>
        </div>

        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-on-surface-variant hover:bg-error-container hover:text-on-error-container transition-colors text-sm font-medium"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      <Header onSearch={handleGlobalSearch} />
      
      <main className="pl-72 pt-16 bg-surface min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};