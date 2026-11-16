import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const PaginaLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      navigate('/productos');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f9fc] px-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl border border-[#eef2f8] shadow-xl p-8 space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#ebddff] text-[#5b21b6] flex items-center justify-center mx-auto mb-4 font-bold text-xl">
            E
          </div>
          <h1 className="text-2xl font-bold text-[#111c2d]">PAOLO E-COMMERCE</h1>
          <p className="text-sm text-[#5c6470]">Ingresa tus credenciales para acceder al sistema</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-[#ffdad6] text-[#ba1a1a] text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c6470] mb-1.5">
              Correo Electrónico
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@correo.com"
              className="w-full px-4 py-2.5 bg-[#f4f7fe] border border-transparent rounded-xl text-sm text-[#111c2d] focus:outline-none focus:bg-white focus:border-[#712ae2] transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#5c6470] mb-1.5">
              Contraseña
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#f4f7fe] border border-transparent rounded-xl text-sm text-[#111c2d] focus:outline-none focus:bg-white focus:border-[#712ae2] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#5b21b6] text-white font-medium text-sm shadow-md hover:bg-[#420093] transition-all disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Entrar al Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};