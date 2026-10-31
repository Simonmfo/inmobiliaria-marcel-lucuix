export interface Property {
  id: string;
  title: string;
  operation: 'Venta' | 'Alquiler';
  propertyType: 'Casa' | 'Apartamento' | 'Terreno' | 'Local Comercial' | 'Chacra / Campo' | 'Oficina';
  location: string;
  city: string;
  address?: string;
  price: number;
  currency: 'USD' | 'UYU';
  bedrooms: number;
  bathrooms: number;
  totalArea: number; // m²
  coveredArea?: number; // m²
  garages: number;
  status: 'Active' | 'Reserved' | 'Sold' | 'Hidden';
  featured?: boolean;
  code: string;
  description: string;
  features: string[];
  image: string;
  gallery: string[];

  // Compatibility fields for legacy code references
  brand: string;
  model: string;
  year: number;
  category: string;
  engine?: string;
  power?: string;
  acceleration?: string;
  drive?: string;
  transmission: 'Automatic' | 'Manual' | string;
  transmissionDetail: string;
  fuelType: 'Petrol' | 'Electric' | 'Hybrid' | 'Diesel' | string;
  mileage: number;
  color: string;
  daysOnLot: number;
  stockId: string;
  vin: string;
}

export type Vehicle = Property;

export interface Inquiry {
  id: string;
  vehicleId: string;
  vehicleName: string;
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  date: string;
  status: 'New' | 'Replied' | 'Archived';
  inquiryType?: 'Compra' | 'Alquiler' | 'Tasación' | 'Consulta';
}

export interface ServiceAppointment {
  id: string;
  vehicleName: string;
  type: string;
  dateTime: string;
  icon: string;
}
