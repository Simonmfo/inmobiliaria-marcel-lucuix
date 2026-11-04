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
  Building,
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
    featuresInput: 'Living comedor luminoso, Cocina con placares, Acepta garantías ANDA / Porto / CGN / FIDECIU'
  });

  // Instagram Import States
  const [instagramUrl, setInstagramUrl] = useState('');
  const [isFetchingInstagram, setIsFetchingInstagram] = useState(false);
  const [instagramSuccess, setInstagramSuccess] = useState<string | null>(null);
  const [instagramError, setInstagramError] = useState<string | null>(null);
  const [loadedCarouselImages, setLoadedCarouselImages] = useState<string[]>([]);

  const [formSubmitted, setFormSubmitted] = useState(false);

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
      const data = await response.json();

      if (!response.ok || !data.success || !data.images || data.images.length === 0) {
        throw new Error(data.error || 'No se pudieron extraer fotos de este enlace de Instagram.');
      }

      const images: string[] = data.images;
      setLoadedCarouselImages(images);

      // Auto-populate form fields
      setFormData(prev => ({
        ...prev,
        image: images[0] || prev.image,
        galleryInput: images.slice(1).join('\n'),
        description: data.caption || prev.description,
        price: data.parsed?.price ? String(data.parsed.price) : prev.price
      }));

      setInstagramSuccess(`¡Éxito! Se importaron ${images.length} fotos de la publicación de Instagram.`);
    } catch (err: any) {
      setInstagramError(err.message || 'Error al conectar con Instagram.');
    } finally {
      setIsFetchingInstagram(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price) return;

    const numPrice = Number(formData.price) || 0;
    const numBedrooms = Number(formData.bedrooms) || 0;
    const numBathrooms = Number(formData.bathrooms) || 0;
    const numTotalArea = Number(formData.totalArea) || 0;
    const numCoveredArea = Number(formData.coveredArea) || 0;
    const numGarages = Number(formData.garages) || 0;

    const galleryUrls = formData.galleryInput
      .split('\n')
      .map(u => u.trim())
      .filter(Boolean);

    const featuresList = formData.featuresInput
      .split('\n')
      .map(f => f.trim())
      .filter(Boolean);

    const mainImg = formData.image || (galleryUrls.length > 0 ? galleryUrls[0] : '/properties/stock-residencia-jardin.jpg');

    const newProperty: Property = {
      id: `prop-${Date.now()}`,
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
      description: formData.description,
      features: featuresList,
      image: mainImg,
      gallery: galleryUrls.length > 0 ? galleryUrls : [mainImg],

      // Legacy compatibility
      brand: formData.propertyType,
      model: formData.title,
      year: 2024,
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
      daysOnLot: 1,
      stockId: formData.code,
      vin: `ML-${formData.code}`
    };

    onAddVehicle(newProperty);
    setFormSubmitted(true);
    setTimeout(() => {
      setView('admin');
    }, 1200);
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Back bar */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <button
            onClick={() => setView('admin')}
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-brand-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Panel
          </button>
          <span className="text-xs text-slate-400 font-semibold">
            Inmobiliaria Marcel Lucuix · Paysandú
          </span>
        </div>

        {/* Header Title */}
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-extrabold text-slate-900">
            Publicar Inmueble en Catálogo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Completá los datos del inmueble para publicarlo en la web o importá fotos directamente desde Instagram (@inmobiliaria_marcellucuix).
          </p>
        </div>

        {/* 1. Instagram Importer Card */}
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 text-white rounded-2xl p-6 shadow-md border border-emerald-800/60 space-y-4">
          <div className="flex items-center gap-2.5">
            <Instagram className="w-5 h-5 text-pink-400" />
            <h3 className="font-display font-bold text-base text-white">
              Importar Publicación desde Instagram
            </h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Pegá el enlace de una publicación de <strong className="text-emerald-300">@inmobiliaria_marcellucuix</strong> para extraer automáticamente las fotografías y el texto.
          </p>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              placeholder="https://www.instagram.com/p/..."
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              className="flex-1 bg-slate-950/80 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="button"
              onClick={handleImportInstagram}
              disabled={isFetchingInstagram}
              className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer shrink-0"
            >
              {isFetchingInstagram ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Extrayendo...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" /> Importar Fotos
                </>
              )}
            </button>
          </div>

          {instagramSuccess && (
            <div className="bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs p-3 rounded-lg flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{instagramSuccess}</span>
            </div>
          )}

          {instagramError && (
            <div className="bg-red-900/60 border border-red-500/40 text-red-200 text-xs p-3 rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{instagramError}</span>
            </div>
          )}

          {loadedCarouselImages.length > 0 && (
            <div className="flex gap-2 pt-2 overflow-x-auto pb-1 no-scrollbar">
              {loadedCarouselImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="Importada"
                  className="w-16 h-16 rounded-lg object-cover border border-slate-700 shrink-0"
                />
              ))}
            </div>
          )}
        </div>

        {/* 2. Main Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          
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

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Foto Principal (URL o archivo en /properties/)
            </label>
            <input
              type="text"
              placeholder="/properties/stock-residencia-jardin.jpg"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Fotos Adicionales / Galería (Una URL por línea)
            </label>
            <textarea
              rows={3}
              placeholder="/properties/stock-penthouse-centro.jpg&#10;/properties/stock-chacra-ruta3.jpg"
              value={formData.galleryInput}
              onChange={(e) => setFormData({ ...formData, galleryInput: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 font-mono focus:outline-none focus:ring-2 focus:ring-brand-500"
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
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1.5">
              Comodidades y Destacados (Uno por línea)
            </label>
            <textarea
              rows={3}
              value={formData.featuresInput}
              onChange={(e) => setFormData({ ...formData, featuresInput: e.target.value })}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          {formSubmitted && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="font-bold text-sm">¡Propiedad publicada con éxito! Redirigiendo...</span>
            </div>
          )}

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setView('admin')}
              className="px-6 py-3 border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={formSubmitted}
              className="bg-brand-600 hover:bg-brand-700 text-white px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer disabled:opacity-50"
            >
              Publicar Inmueble
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
