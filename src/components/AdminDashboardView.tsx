import { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, 
  Trash2, 
  MessageSquare, 
  DollarSign, 
  Home,
  ExternalLink,
  Building,
  MapPin,
  Clock
} from 'lucide-react';
import { Property, Inquiry, ServiceAppointment } from '../types';

interface AdminDashboardViewProps {
  vehicles: Property[];
  inquiries: Inquiry[];
  serviceAppointments: ServiceAppointment[];
  onDeleteVehicle: (id: string) => void;
  onChangeVehicleStatus: (id: string, status: Property['status']) => void;
  onSelectVehicle: (property: Property) => void;
  setView: (view: 'showroom' | 'inventory' | 'admin' | 'add-vehicle' | 'login') => void;
}

export default function AdminDashboardView({
  vehicles,
  inquiries,
  serviceAppointments,
  onDeleteVehicle,
  onChangeVehicleStatus,
  onSelectVehicle,
  setView
}: AdminDashboardViewProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | Property['status']>('All');

  // Math metrics for KPI Cards
  const metrics = useMemo(() => {
    const activeListingsCount = vehicles.filter(v => v.status === 'Active').length;
    const totalPortfolioValue = vehicles.reduce((sum, v) => sum + (v.status !== 'Sold' && v.currency === 'USD' ? v.price : 0), 0);
    const avgDaysOnLot = vehicles.length 
      ? Math.round(vehicles.reduce((sum, v) => sum + (v.daysOnLot || 1), 0) / vehicles.length) 
      : 0;

    return {
      activeCount: activeListingsCount,
      totalCount: vehicles.length,
      value: totalPortfolioValue,
      avgDays: avgDaysOnLot,
      pendingInquiries: inquiries.filter(i => i.status === 'New').length
    };
  }, [vehicles, inquiries]);

  // Filter listings based on status button selector
  const filteredVehicles = useMemo(() => {
    if (statusFilter === 'All') return vehicles;
    return vehicles.filter(v => v.status === statusFilter);
  }, [vehicles, statusFilter]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full bg-slate-50 min-h-screen py-10 px-4 sm:px-6 md:px-12 space-y-8 max-w-7xl mx-auto"
    >
      {/* Top Welcome & Quick Action row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-200 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              33 Orientales 950 · Paysandú
            </span>
          </div>
          <h1 className="font-display text-2xl md:text-3xl font-extrabold text-slate-900">
            Panel de Gestión · Inmobiliaria Marcel Lucuix
          </h1>
          <p className="text-xs md:text-sm text-slate-500 mt-1">
            Administración de propiedades, estados de publicación y consultas recibidas.
          </p>
        </div>

        <button
          onClick={() => setView('add-vehicle')}
          className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow transition-all cursor-pointer flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Publicar Nueva Propiedad
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Active Listings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Propiedades Activas</span>
            <span className="font-display text-2xl font-extrabold text-slate-900">
              {metrics.activeCount} <span className="text-xs text-slate-400 font-normal">/ {metrics.totalCount} total</span>
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block">Visibles en la web</span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-brand-600 border border-emerald-100">
            <Home className="w-5 h-5" />
          </div>
        </div>

        {/* Portfolio Value */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Valor Cartera (Venta)</span>
            <span className="font-display text-2xl font-extrabold text-slate-900">
              US$ {metrics.value.toLocaleString()}
            </span>
            <span className="text-[11px] text-slate-500 block">
              Inmuebles en venta en Paysandú
            </span>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Pending Inquiries */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Consultas Web</span>
            <span className="font-display text-2xl font-extrabold text-slate-900">
              {metrics.pendingInquiries} <span className="text-xs text-slate-400 font-normal">Nuevas</span>
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block">Respuestas al día</span>
          </div>
          <div className="p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <MessageSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Avg Days */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Permanencia</span>
            <span className="font-display text-2xl font-extrabold text-slate-900">
              {metrics.avgDays} <span className="text-xs text-slate-400 font-normal">días prom.</span>
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold block">Cartera ágil</span>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
            <Clock className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Properties Management Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-display font-bold text-base text-slate-900">
              Cartera de Inmuebles
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Administrá los estados, visualizá la ficha o eliminá publicaciones.
            </p>
          </div>

          {/* Status Filters */}
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'All', label: 'Todos' },
              { id: 'Active', label: 'Disponible' },
              { id: 'Reserved', label: 'Reservado' },
              { id: 'Sold', label: 'Alquilado / Vendido' },
              { id: 'Hidden', label: 'Oculto (Borrador)' }
            ].map(st => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border ${
                  statusFilter === st.id 
                    ? 'bg-brand-600 text-white border-brand-600' 
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-bold border-b border-slate-200">
              <tr>
                <th className="py-3.5 px-4">Propiedad</th>
                <th className="py-3.5 px-4">Operación / Ubicación</th>
                <th className="py-3.5 px-4">Precio</th>
                <th className="py-3.5 px-4">Estado</th>
                <th className="py-3.5 px-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredVehicles.map(v => {
                const isRental = v.operation === 'Alquiler';
                const formattedPrice = isRental 
                  ? `$ ${v.price.toLocaleString()} UYU / mes` 
                  : `US$ ${v.price.toLocaleString()}`;

                return (
                  <tr key={v.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={v.image} 
                          alt="" 
                          className="w-12 h-9 rounded-lg object-cover border border-slate-200" 
                        />
                        <div>
                          <strong className="text-slate-900 font-bold block text-sm">{v.title || v.model}</strong>
                          <span className="text-slate-400 text-[11px]">{v.propertyType || v.brand} · Código {v.code || v.stockId}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      <span className="font-semibold block">{v.operation || 'Venta'}</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {v.location || v.color}, Paysandú
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-display font-extrabold text-sm text-slate-900">
                        {formattedPrice}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={v.status}
                        onChange={(e) => onChangeVehicleStatus(v.id, e.target.value as any)}
                        className={`text-xs font-bold py-1 px-2.5 rounded-lg border cursor-pointer focus:outline-none ${
                          v.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                          v.status === 'Reserved' ? 'bg-amber-50 text-amber-700 border-amber-300' :
                          v.status === 'Sold' ? 'bg-red-50 text-red-700 border-red-300' :
                          'bg-slate-100 text-slate-600 border-slate-300'
                        }`}
                      >
                        <option value="Active">🟢 Disponible (Público)</option>
                        <option value="Reserved">🟡 Reservado</option>
                        <option value="Sold">🔴 Alquilado / Vendido</option>
                        <option value="Hidden">👁️ Oculto / Borrador</option>
                      </select>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            onSelectVehicle(v);
                            setView('showroom');
                          }}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          title="Ver en la web"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`¿Eliminar ${v.title || v.model}?`)) {
                              onDeleteVehicle(v.id);
                            }
                          }}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Eliminar propiedad"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiries Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="font-display font-bold text-base text-slate-900">
          Últimas Consultas de Clientes
        </h3>

        <div className="divide-y divide-slate-100">
          {inquiries.map(inq => (
            <div key={inq.id} className="py-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <strong className="text-slate-900 font-bold text-xs">{inq.fullName}</strong>
                  <span className="text-[11px] text-slate-400">({inq.email})</span>
                  {inq.phone && <span className="text-[11px] text-emerald-600 font-medium">{inq.phone}</span>}
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded">
                    {inq.vehicleName}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-snug">{inq.message}</p>
              </div>
              <span className="text-[11px] text-slate-400 shrink-0">{inq.date}</span>
            </div>
          ))}
        </div>
      </div>

    </motion.div>
  );
}
