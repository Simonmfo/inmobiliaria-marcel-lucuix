import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

interface LoginViewProps {
  onLogin: () => void;
  setView: (view: 'showroom' | 'inventory' | 'admin' | 'add-vehicle' | 'login') => void;
}

export default function LoginView({ onLogin, setView }: LoginViewProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      onLogin();
    } else {
      setError('Credenciales incorrectas. Pruebe con usuario "admin" y contraseña "admin".');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      className="min-h-[75vh] flex items-center justify-center px-4 py-12 bg-slate-50"
    >
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-600" />
        
        <div className="text-center mb-8">
          <div className="mb-4">
            <img 
              src="/marcel-lucuix-official-logo.png" 
              alt="Inmobiliaria Marcel Lucuix" 
              className="h-14 w-auto mx-auto object-contain rounded-lg border border-emerald-900/10 shadow-sm"
            />
          </div>
          <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">
            Acceso Administrativo
          </h2>
          <p className="text-slate-500 text-xs mt-1">
            Gestión interna de propiedades y consultas de Inmobiliaria Marcel Lucuix
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 pl-10 text-sm text-slate-900 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
                placeholder="admin"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 pl-10 text-sm text-slate-900 focus:bg-white focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-xs font-semibold bg-red-50 p-2.5 rounded-lg border border-red-200">
              {error}
            </p>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => setView('showroom')}
              className="flex-1 px-4 py-3 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer"
            >
              Volver
            </button>
            <button
              type="submit"
              className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-4 py-3 rounded-xl transition-all text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-sm hover:shadow"
            >
              Ingresar
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="mt-8 pt-4 border-t border-slate-100 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Acceso seguro protegido · Inmobiliaria Marcel Lucuix (33 Orientales 950)</span>
        </div>
      </div>
    </motion.div>
  );
}
