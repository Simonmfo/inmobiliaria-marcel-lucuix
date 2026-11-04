import { useState, useMemo } from 'react';
import { 
  SlidersHorizontal, 
  Search, 
  RotateCcw,
  MessageCircle,
  Home,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ChevronRight,
  Filter,
  Check
} from 'lucide-react';
import { Property } from '../types';

interface InventoryViewProps {
  vehicles: Property[];
  onSelectVehicle: (property: Property) => void;
  setView: (view: 'showroom' | 'inventory' | 'admin' | 'add-vehicle' | 'login') => void;
}

export default function InventoryView({ vehicles, onSelectVehicle, setView }: InventoryViewProps) {
  // Filter States
  const [selectedOperation, setSelectedOperation] = useState('Todas');
  const [selectedType, setSelectedType] = useState('Todas');
  const [selectedLocation, setSelectedLocation] = useState('Todas');
  const [minBedrooms, setMinBedrooms] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract unique locations
  const locationsList = useMemo(() => {
    const visible = vehicles.filter(v => v.status !== 'Hidden');
    const locs = new Set(visible.map(v => v.location || v.color).filter(Boolean));
    return ['Todas', ...Array.from(locs)];
  }, [vehicles]);

  const handleResetFilters = () => {
    setSelectedOperation('Todas');
    setSelectedType('Todas');
    setSelectedLocation('Todas');
    setMinBedrooms(0);
    setSearchQuery('');
    setSortBy('newest');
  };

  // Filter and Sort Properties
  const filteredProperties = useMemo(() => {
    return vehicles.filter(v => {
      if (v.status === 'Hidden') return false;

      const matchOp = selectedOperation === 'Todas' || 
        v.operation === selectedOperation || 
        v.transmission === selectedOperation;

      const matchType = selectedType === 'Todas' || 
        (v.propertyType && v.propertyType.toLowerCase() === selectedType.toLowerCase()) ||
        v.brand.toLowerCase() === selectedType.toLowerCase() ||
        v.category.toLowerCase().includes(selectedType.toLowerCase());

      const matchLocation = selectedLocation === 'Todas' || 
        (v.location && v.location.toLowerCase() === selectedLocation.toLowerCase()) ||
        (v.color && v.color.toLowerCase() === selectedLocation.toLowerCase());

      const matchBeds = minBedrooms === 0 || (v.bedrooms || 0) >= minBedrooms;

      const query = searchQuery.toLowerCase().trim();
      const matchSearch = query === '' || 
        `${v.title} ${v.model} ${v.location} ${v.propertyType} ${v.code || v.stockId} ${v.description}`.toLowerCase().includes(query);

      return matchOp && matchType && matchLocation && matchBeds && matchSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'area-desc') return b.totalArea - a.totalArea;
      return 0; // default
    });
  }, [vehicles, selectedOperation, selectedType, selectedLocation, minBedrooms, searchQuery, sortBy]);

  const handleQuickWhatsApp = (v: Property) => {
    const priceText = v.currency === 'USD' ? `US$ ${v.price.toLocaleString()}` : `$ ${v.price.toLocaleString()} UYU`;
    const text = encodeURIComponent(
      `Hola Inmobiliaria Marcel Lucuix, me interesa la propiedad "${v.title}" (${v.operation} - ${priceText}) ubicada en ${v.location}, Paysandú. ¿Podríamos coordinar una visita?`
    );
    window.open(`https://wa.me/59898689246?text=${text}`, "_blank");
  };

  const totalVisible = vehicles.filter(v => v.status !== 'Hidden').length;

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
              <button onClick={() => setView('showroom')} className="hover:text-brand-600 transition-colors cursor-pointer">
                Inicio
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold text-slate-800">Catálogo de Propiedades</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
              Catálogo de Inmuebles en Paysandú
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Ventas y alquileres gestionados por Inmobiliaria Marcel Lucuix (33 Orientales 950).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-white text-slate-600 font-semibold px-3 py-1.5 rounded-lg border border-slate-200">
              {filteredProperties.length} de {totalVisible} inmuebles en catálogo
            </span>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-2 bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-lg cursor-pointer"
            >
              <Filter className="w-4 h-4" />
              Filtros
            </button>
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por zona, tipo, calle o código..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <label className="text-xs font-semibold text-slate-500 shrink-0">Ordenar por:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="newest">Publicaciones recientes</option>
              <option value="price-asc">Precio: Menor a Mayor</option>
              <option value="price-desc">Precio: Mayor a Menor</option>
              <option value="area-desc">Mayor superficie (m²)</option>
            </select>
          </div>
        </div>

        {/* Main Content Layout with Sidebar Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-start">
          
          {/* Filters Sidebar */}
          <aside className={`space-y-6 md:block ${showMobileFilters ? 'block' : 'hidden'}`}>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="font-display font-bold text-sm text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                  Filtrar Resultados
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-brand-600 hover:underline font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                  title="Restablecer"
                >
                  <RotateCcw className="w-3 h-3" /> Limpiar
                </button>
              </div>

              {/* Operación */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Operación
                </label>
                <div className="flex flex-col gap-1 text-xs">
                  {['Todas', 'Venta', 'Alquiler'].map(op => (
                    <button
                      key={op}
                      onClick={() => setSelectedOperation(op)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center cursor-pointer ${
                        selectedOperation === op 
                          ? 'bg-emerald-50 text-brand-600 font-bold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{op === 'Todas' ? 'Todas las operaciones' : op}</span>
                      {selectedOperation === op && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tipo de Inmueble */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Tipo de Inmueble
                </label>
                <div className="flex flex-col gap-1 text-xs">
                  {['Todas', 'Casa', 'Apartamento', 'Chacra / Campo', 'Local Comercial', 'Terreno'].map(t => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex justify-between items-center cursor-pointer ${
                        selectedType === t 
                          ? 'bg-emerald-50 text-brand-600 font-bold' 
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{t === 'Todas' ? 'Todos los tipos' : t}</span>
                      {selectedType === t && <Check className="w-3.5 h-3.5 text-brand-600" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dormitorios */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                  Dormitorios
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { val: 0, label: 'Todos' },
                    { val: 1, label: '1+' },
                    { val: 2, label: '2+' },
                    { val: 3, label: '3+' }
                  ].map(d => (
                    <button
                      key={d.val}
                      onClick={() => setMinBedrooms(d.val)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors cursor-pointer text-center ${
                        minBedrooms === d.val 
                          ? 'bg-brand-600 text-white border-brand-600' 
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ubicación / Zona */}
              {locationsList.length > 1 && (
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Zona / Ubicación
                  </label>
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    {locationsList.map(loc => (
                      <option key={loc} value={loc}>{loc === 'Todas' ? 'Todas las zonas' : loc}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Direct WhatsApp Callout in Sidebar */}
              <div className="bg-slate-900 text-white p-4 rounded-xl text-xs space-y-2">
                <strong className="block text-white font-bold">¿Buscás otro inmueble?</strong>
                <p className="text-slate-300 leading-snug">
                  Si no encontrás la propiedad que buscás, consultanos y te avisamos al ingresar nuevas opciones en Paysandú.
                </p>
                <a
                  href="https://wa.me/59898689246?text=Hola%20Inmobiliaria%20Marcel%20Lucuix,%20estoy%20buscando%20un%20inmueble%20espec%C3%ADfico%20en%20Paysand%C3%BA"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-emerald-400 font-bold hover:underline pt-1"
                >
                  Consultar por WhatsApp &rarr;
                </a>
              </div>

            </div>
          </aside>

          {/* Properties Grid */}
          <div className="md:col-span-3">
            {filteredProperties.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
                <Home className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="font-display font-bold text-lg text-slate-800">
                  No encontramos inmuebles con estos criterios
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Intentá quitar algún filtro o comunicate directamente con nosotros por WhatsApp.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="bg-brand-600 text-white font-bold text-xs py-2 px-4 rounded-lg hover:bg-brand-700 transition-colors cursor-pointer"
                >
                  Restablecer Filtros
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((p) => {
                  const isRental = p.operation === "Alquiler";
                  const formattedPrice = isRental 
                    ? `$ ${p.price.toLocaleString()} UYU / mes` 
                    : `US$ ${p.price.toLocaleString()}`;

                  return (
                    <div
                      key={p.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all group flex flex-col justify-between"
                    >
                      <div>
                        {/* Image & Diagonal Ribbons */}
                        <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                          <img
                            src={p.image}
                            alt={p.title}
                            className={`w-full h-full object-cover transition-transform duration-300 ${
                              p.status === 'Sold' ? 'grayscale-[35%] group-hover:scale-100' : 'group-hover:scale-105'
                            }`}
                          />
                          <span className={`absolute top-2.5 left-2.5 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase z-10 shadow-sm ${
                            isRental ? "bg-emerald-700" : "bg-slate-900/90"
                          }`}>
                            {p.operation || (isRental ? "Alquiler" : "Venta")}
                          </span>

                          {p.status === 'Active' && (
                            <span className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm border border-slate-200">
                              {p.propertyType || p.brand}
                            </span>
                          )}

                          {/* Diagonal Ribbon for Sold / Rented */}
                          {p.status === 'Sold' && (
                            <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden z-20 pointer-events-none">
                              <div className="absolute top-[20px] -right-[36px] w-[140px] transform rotate-45 bg-red-600 text-white font-black text-[10px] tracking-widest uppercase text-center py-1 shadow-md border-y border-white/30">
                                {isRental ? 'ALQUILADO' : 'VENDIDO'}
                              </div>
                            </div>
                          )}

                          {/* Diagonal Ribbon for Reserved */}
                          {p.status === 'Reserved' && (
                            <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden z-20 pointer-events-none">
                              <div className="absolute top-[20px] -right-[36px] w-[140px] transform rotate-45 bg-amber-500 text-slate-950 font-black text-[10px] tracking-widest uppercase text-center py-1 shadow-md border-y border-white/40">
                                RESERVADO
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Body */}
                        <div className="p-4 space-y-2">
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                            <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span className="truncate">{p.location || p.color}, Paysandú</span>
                          </div>

                          <h4 className="font-display font-bold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors">
                            {p.title || p.model}
                          </h4>

                          {/* Specs */}
                          <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 pt-1">
                            {p.bedrooms > 0 && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <Bed className="w-3 h-3 text-slate-500" />
                                {p.bedrooms} Dorm.
                              </span>
                            )}
                            {p.bathrooms > 0 && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <Bath className="w-3 h-3 text-slate-500" />
                                {p.bathrooms} Baño
                              </span>
                            )}
                            {p.totalArea > 0 && (
                              <span className="bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                                <Maximize2 className="w-3 h-3 text-slate-500" />
                                {p.totalArea.toLocaleString()} m²
                              </span>
                            )}
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                            <div>
                              <span className="text-[10px] text-slate-400 uppercase font-semibold block">
                                {isRental ? "Alquiler" : "Precio"}
                              </span>
                              <span className="font-display font-extrabold text-base text-slate-900">
                                {formattedPrice}
                              </span>
                            </div>
                            {p.status === 'Sold' ? (
                              <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                                {isRental ? 'Alquilado' : 'Vendido'}
                              </span>
                            ) : p.status === 'Reserved' ? (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                Reservado
                              </span>
                            ) : (
                              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {isRental ? "Garantías" : "Acepta Banco"}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => onSelectVehicle(p)}
                          className="w-full text-center py-2 px-3 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                        >
                          Ver Ficha
                        </button>
                        <button
                          onClick={() => handleQuickWhatsApp(p)}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-sm"
                        >
                          <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
                          Consultar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
