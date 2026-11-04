import { useState, useMemo, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Calendar, 
  ArrowRight, 
  CheckCircle2, 
  Send,
  Calculator,
  ChevronRight,
  Search,
  Filter,
  Clock,
  X,
  Building,
  Home,
  Award,
  FileCheck,
  Instagram,
  Bed,
  Bath,
  Maximize2,
  Car as GarageIcon
} from "lucide-react";
import { Property, Inquiry } from "../types";

interface ShowroomViewProps {
  vehicle?: Property;
  targetVehicleId?: string;
  allVehicles: Property[];
  onSelectVehicle: (property: Property) => void;
  onCloseVehicleDetail?: () => void;
  onAddInquiry: (inquiry: Inquiry) => void;
  setView: (view: "showroom" | "inventory" | "admin" | "add-vehicle" | "login") => void;
}

export default function ShowroomView({
  targetVehicleId,
  allVehicles,
  onSelectVehicle,
  onCloseVehicleDetail,
  onAddInquiry,
  setView
}: ShowroomViewProps) {
  // Quick Hero Filter States
  const [selectedOperation, setSelectedOperation] = useState("Todas");
  const [selectedType, setSelectedType] = useState("Todas");
  const [selectedPriceMax, setSelectedPriceMax] = useState("Todos");

  // Contact form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: ""
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Mortgage / Financing Simulator state
  const [simPrice, setSimPrice] = useState(150000);
  const [simDownPaymentPercent, setSimDownPaymentPercent] = useState(20);
  const [simYears, setSimYears] = useState(20);

  // Detail Modal property state
  const activeDetailVehicle = useMemo(() => {
    if (targetVehicleId) {
      return allVehicles.find(v => v.id === targetVehicleId) || null;
    }
    return null;
  }, [targetVehicleId, allVehicles]);

  const [activeModalImageIndex, setActiveModalImageIndex] = useState(0);

  // Reset modal image index when target property changes
  useEffect(() => {
    setActiveModalImageIndex(0);
  }, [targetVehicleId]);

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && activeDetailVehicle && onCloseVehicleDetail) {
        onCloseVehicleDetail();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeDetailVehicle, onCloseVehicleDetail]);

  // Simulator math (mortgage loan approx 6.5% annual in USD / UI)
  const downPaymentAmount = Math.round((simPrice * simDownPaymentPercent) / 100);
  const loanAmount = simPrice - downPaymentAmount;
  const totalMonths = simYears * 12;
  const monthlyRate = 0.065 / 12;
  const estimatedMonthly = Math.round(
    loanAmount > 0 
      ? (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -totalMonths))
      : 0
  );

  // Filtered properties for the showcase grid (excludes Hidden)
  const displayedProperties = useMemo(() => {
    return allVehicles.filter(v => {
      if (v.status === "Hidden") return false;
      const matchOp = selectedOperation === "Todas" || v.operation === selectedOperation || v.transmission === selectedOperation;
      const matchType = selectedType === "Todas" || 
        (v.propertyType && v.propertyType.toLowerCase() === selectedType.toLowerCase()) ||
        v.brand.toLowerCase() === selectedType.toLowerCase() ||
        v.category.toLowerCase().includes(selectedType.toLowerCase());
      
      let matchPrice = true;
      if (selectedPriceMax === "alquiler-bajo") matchPrice = v.price <= 20000;
      if (selectedPriceMax === "alquiler-medio") matchPrice = v.price > 20000 && v.price <= 35000;
      if (selectedPriceMax === "venta-bajo") matchPrice = v.price <= 150000;
      if (selectedPriceMax === "venta-alto") matchPrice = v.price > 150000;

      return matchOp && matchType && matchPrice;
    });
  }, [allVehicles, selectedOperation, selectedType, selectedPriceMax]);

  const scrollToProperties = () => {
    const el = document.getElementById("propiedades-disponibles");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmitInquiry = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    onAddInquiry({
      id: `inq-${Date.now()}`,
      vehicleId: activeDetailVehicle?.id || "general",
      vehicleName: activeDetailVehicle 
        ? `${activeDetailVehicle.title} (${activeDetailVehicle.code || activeDetailVehicle.stockId})` 
        : "Consulta General Inmobiliaria",
      fullName: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message || `Consulta desde la web. Teléfono: ${formData.phone}`,
      date: "Recién",
      status: "New",
      inquiryType: activeDetailVehicle?.operation === 'Alquiler' ? 'Alquiler' : 'Compra'
    });

    setFormSubmitted(true);
  };

  const handleQuickWhatsApp = (v: Property) => {
    const priceText = v.currency === 'USD' ? `US$ ${v.price.toLocaleString()}` : `$ ${v.price.toLocaleString()} UYU`;
    const text = encodeURIComponent(
      `Hola Inmobiliaria Marcel Lucuix, me comunico desde su sitio web. Me interesa la propiedad "${v.title}" (${v.operation} - ${priceText}) ubicada en ${v.location}, Paysandú. ¿Podríamos coordinar una visita o ampliar información?`
    );
    window.open(`https://wa.me/59898689246?text=${text}`, "_blank");
  };

  const modalImages = activeDetailVehicle 
    ? (activeDetailVehicle.gallery && activeDetailVehicle.gallery.length > 0 
        ? activeDetailVehicle.gallery 
        : [activeDetailVehicle.image])
    : [];

  return (
    <div className="space-y-0 relative">
      
      {/* 1. HERO HEADER WITH PROPERTY SEARCH */}
      <section className="relative bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-14 pb-20 px-4 sm:px-6 md:px-12 border-b border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-950/80 text-emerald-300 border border-emerald-700/40 text-xs font-bold px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Socio CIU & FIDECIU · 33 Orientales 950, Paysandú
            </div>

            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
              Tu próxima propiedad en Paysandú con el respaldo de <span className="text-emerald-400 font-serif">Marcel Lucuix</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed max-w-2xl">
              Alquileres, ventas, tasaciones oficiales y administración de propiedades en Paysandú y la región litoral. Asesoramiento personalizado y garantías ágiles.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={scrollToProperties}
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm py-3 px-5 rounded-xl shadow-lg shadow-emerald-950/50 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Search className="w-4 h-4" />
                Explorar Propiedades Disponibles
              </button>

              <a
                href="https://wa.me/59898689246?text=Hola%20Inmobiliaria%20Marcel%20Lucuix,%20quisiera%20consultar%20por%20propiedades%20disponibles"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs sm:text-sm py-3 px-5 rounded-xl transition-colors flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                WhatsApp: 098 689 246
              </a>

              <a
                href="https://www.instagram.com/inmobiliaria_marcellucuix/?hl=es"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 hover:from-purple-800/80 hover:to-pink-800/80 text-white border border-pink-700/30 font-semibold text-xs sm:text-sm py-3 px-4 rounded-xl transition-colors flex items-center gap-2"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                Ver Historias en Instagram
              </a>
            </div>
          </div>

          {/* Quick Search Filter Card */}
          <div className="mt-10 bg-white rounded-2xl p-5 md:p-6 shadow-2xl border border-slate-100 text-slate-800">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Filter className="w-4 h-4 text-brand-600" />
              Buscador de Inmuebles en Paysandú
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Operación</label>
                <select
                  value={selectedOperation}
                  onChange={(e) => setSelectedOperation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Todas">Todas las operaciones</option>
                  <option value="Venta">Venta</option>
                  <option value="Alquiler">Alquiler</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Tipo de Inmueble</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Todas">Todos los tipos</option>
                  <option value="Casa">Casas</option>
                  <option value="Apartamento">Apartamentos</option>
                  <option value="Chacra / Campo">Chacras y Campos</option>
                  <option value="Local Comercial">Locales Comerciales</option>
                  <option value="Terreno">Terrenos / Solares</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Rango de Precio</label>
                <select
                  value={selectedPriceMax}
                  onChange={(e) => setSelectedPriceMax(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Todos">Cualquier precio</option>
                  <option value="alquiler-bajo">Alquiler hasta $ 20.000 UYU</option>
                  <option value="alquiler-medio">Alquiler $ 20.000 a $ 35.000 UYU</option>
                  <option value="venta-bajo">Venta hasta US$ 150.000</option>
                  <option value="venta-alto">Venta más de US$ 150.000</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={scrollToProperties}
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Search className="w-4 h-4" />
                  Ver {displayedProperties.length} Inmuebles
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TRUST PILLARS BAR */}
      <section className="bg-white border-b border-slate-200 py-8 px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <Award className="w-8 h-8 text-brand-600 shrink-0" />
            <div>
              <h4 className="font-display font-bold text-slate-900 text-sm">Socio Oficial CIU</h4>
              <p className="text-xs text-slate-500 mt-0.5">Cámara Inmobiliaria Uruguaya. Ética y respaldo.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <ShieldCheck className="w-8 h-8 text-brand-600 shrink-0" />
            <div>
              <h4 className="font-display font-bold text-slate-900 text-sm">Garantías de Alquiler</h4>
              <p className="text-xs text-slate-500 mt-0.5">ANDA, Porto, CGN, FIDECIU y Mapfre.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <FileCheck className="w-8 h-8 text-brand-600 shrink-0" />
            <div>
              <h4 className="font-display font-bold text-slate-900 text-sm">Tasaciones Oficiales</h4>
              <p className="text-xs text-slate-500 mt-0.5">Valuaciones precisas para bancos y particulares.</p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-3">
            <Building className="w-8 h-8 text-brand-600 shrink-0" />
            <div>
              <h4 className="font-display font-bold text-slate-900 text-sm">Administración Integral</h4>
              <p className="text-xs text-slate-500 mt-0.5">Cobro de alquileres y gestión para propietarios.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. SECCIÓN PRINCIPAL: PROPIEDADES DISPONIBLES */}
      <section id="propiedades-disponibles" className="max-w-7xl mx-auto py-14 px-4 sm:px-6 md:px-12 scroll-mt-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-200 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-extrabold text-brand-600 uppercase tracking-widest">
                Cartera de Inmuebles
              </span>
              <span className="text-xs bg-emerald-50 text-brand-600 font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                {displayedProperties.length} {displayedProperties.length === 1 ? "propiedad" : "propiedades"}
              </span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900">
              Propiedades en Paysandú
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Publicaciones actualizadas directamente por Inmobiliaria Marcel Lucuix (33 Orientales 950).
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setView("inventory")}
              className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer bg-emerald-50 hover:bg-emerald-100 px-3.5 py-2 rounded-lg transition-colors border border-emerald-200"
            >
              Ver Catálogo Completo <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Operation Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 text-xs no-scrollbar">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px] shrink-0 mr-1">
            Operación:
          </span>
          {["Todas", "Venta", "Alquiler"].map((op) => (
            <button
              key={op}
              onClick={() => setSelectedOperation(op)}
              className={`px-3.5 py-1.5 rounded-full font-bold transition-colors shrink-0 cursor-pointer ${
                selectedOperation === op
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {op === "Todas" ? "Todas las operaciones" : op}
            </button>
          ))}

          <span className="text-slate-300 mx-1">|</span>

          {["Todas", "Casa", "Apartamento", "Chacra / Campo"].map((t) => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-3 py-1.5 rounded-full font-bold transition-colors shrink-0 cursor-pointer ${
                selectedType === t
                  ? "bg-slate-800 text-white shadow-sm"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {t === "Todas" ? "Todos los tipos" : t}
            </button>
          ))}

          {(selectedOperation !== "Todas" || selectedType !== "Todas" || selectedPriceMax !== "Todos") && (
            <button
              onClick={() => {
                setSelectedOperation("Todas");
                setSelectedType("Todas");
                setSelectedPriceMax("Todos");
              }}
              className="text-brand-600 hover:underline font-bold text-xs shrink-0 ml-2 cursor-pointer"
            >
              Restablecer filtros
            </button>
          )}
        </div>

        {/* Properties Grid */}
        {displayedProperties.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4">
            <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h4 className="font-display font-bold text-lg text-slate-800">
              No encontramos inmuebles con los filtros seleccionados
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Probá restableciendo los filtros de operación o tipo para ver todas nuestras opciones en Paysandú.
            </p>
            <button
              onClick={() => {
                setSelectedOperation("Todas");
                setSelectedType("Todas");
                setSelectedPriceMax("Todos");
              }}
              className="bg-brand-600 text-white text-xs font-bold py-2.5 px-5 rounded-lg hover:bg-brand-700 transition-colors cursor-pointer"
            >
              Ver Todas las Propiedades
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedProperties.map((p) => {
              const isRental = p.operation === "Alquiler";
              const formattedPrice = isRental 
                ? `$ ${p.price.toLocaleString()} UYU / mes` 
                : `US$ ${p.price.toLocaleString()}`;

              return (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Card Image Container with Badges and Diagonal Ribbons */}
                    <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.title}
                        className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                          p.status === "Sold" ? "grayscale-[20%]" : ""
                        }`}
                      />
                      
                      {/* Operation Badge */}
                      <span className={`absolute top-2.5 left-2.5 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase z-10 shadow-sm ${
                        isRental ? "bg-emerald-700" : "bg-slate-900/90"
                      }`}>
                        {p.operation || (isRental ? "Alquiler" : "Venta")}
                      </span>

                      {/* Property Type Badge */}
                      {p.status === "Active" && (
                        <span className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-sm text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm border border-slate-200">
                          {p.propertyType || p.brand}
                        </span>
                      )}

                      {/* Diagonal Ribbon for Sold / Rented */}
                      {p.status === "Sold" && (
                        <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden z-20 pointer-events-none">
                          <div className="absolute top-[20px] -right-[36px] w-[140px] transform rotate-45 bg-red-600 text-white font-black text-[10px] tracking-widest uppercase text-center py-1 shadow-md border-y border-white/30">
                            {isRental ? "ALQUILADO" : "VENDIDO"}
                          </div>
                        </div>
                      )}

                      {/* Diagonal Ribbon for Reserved */}
                      {p.status === "Reserved" && (
                        <div className="absolute top-0 right-0 w-28 h-28 overflow-hidden z-20 pointer-events-none">
                          <div className="absolute top-[20px] -right-[36px] w-[140px] transform rotate-45 bg-amber-500 text-slate-950 font-black text-[10px] tracking-widest uppercase text-center py-1 shadow-md border-y border-white/40">
                            RESERVADO
                          </div>
                        </div>
                      )}

                      {/* Code Pill */}
                      {p.code && (
                        <span className="absolute bottom-2.5 left-2.5 bg-slate-900/70 text-slate-200 text-[9px] font-mono px-2 py-0.5 rounded z-10">
                          {p.code}
                        </span>
                      )}
                    </div>

                    {/* Card Body */}
                    <div className="p-4 space-y-2.5">
                      <div>
                        <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                          <MapPin className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span className="truncate">{p.location || p.color}, Paysandú</span>
                        </div>
                        <h4 className="font-display font-bold text-sm text-slate-900 leading-snug line-clamp-2 mt-1 group-hover:text-brand-600 transition-colors">
                          {p.title || p.model}
                        </h4>
                      </div>

                      {/* Property Specs Chips */}
                      <div className="flex flex-wrap gap-2 text-[11px] text-slate-600 pt-1">
                        {p.bedrooms > 0 && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <Bed className="w-3 h-3 text-slate-500" />
                            {p.bedrooms} {p.bedrooms === 1 ? "Dorm." : "Dorms."}
                          </span>
                        )}
                        {p.bathrooms > 0 && (
                          <span className="bg-slate-100 px-2 py-0.5 rounded flex items-center gap-1">
                            <Bath className="w-3 h-3 text-slate-500" />
                            {p.bathrooms} {p.bathrooms === 1 ? "Baño" : "Baños"}
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
                        {p.status === "Sold" ? (
                          <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200">
                            {isRental ? "Alquilado" : "Vendido"}
                          </span>
                        ) : p.status === "Reserved" ? (
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

                  {/* Card Actions */}
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

        {/* View All Inventory Banner CTA */}
        <div className="text-center mt-12">
          <button
            onClick={() => setView("inventory")}
            className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm py-3 px-8 rounded-xl shadow-sm hover:shadow transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            Ver Todas las Propiedades en Catálogo
            <ArrowRight className="w-4 h-4 text-brand-600" />
          </button>
        </div>

      </section>

      {/* 4. INSTAGRAM STORIES CONNECT SECTION */}
      <section className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white py-12 px-6 md:px-12 border-t border-b border-emerald-900/40">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img 
              src="/marcel-lucuix-avatar.png" 
              alt="Inmobiliaria Marcel Lucuix Avatar" 
              className="w-16 h-16 rounded-full border-2 border-emerald-400 p-0.5 shadow-md shrink-0 bg-white" 
            />
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-lg md:text-xl text-white">
                  @inmobiliaria_marcellucuix
                </h3>
                <span className="bg-emerald-600/50 text-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-400/30">
                  Instagram Oficial
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl">
                Publicamos alquileres diarios, casas en venta y oportunidades destacadas en nuestras historias de Instagram. ¡Seguinos para no perderte ningún ingreso!
              </p>
            </div>
          </div>

          <a
            href="https://www.instagram.com/inmobiliaria_marcellucuix/?hl=es"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:opacity-95 text-white font-bold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg transition-transform hover:scale-105 flex items-center gap-2 shrink-0"
          >
            <Instagram className="w-4 h-4" />
            Abrir Perfil de Instagram
          </a>
        </div>
      </section>

      {/* 5. FINANCING SIMULATOR & URUGUAYAN MORTGAGES */}
      <section className="bg-slate-100/70 border-b border-slate-200 py-16 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-6 space-y-5">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block">
              Préstamos Hipotecarios & Garantías
            </span>
            <h3 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight">
              Asesoría completa para comprar o alquilar tu inmueble
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Te orientamos en la gestión de créditos hipotecarios bancarios en UI o dólares para la compra de tu casa o terreno en Paysandú. Si buscas alquilar, gestionamos tu fianza con ANDA, Porto Seguro, Contaduría o FIDECIU en tiempo récord.
            </p>

            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Bancos e Instituciones con las que operamos:
              </span>
              <div className="flex flex-wrap gap-2.5">
                {["BHU", "BROU", "Santander", "Itaú", "BBVA", "Scotiabank", "ANDA", "Porto Seguro", "FIDECIU"].map(b => (
                  <span key={b} className="bg-white border border-slate-200 text-slate-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-2xs">
                    {b}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Acompañamiento notarial integral hasta la firma de la escritura.</span>
            </div>
          </div>

          {/* Interactive Calculator Box */}
          <div className="lg:col-span-6 bg-white rounded-2xl p-6 md:p-8 border border-slate-200 shadow-md">
            <div className="flex items-center gap-2 font-display font-bold text-base text-slate-900 mb-6">
              <Calculator className="w-5 h-5 text-brand-600" />
              <span>Simulador Hipotecario Referencial</span>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span>Valor del Inmueble</span>
                  <span className="font-bold text-slate-900">US$ {simPrice.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min={30000}
                  max={400000}
                  step={5000}
                  value={simPrice}
                  onChange={(e) => setSimPrice(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span>Ahorro / Entrega Inicial ({simDownPaymentPercent}%)</span>
                  <span className="font-bold text-slate-900">US$ {downPaymentAmount.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 20, 30, 40].map(pct => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setSimDownPaymentPercent(pct)}
                      className={`text-xs py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                        simDownPaymentPercent === pct 
                          ? "bg-brand-600 text-white border-brand-600" 
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span>Plazo del Crédito</span>
                  <span className="font-bold text-slate-900">{simYears} años ({totalMonths} cuotas)</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 15, 20, 25].map(y => (
                    <button
                      key={y}
                      type="button"
                      onClick={() => setSimYears(y)}
                      className={`text-xs py-1.5 rounded-lg font-bold border transition-colors cursor-pointer ${
                        simYears === y 
                          ? "bg-brand-600 text-white border-brand-600" 
                          : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {y} años
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Result Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center">
                <span className="text-xs text-slate-500 uppercase font-bold tracking-wider">Cuota Mensual Estimada</span>
                <div className="font-display text-3xl font-black text-brand-600 my-1">
                  US$ {estimatedMonthly} <span className="text-xs text-slate-500 font-normal">/ mes</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Calculado sobre saldo prestado de US$ {loanAmount.toLocaleString()} a tasa referencial del 6.5% anual.
                </p>
              </div>

              <a
                href={`https://wa.me/59898689246?text=${encodeURIComponent(
                  `Hola Inmobiliaria Marcel Lucuix, hice una simulación de crédito hipotecario en su web:
- Inmueble de US$ ${simPrice.toLocaleString()}
- Entrega inicial: US$ ${downPaymentAmount.toLocaleString()} (${simDownPaymentPercent}%)
- Plazo: ${simYears} años (cuota estimada US$ ${estimatedMonthly})
¿Me podrían orientar sobre las opciones con bancos o financiación propia?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                Consultar Préstamo por WhatsApp
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* 6. SECCIÓN DE CONTACTO Y UBICACIÓN EN PAYSANDÚ */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 md:px-12">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest block">
              Atención Personalizada
            </span>
            <h3 className="font-display text-3xl font-extrabold text-white">
              Te esperamos en nuestra oficina en Paysandú
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Acercate a 33 Orientales 950 para coordinar visitas a propiedades, solicitar una tasación oficial o administrar tus alquileres con total respaldo.
            </p>

            <div className="space-y-4 pt-2 text-sm text-slate-300">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Dirección:</strong>
                  <span>33 Orientales 950, Ciudad de Paysandú, Uruguay</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Teléfonos:</strong>
                  <span>Fijo: 4722 7016 · Celular / WhatsApp: 098 689 246</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block font-semibold">Horario de Atención:</strong>
                  <span>Lun a Jue de 8:30 a 12:00 y 14:00 a 18:00 hs | Vie de 8:30 a 17:00 hs</span>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white rounded-2xl p-6 md:p-8 text-slate-800 shadow-xl">
            <h4 className="font-display font-bold text-lg text-slate-900 mb-1">
              Envianos tu consulta o solicitá tasación
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Completá el formulario y el equipo de Inmobiliaria Marcel Lucuix se comunicará a la brevedad.
            </p>

            {formSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h5 className="font-bold text-base text-slate-900">¡Mensaje Enviado con Éxito!</h5>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Gracias por comunicarte con Inmobiliaria Marcel Lucuix. Te responderemos a la brevedad.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="text-xs font-bold text-brand-600 hover:underline pt-2 cursor-pointer"
                >
                  Enviar otra consulta
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitInquiry} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Nombre y Apellido *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                      placeholder="Ej. Juan Pérez"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Teléfono / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                      placeholder="Ej. 099 123 456"
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                    placeholder="ejemplo@correo.com"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mensaje o Inmueble de Interés</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData(p => ({ ...p, message: e.target.value }))}
                    placeholder="Contanos qué tipo de propiedad estás buscando (alquiler o compra), o si deseás tasar o publicar un inmueble..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none font-sans"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  Enviar Consulta
                </button>
              </form>
            )}
          </div>

        </div>
      </section>

      {/* 7. MODAL DE DETALLE DE PROPIEDAD */}
      <AnimatePresence>
        {activeDetailVehicle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseVehicleDetail}
              className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col my-auto border border-slate-200"
            >
              {/* Modal Top Bar */}
              <div className="p-4 sm:p-5 border-b border-slate-200 flex justify-between items-center bg-slate-50 shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-600 text-white px-2 py-0.5 rounded">
                      {activeDetailVehicle.operation}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {activeDetailVehicle.propertyType || activeDetailVehicle.brand} · Código {activeDetailVehicle.code || activeDetailVehicle.stockId}
                    </span>
                  </div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 mt-1">
                    {activeDetailVehicle.title || activeDetailVehicle.model}
                  </h3>
                </div>

                <button
                  onClick={onCloseVehicleDetail}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition-colors cursor-pointer"
                  title="Cerrar (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Scrollable Content */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
                
                {/* Status Notice Banner if Sold/Rented or Reserved */}
                {activeDetailVehicle.status === "Sold" && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse shrink-0" />
                    <div>
                      <span className="font-extrabold uppercase tracking-wide block text-xs">
                        {activeDetailVehicle.operation === "Alquiler" ? "Propiedad Alquilada" : "Propiedad Vendida"}
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        Este inmueble ya fue comercializado. ¡Consultanos por propiedades similares disponibles en Paysandú!
                      </span>
                    </div>
                  </div>
                )}

                {activeDetailVehicle.status === "Reserved" && (
                  <div className="bg-amber-50 border border-amber-200 text-amber-900 px-4 py-3 rounded-xl font-bold text-xs flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="font-extrabold uppercase tracking-wide block text-xs text-amber-800">
                        Propiedad Reservada
                      </span>
                      <span className="text-xs font-medium text-slate-600">
                        Este inmueble se encuentra señado o con garantía en trámite.
                      </span>
                    </div>
                  </div>
                )}

                {/* Photo Gallery & Thumbnails */}
                <div>
                  <div className="relative aspect-[16/10] bg-slate-900 rounded-xl overflow-hidden shadow-inner">
                    <img
                      src={modalImages[activeModalImageIndex] || activeDetailVehicle.image}
                      alt={activeDetailVehicle.title}
                      className={`w-full h-full object-cover ${
                        activeDetailVehicle.status === "Sold" ? "grayscale-[20%]" : ""
                      }`}
                    />

                    {/* Diagonal Ribbon on Modal Main Image */}
                    {activeDetailVehicle.status === "Sold" && (
                      <div className="absolute top-0 right-0 w-36 h-36 overflow-hidden z-20 pointer-events-none">
                        <div className="absolute top-[28px] -right-[46px] w-[180px] transform rotate-45 bg-red-600 text-white font-black text-xs tracking-widest uppercase text-center py-1.5 shadow-2xl border-y-2 border-white">
                          {activeDetailVehicle.operation === "Alquiler" ? "ALQUILADO" : "VENDIDO"}
                        </div>
                      </div>
                    )}

                    {activeDetailVehicle.status === "Reserved" && (
                      <div className="absolute top-0 right-0 w-36 h-36 overflow-hidden z-20 pointer-events-none">
                        <div className="absolute top-[28px] -right-[46px] w-[180px] transform rotate-45 bg-amber-500 text-slate-950 font-black text-xs tracking-widest uppercase text-center py-1.5 shadow-2xl border-y-2 border-white">
                          RESERVADO
                        </div>
                      </div>
                    )}
                  </div>

                  {modalImages.length > 1 && (
                    <div className="flex gap-2 mt-3 overflow-x-auto pb-1 no-scrollbar">
                      {modalImages.map((img, idx) => (
                        <button
                          key={idx}
                          onClick={() => setActiveModalImageIndex(idx)}
                          className={`w-20 h-14 rounded-lg overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                            activeModalImageIndex === idx 
                              ? "border-brand-600 ring-2 ring-brand-600/30" 
                              : "border-slate-200 opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Price and Key Specs */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-slate-50 rounded-xl border border-slate-200 gap-4">
                  <div>
                    <span className="text-xs text-slate-500 uppercase font-bold block">
                      {activeDetailVehicle.operation === "Alquiler" ? "Alquiler Mensual" : "Precio de Venta"}
                    </span>
                    <span className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
                      {activeDetailVehicle.currency === "USD" 
                        ? `US$ ${activeDetailVehicle.price.toLocaleString()}` 
                        : `$ ${activeDetailVehicle.price.toLocaleString()} UYU`}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-700">
                    {activeDetailVehicle.bedrooms > 0 && (
                      <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5">
                        <Bed className="w-4 h-4 text-emerald-600" />
                        {activeDetailVehicle.bedrooms} Dormitorios
                      </span>
                    )}
                    {activeDetailVehicle.bathrooms > 0 && (
                      <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5">
                        <Bath className="w-4 h-4 text-emerald-600" />
                        {activeDetailVehicle.bathrooms} Baños
                      </span>
                    )}
                    {activeDetailVehicle.totalArea > 0 && (
                      <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5">
                        <Maximize2 className="w-4 h-4 text-emerald-600" />
                        {activeDetailVehicle.totalArea.toLocaleString()} m²
                      </span>
                    )}
                    {activeDetailVehicle.garages > 0 && (
                      <span className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5">
                        <GarageIcon className="w-4 h-4 text-emerald-600" />
                        {activeDetailVehicle.garages} Cochera
                      </span>
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-2">
                    Descripción del Inmueble
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {activeDetailVehicle.description}
                  </p>
                </div>

                {/* Features & Amenities */}
                {activeDetailVehicle.features && activeDetailVehicle.features.length > 0 && (
                  <div>
                    <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">
                      Comodidades y Detalles
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700">
                      {activeDetailVehicle.features.map((feat, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Location Bar */}
                <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200/60 flex items-center justify-between text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>
                      <strong>Ubicación:</strong> {activeDetailVehicle.address || activeDetailVehicle.location}, Paysandú
                    </span>
                  </div>
                  <a
                    href="https://maps.app.goo.gl/j5SEQCVxR8b5eEVLA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 font-bold hover:underline shrink-0"
                  >
                    Ver en Google Maps
                  </a>
                </div>

                {/* Direct Action Buttons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => handleQuickWhatsApp(activeDetailVehicle)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-colors"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                    Consultar por WhatsApp (098 689 246)
                  </button>

                  <a
                    href="tel:+59847227016"
                    className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Phone className="w-4 h-4 text-emerald-400" />
                    Llamar al 472 27016
                  </a>
                </div>

                {/* Integrated Contact Form */}
                <div className="pt-4 border-t border-slate-200">
                  <h4 className="font-display font-bold text-sm text-slate-900 uppercase tracking-wider mb-3">
                    Enviar Consulta a Inmobiliaria Marcel Lucuix
                  </h4>

                  {formSubmitted ? (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center space-y-1">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto" />
                      <p className="font-bold text-sm">¡Consulta enviada con éxito!</p>
                      <p className="text-xs text-slate-600">Nos comunicaremos contigo a la brevedad.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmitInquiry} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <input
                          type="text"
                          required
                          placeholder="Nombre y Apellido"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                        <input
                          type="tel"
                          placeholder="Teléfono / WhatsApp"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="Correo Electrónico"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <textarea
                        rows={2}
                        placeholder="Escribe tu mensaje o consulta..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      />
                      <button
                        type="submit"
                        className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Enviar Mensaje
                      </button>
                    </form>
                  )}
                </div>

              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
