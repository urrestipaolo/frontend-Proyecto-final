import React from 'react';
import { NavLink } from 'react-router-dom';

interface SidebarLinkProps {
  to: string;
  icon: string;
  label: string;
}

export const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors font-medium text-sm ${
          isActive
            ? 'bg-primary-container text-on-primary'
            : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
        }`
      }
    >
      <span className="material-symbols-outlined text-xl">{icon}</span>
      {label}
    </NavLink>
  );
};