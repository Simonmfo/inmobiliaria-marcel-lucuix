import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  Home, 
  Instagram, 
  Sparkles, 
  Loader2, 
  AlertCircle,
  Image as ImageIcon
} from 'lucide-react';
import { Property } from '../types';

interface AddVehicleViewProps {
  onAddVehicle: (property: Property) => void;
  setView: (view: 'showroom' | 'inventory' | 'admin' | 'add-vehicle' | 'login') => void;
}

export default function AddVehicleView({ onAddVehicle, setView }: AddVehicleViewProps) {
  const [formData, setFormData] = useState({
    title: '',
    operation: 'Alquiler' as 'Venta' | 'Alquiler',
    propertyType: 'Apartamento' as Property['propertyType'],
    location: 'Centro',
    address: '',
    price: '',
    currency: 'UYU' as 'USD' | 'UYU',
    bedrooms: '2',
    bathrooms: '1',
    totalArea: '75',
    coveredArea: '70',
    garages: '1',
    code: `ML-${Math.floor(1000 + Math.random() * 9000)}`,
    description: '',
    image: '',
    galleryInput: '',
    featuresInput: 'Living comedor luminoso\nCocina con placares\nAcepta garantías ANDA / Porto / CGN / FIDECIU'
  });

  // Instagram Import States
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isFetchingInstagram, setIsFetchingInstagram] = useState(false);
  const [instagramSuccess, setInstagramSuccess] = useState<string | null>(null);
  const [instagramError, setInstagramError] = useState<string | null>(null);
  const [loadedCarouselImages, setLoadedCarouselImages] = useState<string[]>([]);

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleRemoveImage = (indexToRemove: number) => {
    const updated = loadedCarouselImages.filter((_, i) => i !== indexToRemove);
    setLoadedCarouselImages(updated);
    setFormData(prev => ({
      ...prev,
      image: updated[0] || '',
      galleryInput: updated.join('\n')
    }));
  };

  const handleSetCoverImage = (indexToCover: number) => {
    const selected = loadedCarouselImages[indexToCover];
    const rest = loadedCarouselImages.filter((_, i) => i !== indexToCover);
    const updated = [selected, ...rest];
    setLoadedCarouselImages(updated);
    setFormData(prev => ({
      ...prev,
      image: updated[0] || '',
      galleryInput: updated.join('\n')
    }));
  };

  // Handle Instagram Carousel Extraction
  const handleImportInstagram = async () => {
    if (!instagramUrl.trim()) {
      setInstagramError('Por favor ingresá un enlace de publicación de Instagram válido.');
      return;
    }

    setIsFetchingInstagram(true);
    setInstagramError(null);
    setInstagramSuccess(null);

    try {
      const response = await fetch(`/api/instagram?url=${encodeURIComponent(instagramUrl.trim())}`);
      
      let data: any;
      const textResponse = await response.text();
      try {
        data = JSON.parse(textResponse);
      } catch (jsonErr) {
        throw new Error(`El servidor devolvió una respuesta no válida (${response.status}): ${textResponse.slice(0, 150)}`);
      }

      if (!response.ok || !data.success || !data.images || data.images.length === 0) {
        throw new Error(data.error || 'No se pudieron extraer fotos de este enlace de Instagram.');
      }

      const images: string[] = data.images;
      setLoadedCarouselImages(images);

      // Auto-populate form fields from extracted caption and images
      setFormData(prev => {
        const next = { ...prev };
        next.image = images[0] || prev.image;
        next.galleryInput = images.join('\n');

        if (data.parsed) {
          if (data.parsed.title && !prev.title) {
            next.title = data.parsed.title;
          }
          if (data.parsed.operation) {
            next.operation = data.parsed.operation;
          }
          if (data.parsed.propertyType) {
            next.propertyType = data.parsed.propertyType;
          }
          if (data.parsed.currency) {
            next.currency = data.parsed.currency;
          } else if (data.parsed.operation) {
            next.currency = data.parsed.operation === 'Alquiler' ? 'UYU' : 'USD';
          }
          if (data.parsed.price && !prev.price) {
            next.price = String(data.parsed.price);
          }
          if (data.parsed.bedrooms !== undefined) {
            next.bedrooms = String(data.parsed.bedrooms);
          }
          if (data.parsed.bathrooms !== undefined) {
            next.bathrooms = String(data.parsed.bathrooms);
          }
          if (data.parsed.totalArea !== undefined) {
            next.totalArea = String(data.parsed.totalArea);
            next.coveredArea = String(data.parsed.totalArea);
          }
          if (data.parsed.garages !== undefined) {
            next.garages = String(data.parsed.garages);
          }
          if (data.parsed.location) {
            next.location = data.parsed.location;
            next.address = `${data.parsed.location}, Paysandú`;
          }
          if (data.parsed.features && data.parsed.features.length > 0) {
            next.featuresInput = data.parsed.features.join('\n');
          }
        }

        if (data.caption && !prev.description) {
          next.description = data.caption;
        }

        return next;
      });

      setInstagramSuccess(`¡Éxito! Se cargaron ${images.length} fotos del carrusel y se detectaron los datos del inmueble.`);
    } catch (err: any) {
      console.error('Error importing Instagram carousel:', err);
      setInstagramError(err.message || 'Error al conectar con Instagram. Verificá que la publicación sea pública.');
    } finally {
      setIsFetchingInstagram(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      alert('Por favor completá los campos obligatorios: Título y Precio.');
      return;
    }

    const numPrice = Number(formData.price) || 0;
    const numBedrooms = Number(formData.bedrooms) || 0;
    const numBathrooms = Number(formData.bathrooms) || 0;
    const numTotalArea = Number(formData.totalArea) || 0;
    const numCoveredArea = Number(formData.coveredArea) || numTotalArea;
    const numGarages = Number(formData.garages) || 0;

    const galleryUrls = formData.galleryInput
      .split('\n')
      .map(u => u.trim())
      .filter(Boolean);

    const featuresList = formData.featuresInput
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const mainImg = formData.image.trim() || (galleryUrls.length > 0 ? galleryUrls[0] : '/properties/stock-residencia-jardin.jpg');

    const newProperty: Property = {
      id: `${formData.propertyType.toLowerCase()}-${formData.location.toLowerCase()}-${Date.now()}`.replace(/[^a-z0-9]+/g, '-'),
      title: formData.title,
      operation: formData.operation,
      propertyType: formData.propertyType,
      location: formData.location,
      city: 'Paysandú',
      address: formData.address || `${formData.location}, Paysandú`,
      price: numPrice,
      currency: formData.currency,
      bedrooms: numBedrooms,
      bathrooms: numBathrooms,
      totalArea: numTotalArea,
      coveredArea: numCoveredArea,
      garages: numGarages,
      status: 'Active',
      featured: true,
      code: formData.code,
      description: formData.description || `${formData.title} en ${formData.location}, Paysandú. Gestiona Inmobiliaria Marcel Lucuix (33 Orientales 950).`,
      features: featuresList,
      image: mainImg,
      gallery: galleryUrls.length > 0 ? galleryUrls : [mainImg],

      // Legacy compatibility
      brand: formData.propertyType,
      model: formData.title,
      year: 2025,
      category: `${formData.operation} · ${formData.propertyType}`,
      engine: `${numBedrooms} Dorms. · ${numBathrooms} Baños`,
      power: `${numTotalArea} m²`,
      acceleration: `${formData.location}, Paysandú`,
      drive: formData.location,
      transmission: formData.operation,
      transmissionDetail: `${formData.operation} · ${formData.code}`,
      fuelType: formData.currency,
      mileage: numTotalArea,
      color: formData.location,
      daysOnLot: 0,
      stockId: formData.code,
      vin: `ML-${formData.code}`
    };

    onAddVehicle(newProperty);
    setFormSubmitted(true);
    setTimeout(() => {
      setView('inventory');
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 md:px-12"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Top Back bar & Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-5">
          <div>
            <button
              onClick={() => setView('admin')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition-colors mb-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al Panel de Administración
            </button>
            <h1 className="font-display text-2xl sm:text-3xl font-black text-slate-900">
              Publicar Nuevo Inmueble
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Completá los datos o pegá el link de una publicación de Instagram (@inmobiliaria_marcellucuix) para cargar todas las fotos del carrusel automáticamente.
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-brand-600 flex items-center justify-center border border-emerald-200">
            <Home className="w-5 h-5" />
          </div>
        </div>

        {formSubmitted ? (
          <div className="bg-white rounded-2xl border border-emerald-200 p-12 text-center shadow-sm space-y-4">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-200">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-display font-extrabold text-2xl text-slate-900">
              ¡Inmueble Guardado y Publicado!
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              La propiedad fue guardada correctamente en el sistema y ya se encuentra visible en el catálogo web y en el panel de gestión.
            </p>
            <span className="text-xs font-semibold text-slate-400 block">
              Redirigiendo al catálogo...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
            
            {/* 1. INSTAGRAM CAROUSEL IMPORTER BOX */}
            <div className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-amber-50/60 rounded-2xl p-5 border border-emerald-200 shadow-2xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-2xs">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      Cargar desde Publicación de Instagram
                      <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    </h3>
                    <p className="text-[11px] text-slate-600">
                      Pegá el link del post o carrusel de @inmobiliaria_marcellucuix para importar todas las fotos y datos automáticamente.
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/90 text-emerald-700 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Carrusel Automático
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
                <input
                  type="url"
                  placeholder="Ej: https://www.instagram.com/p/... o https://instagram.com/inmobiliaria_marcellucuix/p/..."
                  value={instagramUrl}
                  onChange={(e) => setInstagramUrl(e.target.value)}
                  disabled={isFetchingInstagram}
                  className="flex-1 bg-white border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500 shadow-2xs"
                />
                <button
                  type="button"
                  onClick={handleImportInstagram}
                  disabled={isFetchingInstagram || !instagramUrl.trim()}
                  className="bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                >
                  {isFetchingInstagram ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cargando Carrusel...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Cargar Fotos del Carrusel
                    </>
                  )}
                </button>
              </div>

              {/* Success Notification */}
              {instagramSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{instagramSuccess}</span>
                </div>
              )}

              {/* Error Notification */}
              {instagramError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-3.5 py-2 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{instagramError}</span>
                </div>
              )}

              {/* Thumbnail preview of loaded carousel slides with Cover & Remove controls */}
              {loadedCarouselImages.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-brand-600" />
                      Fotos del carrusel cargadas ({loadedCarouselImages.length}):
                    </span>
                    <span className="text-[10px] text-slate-500">
                      La primera foto será la portada (podés cambiarla o quitar flyers)
                    </span>
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {loadedCarouselImages.map((img, idx) => (
                      <div 
                        key={idx} 
                        className={`group relative aspect-[4/3] rounded-lg overflow-hidden border-2 bg-slate-100 ${
                          idx === 0 ? 'border-brand-600 ring-2 ring-emerald-200' : 'border-slate-200'
                        }`}
                      >
                        <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                        <span className={`absolute bottom-1 left-1 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow ${
                          idx === 0 ? 'bg-brand-600' : 'bg-slate-900/85'
                        }`}>
                          {idx === 0 ? 'Portada' : `#${idx + 1}`}
                        </span>
                        <div className="absolute top-1 right-1 flex items-center gap-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              title="Hacer foto de portada"
                              onClick={() => handleSetCoverImage(idx)}
                              className="bg-slate-900/80 hover:bg-brand-600 text-white rounded px-1 text-[9px] font-semibold transition-colors cursor-pointer"
                            >
                              Portada
                            </button>
                          )}
                          <button
                            type="button"
                            title="Quitar foto"
                            onClick={() => handleRemoveImage(idx)}
                            className="bg-rose-600 hover:bg-rose-700 text-white rounded w-4 h-4 flex items-center justify-center text-xs font-bold transition-colors cursor-pointer shadow"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 2. Property Details Form */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Título del Inmueble *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Apartamento Luminoso con Balcón en Centro"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Código de Referencia
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Operación *
                </label>
                <select
                  value={formData.operation}
                  onChange={(e) => {
                    const op = e.target.value as any;
                    setFormData({
                      ...formData,
                      operation: op,
                      currency: op === 'Alquiler' ? 'UYU' : 'USD'
                    });
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Alquiler">Alquiler</option>
                  <option value="Venta">Venta</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Tipo de Inmueble *
                </label>
                <select
                  value={formData.propertyType}
                  onChange={(e) => setFormData({ ...formData, propertyType: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Chacra / Campo">Chacra / Campo</option>
                  <option value="Local Comercial">Local Comercial</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Oficina">Oficina</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Zona / Ubicación *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Centro, Barrio Jardín, etc."
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Moneda
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value as any })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="UYU">$ Pesos Uruguayos (UYU)</option>
                  <option value="USD">US$ Dólares Americanos (USD)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Precio *
                </label>
                <input
                  type="number"
                  required
                  placeholder={formData.currency === 'UYU' ? 'Ej: 22000' : 'Ej: 145000'}
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            {/* Specs: Dorms, Baños, Metros, Garaje */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Dormitorios
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Baños
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Superficie (m²)
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.totalArea}
                  onChange={(e) => setFormData({ ...formData, totalArea: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Cocheras / Garaje
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.garages}
                  onChange={(e) => setFormData({ ...formData, garages: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Dirección o Referencia
              </label>
              <input
                type="text"
                placeholder="Ej: 33 Orientales entre 18 de Julio y Leandro Gómez"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Media & Gallery URLs */}
            <div className="space-y-4 pt-3 border-t border-slate-100">
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Foto Principal (Portada)
                </label>
                <input
                  type="text"
                  placeholder="/properties/stock-residencia-jardin.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Se llena automáticamente al cargar un link de Instagram o podés elegir cualquiera del carrusel como portada.
                </p>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                  Galería de Fotos (Una URL por línea)
                </label>
                <textarea
                  rows={4}
                  placeholder="/properties/stock-penthouse-centro.jpg&#10;/properties/stock-chacra-ruta3.jpg"
                  value={formData.galleryInput}
                  onChange={(e) => setFormData({ ...formData, galleryInput: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Comodidades y Destacados (Uno por línea)
              </label>
              <textarea
                rows={4}
                value={formData.featuresInput}
                onChange={(e) => setFormData({ ...formData, featuresInput: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
                Descripción Completa
              </label>
              <textarea
                rows={4}
                placeholder="Detallá las características del inmueble, estado, iluminación, garantías aceptadas, etc."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>

            <div className="pt-4 flex gap-4">
              <button
                type="button"
                onClick={() => setView('admin')}
                className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer"
              >
                Guardar y Publicar en la Web
              </button>
            </div>

          </form>
        )}

      </div>
    </motion.div>
  );
}
