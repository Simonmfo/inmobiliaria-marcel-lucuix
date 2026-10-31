import { useState } from 'react';
import { 
  Home, 
  PlusCircle, 
  LayoutDashboard, 
  LogIn, 
  LogOut, 
  Menu, 
  X,
  Phone,
  MapPin,
  Clock,
  MessageCircle,
  Award
} from 'lucide-react';

interface HeaderProps {
  currentView: 'showroom' | 'inventory' | 'admin' | 'add-vehicle' | 'login';
  setView: (view: 'showroom' | 'inventory' | 'admin' | 'add-vehicle' | 'login') => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  totalVehicles?: number;
}

export default function Header({ 
  currentView, 
  setView, 
  isAuthenticated, 
  setIsAuthenticated,
  totalVehicles = 7
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (view: 'showroom' | 'inventory' | 'admin' | 'add-vehicle' | 'login') => {
    setView(view);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 w-full z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm transition-all">
      {/* Top Bar for Contact, CIU Accreditation & Trust */}
      <div className="hidden lg:block bg-slate-900 text-slate-300 text-xs py-2 px-6 md:px-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 hover:text-white transition-colors">
              <MapPin className="w-3.5 h-3.5 text-gold-500" />
              33 Orientales 950, Paysandú, Uruguay
            </span>
            <span className="flex items-center gap-1.5 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-gold-500" />
              Lun a Jue 8:30 a 12:00 y 14:00 a 18:00 | Vie 8:30 a 17:00 hs
            </span>
            <span className="flex items-center gap-1.5 text-gold-400 font-medium">
              <Award className="w-3.5 h-3.5" />
              Socio CIU & FIDECIU
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a 
              href="tel:+59847227016" 
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-gold-500" />
              Tel: 4722 7016
            </a>
            <a 
              href="https://wa.me/59898689246?text=Hola%20Inmobiliaria%20Marcel%20Lucuix,%20me%20comunico%20desde%20su%20sitio%20web" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 font-semibold hover:text-emerald-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              WhatsApp: 098 689 246
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 h-20 flex justify-between items-center">
        {/* Brand Logo & Name */}
        <button 
          onClick={() => handleNavClick('showroom')} 
          className="flex items-center gap-3.5 text-left focus:outline-none cursor-pointer group"
        >
          <img 
            src="/marcel-lucuix-official-logo.png" 
            alt="Inmobiliaria Marcel Lucuix" 
            className="h-11 md:h-12 w-auto object-contain rounded-lg shadow-sm group-hover:scale-105 transition-transform border border-emerald-900/10" 
          />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-8 items-center">
          <button
            onClick={() => handleNavClick('showroom')}
            className={`text-sm font-semibold transition-colors cursor-pointer py-1 relative ${
              currentView === 'showroom' 
                ? 'text-brand-600 font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Inicio
            {currentView === 'showroom' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-full" />
            )}
          </button>
          
          <button
            onClick={() => handleNavClick('inventory')}
            className={`text-sm font-semibold transition-colors cursor-pointer py-1 relative flex items-center gap-2 ${
              currentView === 'inventory' 
                ? 'text-brand-600 font-bold' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Propiedades
            <span className="bg-slate-100 text-slate-700 text-xs px-2 py-0.5 rounded-full font-bold border border-slate-200">
              {totalVehicles}
            </span>
            {currentView === 'inventory' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-full" />
            )}
          </button>

          {isAuthenticated && (
            <button
              onClick={() => handleNavClick('admin')}
              className={`text-sm font-semibold transition-colors cursor-pointer py-1 relative ${
                currentView === 'admin' || currentView === 'add-vehicle'
                  ? 'text-brand-600 font-bold' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Panel de Administración
              {(currentView === 'admin' || currentView === 'add-vehicle') && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-brand-600 rounded-full" />
              )}
            </button>
          )}
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Direct WhatsApp Call to Action */}
          <a
            href="https://wa.me/59898689246?text=Hola%20Inmobiliaria%20Marcel%20Lucuix,%20me%20comunico%20desde%20su%20sitio%20web"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider px-4 py-2.5 rounded-lg shadow-sm hover:shadow transition-all"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          {isAuthenticated ? (
            <div className="hidden md:flex items-center gap-2">
              <button
                onClick={() => handleNavClick(currentView === 'admin' ? 'showroom' : 'admin')}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-300 hover:border-slate-400 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
              >
                {currentView === 'admin' ? (
                  <><Home className="w-4 h-4 text-brand-600" /> Ver Portal</>
                ) : (
                  <><LayoutDashboard className="w-4 h-4 text-brand-600" /> Gestión</>
                )}
              </button>
              <button 
                onClick={() => handleNavClick('add-vehicle')}
                className="bg-brand-600 hover:bg-brand-700 text-white px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="w-4 h-4" />
                Publicar Inmueble
              </button>
              <button
                onClick={() => {
                  setIsAuthenticated(false);
                  setView('showroom');
                }}
                className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => handleNavClick('login')}
              className="hidden md:flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-xs font-medium px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              title="Acceso administrativo"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

          {/* Mobile Hamburger Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Abrir menú"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-6 py-4 space-y-3 shadow-lg">
          <button
            onClick={() => handleNavClick('showroom')}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors ${
              currentView === 'showroom' ? 'bg-emerald-50 text-brand-600 font-bold' : 'text-slate-700'
            }`}
          >
            Inicio
          </button>
          <button
            onClick={() => handleNavClick('inventory')}
            className={`w-full text-left py-2.5 px-3 rounded-lg text-sm font-semibold transition-colors flex justify-between items-center ${
              currentView === 'inventory' ? 'bg-emerald-50 text-brand-600 font-bold' : 'text-slate-700'
            }`}
          >
            <span>Catálogo de Propiedades</span>
            <span className="bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-bold">
              {totalVehicles}
            </span>
          </button>

          <a
            href="https://wa.me/59898689246?text=Hola%20Inmobiliaria%20Marcel%20Lucuix,%20me%20comunico%20desde%20su%20sitio%20web"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold text-sm py-3 rounded-lg shadow-sm"
          >
            <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            WhatsApp: 098 689 246
          </a>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 py-1">
              <MapPin className="w-3.5 h-3.5 text-gold-600" /> 33 Orientales 950, Paysandú
            </span>
            <span className="flex items-center gap-1.5 py-1">
              <Phone className="w-3.5 h-3.5 text-gold-600" /> 472 27016 / 098 689 246
            </span>
          </div>

          <div className="pt-2 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="space-y-2">
                <button
                  onClick={() => handleNavClick('admin')}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-slate-800 flex items-center gap-2"
                >
                  <LayoutDashboard className="w-4 h-4 text-brand-600" /> Panel de Gestión
                </button>
                <button
                  onClick={() => handleNavClick('add-vehicle')}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-bold text-brand-600 flex items-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Publicar Inmueble
                </button>
                <button
                  onClick={() => {
                    setIsAuthenticated(false);
                    handleNavClick('showroom');
                  }}
                  className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium text-red-600 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" /> Cerrar Sesión
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleNavClick('login')}
                className="w-full text-left py-2 px-3 rounded-lg text-xs font-semibold text-slate-500 flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" /> Acceso Administrativo
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
