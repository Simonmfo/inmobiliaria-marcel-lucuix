import { Phone, MapPin, Instagram, Clock, MessageCircle, ShieldCheck, FileCheck, Building2, Mail, Facebook, Award } from 'lucide-react';

interface FooterProps {
  setView: (view: 'showroom' | 'inventory' | 'admin' | 'add-vehicle' | 'login') => void;
}

export default function Footer({ setView }: FooterProps) {
  return (
    <footer className="w-full bg-slate-950 text-slate-300 border-t border-slate-800 mt-auto">
      {/* Upper Features Strip */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
          
          <div className="flex items-center justify-center md:justify-start gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
              <Award className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm">Respaldo CIU & FIDECIU</h4>
              <p className="text-xs text-slate-400 mt-0.5">Socio activo de la Cámara Inmobiliaria Uruguaya. Máxima seguridad jurídica.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm">Garantías de Alquiler Ágiles</h4>
              <p className="text-xs text-slate-400 mt-0.5">Trabajamos con ANDA, Porto Seguro, CGN (Contaduría), Mapfre y FIDECIU.</p>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-start gap-4 p-2">
            <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center text-gold-400 shrink-0">
              <FileCheck className="w-6 h-6 text-gold-400" />
            </div>
            <div>
              <h4 className="font-display font-bold text-white text-sm">Tasaciones & Créditos</h4>
              <p className="text-xs text-slate-400 mt-0.5">Tasaciones comerciales y oficiales para préstamos hipotecarios de todos los bancos.</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main 4-Column Footer */}
      <div className="max-w-7xl mx-auto py-14 px-6 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Col 1: Identity & About */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img 
              src="/marcel-lucuix-official-logo.png" 
              alt="Inmobiliaria Marcel Lucuix" 
              className="h-12 w-auto object-contain rounded-lg border border-emerald-800 shadow" 
            />
          </div>
          
          <p className="text-xs leading-relaxed text-slate-400">
            Firma inmobiliaria de referencia en Paysandú y la región litoral. Especialistas en venta, alquiler, tasaciones y administración integral de propiedades urbanas y rurales.
          </p>

          <div className="pt-2 flex items-center gap-3">
            <a 
              href="https://wa.me/59898689246?text=Hola%20Inmobiliaria%20Marcel%20Lucuix,%20me%20comunico%20desde%20su%20sitio%20web" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors shadow-sm"
              title="WhatsApp: 098 689 246"
            >
              <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
            </a>
            <a 
              href="https://www.instagram.com/inmobiliaria_marcellucuix/?hl=es" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center hover:opacity-90 transition-opacity"
              title="Instagram: @inmobiliaria_marcellucuix"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a 
              href="https://www.facebook.com/p/Inmobiliaria-Marcel-Lucuix-100063681423456/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="w-9 h-9 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors"
              title="Facebook: Inmobiliaria Marcel Lucuix"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a 
              href="tel:+59847227016" 
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors border border-slate-700"
              title="Llamar al 472 27016"
            >
              <Phone className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 className="text-white text-sm font-bold tracking-wide uppercase mb-4 border-l-2 border-gold-500 pl-2">
            Navegación
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li>
              <button 
                onClick={() => setView('showroom')} 
                className="hover:text-gold-400 transition-colors cursor-pointer"
              >
                Portada & Destacados
              </button>
            </li>
            <li>
              <button 
                onClick={() => setView('inventory')} 
                className="hover:text-gold-400 transition-colors cursor-pointer"
              >
                Catálogo de Propiedades
              </button>
            </li>
            <li>
              <a 
                href="#servicios" 
                onClick={() => setView('showroom')} 
                className="hover:text-gold-400 transition-colors"
              >
                Tasaciones Oficiales
              </a>
            </li>
            <li>
              <a 
                href="#garantias" 
                onClick={() => setView('showroom')} 
                className="hover:text-gold-400 transition-colors"
              >
                Garantías de Alquiler
              </a>
            </li>
            <li>
              <button 
                onClick={() => setView('login')} 
                className="hover:text-gold-400 transition-colors cursor-pointer"
              >
                Acceso Administrador
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Categorías de Inmuebles */}
        <div>
          <h4 className="text-white text-sm font-bold tracking-wide uppercase mb-4 border-l-2 border-gold-500 pl-2">
            Inmuebles en Paysandú
          </h4>
          <ul className="space-y-2.5 text-xs text-slate-400">
            <li className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-gold-500" />
              <span>Casas Residenciales</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-gold-500" />
              <span>Apartamentos en Venta y Alquiler</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-gold-500" />
              <span>Terrenos y Lotes para Edificar</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-gold-500" />
              <span>Chacras y Campos Productivos</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-gold-500" />
              <span>Locales Comerciales & Oficinas</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Ubicación & Contacto Directo */}
        <div>
          <h4 className="text-white text-sm font-bold tracking-wide uppercase mb-4 border-l-2 border-gold-500 pl-2">
            Contacto & Oficina
          </h4>
          <div className="space-y-3 text-xs text-slate-400">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>
                <strong className="text-white block">Oficina Central:</strong>
                33 Orientales 950 (entre 18 de Julio y Leandro Gómez)<br />
                Paysandú, Uruguay
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-gold-500 shrink-0" />
              <div>
                <a href="tel:+59847227016" className="text-slate-300 hover:text-white transition-colors">
                  (+598) 472 27016
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-slate-300">
                <a href="https://wa.me/59898689246" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">
                  098 689 246
                </a>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-gold-500 shrink-0" />
              <a href="mailto:lucuix@adinet.com.uy" className="text-slate-300 hover:text-white transition-colors">
                lucuix@adinet.com.uy
              </a>
            </div>

            <div className="flex items-start gap-2.5 pt-1">
              <Clock className="w-4 h-4 text-gold-500 shrink-0 mt-0.5" />
              <span>
                Lun a Jue: 8:30 a 12:00 y 14:00 a 18:00 hs<br />
                Viernes: 8:30 a 12:00 y 14:00 a 17:00 hs
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Legal / Copyright Strip */}
      <div className="border-t border-slate-900 bg-slate-950 py-5 px-6 md:px-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-3">
          <p>
            © {new Date().getFullYear()} Inmobiliaria Marcel Lucuix. Todos los derechos reservados. Paysandú, Uruguay.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Socio CIU N° Registro Oficial</span>
            <span>·</span>
            <span>Garantías FIDECIU</span>
            <span>·</span>
            <span>Paysandú - Uruguay</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
