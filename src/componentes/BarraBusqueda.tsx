import React, { useState } from 'react';

interface BarraBusquedaProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export const BarraBusqueda: React.FC<BarraBusquedaProps> = ({
  placeholder = 'Buscar en el sistema...',
  onSearch,
}) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  return (
    <div className="relative flex items-center w-full max-w-md mx-auto">
      <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-outline text-lg pointer-events-none select-none">
        search
      </span>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="w-full pl-10 pr-20 py-2 bg-surface-container-low rounded-lg text-on-surface placeholder:text-outline text-sm focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-secondary transition-all border-none"
      />

      <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[11px] font-semibold pointer-events-none select-none">
        Ctrl + K
      </kbd>
    </div>
  );
};