-- ================================================================
-- INMOBILIARIA MARCEL LUCUIX (PAYSANDÚ) - ESQUEMA SUPABASE
-- URL: https://kzjcfmjrarebsvefyvxw.supabase.co
-- ================================================================

-- 1. TABLA DE PROPIEDADES (vehicles por compatibilidad con el motor actual)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id TEXT PRIMARY KEY,
    title TEXT,
    operation TEXT DEFAULT 'Venta',
    "propertyType" TEXT DEFAULT 'Casa',
    location TEXT,
    city TEXT DEFAULT 'Paysandú',
    address TEXT,
    price NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    bedrooms INTEGER DEFAULT 0,
    bathrooms INTEGER DEFAULT 0,
    "totalArea" NUMERIC DEFAULT 0,
    "coveredArea" NUMERIC DEFAULT 0,
    garages INTEGER DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'Active',
    featured BOOLEAN DEFAULT false,
    code TEXT,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    image TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    -- Campos de compatibilidad
    brand TEXT NOT NULL DEFAULT 'Propiedad',
    model TEXT NOT NULL DEFAULT '',
    year INTEGER NOT NULL DEFAULT 2025,
    category TEXT NOT NULL DEFAULT 'Venta · Propiedad',
    engine TEXT,
    power TEXT,
    acceleration TEXT,
    drive TEXT,
    transmission TEXT NOT NULL DEFAULT 'Venta',
    "transmissionDetail" TEXT,
    "fuelType" TEXT NOT NULL DEFAULT 'USD',
    mileage INTEGER NOT NULL DEFAULT 0,
    color TEXT,
    "daysOnLot" INTEGER DEFAULT 1,
    "stockId" TEXT,
    vin TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Asegurar columnas inmobiliarias si la tabla ya existía previamente
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS title TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS operation TEXT DEFAULT 'Venta';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS "propertyType" TEXT DEFAULT 'Casa';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS location TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Paysandú';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS address TEXT;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'USD';
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS bedrooms INTEGER DEFAULT 0;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS bathrooms INTEGER DEFAULT 0;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS "totalArea" NUMERIC DEFAULT 0;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS "coveredArea" NUMERIC DEFAULT 0;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS garages INTEGER DEFAULT 0;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;
ALTER TABLE public.vehicles ADD COLUMN IF NOT EXISTS code TEXT;

-- 2. TABLA DE CONSULTAS / CONTACTOS
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "vehicleId" TEXT,
    "vehicleName" TEXT,
    "fullName" TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    message TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    "inquiryType" TEXT DEFAULT 'Consulta',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.inquiries ADD COLUMN IF NOT EXISTS "inquiryType" TEXT DEFAULT 'Consulta';

-- 3. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública a propiedades
DROP POLICY IF EXISTS "Allow public read access to vehicles" ON public.vehicles;
CREATE POLICY "Allow public read access to vehicles"
ON public.vehicles FOR SELECT
USING (true);

-- Permitir agregar/modificar/eliminar propiedades desde el panel
DROP POLICY IF EXISTS "Allow all write access to vehicles" ON public.vehicles;
CREATE POLICY "Allow all write access to vehicles"
ON public.vehicles FOR ALL
USING (true)
WITH CHECK (true);

-- Permitir a los visitantes enviar consultas
DROP POLICY IF EXISTS "Allow public insert to inquiries" ON public.inquiries;
CREATE POLICY "Allow public insert to inquiries"
ON public.inquiries FOR INSERT
WITH CHECK (true);

-- Permitir ver consultas
DROP POLICY IF EXISTS "Allow public read access to inquiries" ON public.inquiries;
CREATE POLICY "Allow public read access to inquiries"
ON public.inquiries FOR SELECT
USING (true);

-- Permitir actualizar estado de consultas
DROP POLICY IF EXISTS "Allow public update to inquiries" ON public.inquiries;
CREATE POLICY "Allow public update to inquiries"
ON public.inquiries FOR UPDATE
USING (true);

-- 4. CARGA INICIAL DE PROPIEDADES DE INMOBILIARIA MARCEL LUCUIX
INSERT INTO public.vehicles (
    id, title, operation, "propertyType", location, city, address,
    price, currency, bedrooms, bathrooms, "totalArea", "coveredArea", garages,
    status, featured, code, description, features, image, gallery,
    brand, model, year, category, engine, power, acceleration,
    drive, transmission, "transmissionDetail", "fuelType", mileage, color,
    "daysOnLot", "stockId", vin
) VALUES
(
    'cerrito-colon-alquiler',
    'Casa en Planta Baja con Patio y Churrasquera',
    'Alquiler',
    'Casa',
    'Cerrito y Colón',
    'Paysandú',
    'Cerrito y Colón, Paysandú',
    25000,
    'UYU',
    3,
    1,
    140,
    110,
    1,
    'Active',
    true,
    'ML-ALQ-0201',
    'Casa en planta baja ubicada en Cerrito y Colón, Paysandú. Cuenta con 3 cómodos dormitorios, living con estufa a leña tradicional, cocina comedor independiente, baño completo y amplio patio con churrasquera techada. Excelente opción familiar.',
    ARRAY[
      'Alquiler mensual: $ 25.000 UYU',
      '3 Dormitorios amplios y luminosos',
      'Living con estufa a leña',
      'Cocina comedor',
      'Patio con churrasquera techada',
      'Garantías: ANDA, Porto Seguro, Contaduría (CGN), FIDECIU'
    ],
    '/properties/stock-casa-cerrito.jpg',
    ARRAY[
      '/properties/stock-casa-cerrito.jpg',
      '/properties/exterior-patio.jpg',
      '/properties/interior-living.jpg',
      '/properties/interior-cocina.jpg'
    ],
    'Casa',
    'Casa 3 Dormitorios en Cerrito y Colón',
    2024,
    'Alquiler · Casa',
    '3 Dormitorios · 1 Baño',
    '110 m² Edif.',
    'Patio c/Churrasquera',
    'Cerrito y Colón, Paysandú',
    'Alquiler',
    'Alquiler Mensual · $ 25.000',
    'UYU',
    110,
    'Cerrito y Colón',
    1,
    'ML-ALQ-0201',
    'ML-CASA-0201'
),
(
    'larranaga-33orientales-alquiler',
    'Apartamento a Estrenar con Cochera y Patio',
    'Alquiler',
    'Apartamento',
    'Larrañaga y 33 Orientales',
    'Paysandú',
    'Larrañaga y 33 Orientales, Paysandú',
    22000,
    'UYU',
    2,
    1,
    80,
    70,
    1,
    'Active',
    true,
    'ML-ALQ-0202',
    'Apartamento a estrenar con excelente ubicación sobre Larrañaga y 33 Orientales. Dispone de 2 dormitorios con buena luz natural, living, cocina comedor integrada, baño moderno, patio exclusivo y cochera propia para vehículo.',
    ARRAY[
      'Alquiler mensual: $ 22.000 UYU',
      'Unidad a estrenar con finas terminaciones',
      '2 Dormitorios y 1 Baño moderno',
      'Living y cocina comedor',
      'Patio exclusivo y cochera propia',
      'Garantías: ANDA, Porto Seguro, CGN, FIDECIU'
    ],
    '/properties/stock-apto-larranaga.jpg',
    ARRAY[
      '/properties/stock-apto-larranaga.jpg',
      '/properties/interior-cocina.jpg',
      '/properties/interior-dormitorio.jpg',
      '/properties/interior-bano.jpg'
    ],
    'Apartamento',
    'Apto a Estrenar 2 Dorm. c/Cochera',
    2025,
    'Alquiler · Apartamento',
    '2 Dormitorios · 1 Baño',
    '70 m² Edif.',
    'Cochera y Patio',
    'Larrañaga y 33 Orientales',
    'Alquiler',
    'Alquiler Mensual · $ 22.000',
    'UYU',
    70,
    'Larrañaga y 33 Orientales',
    1,
    'ML-ALQ-0202',
    'ML-APTO-0202'
),
(
    'ituzaingo-verocay-alquiler',
    'Apartamento Semi Amoblado con Estufa y Jacuzzi',
    'Alquiler',
    'Apartamento',
    'Ituzaingó y Verocay',
    'Paysandú',
    'Ituzaingó y Verocay, Paysandú',
    21900,
    'UYU',
    1,
    1,
    65,
    55,
    0,
    'Active',
    true,
    'ML-ALQ-0203',
    'Hermoso apartamento semi amoblado en Ituzaingó y Verocay. Ideal para persona sola o profesional. Cuenta con 1 dormitorio acogedor, cocina comedor con estufa a leña, baño completo con jacuzzi y patio compartido.',
    ARRAY[
      'Alquiler mensual: $ 21.900 UYU',
      'Semi amoblado con mobiliario de calidad',
      '1 Dormitorio amplio',
      'Cocina comedor con estufa a leña',
      'Baño completo equipado con jacuzzi',
      'Patio compartido y entorno tranquilo'
    ],
    '/properties/stock-apto-ituzaingo.jpg',
    ARRAY[
      '/properties/stock-apto-ituzaingo.jpg',
      '/properties/interior-bano.jpg',
      '/properties/interior-dormitorio.jpg',
      '/properties/interior-cocina.jpg'
    ],
    'Apartamento',
    'Apto Semi Amoblado c/Jacuzzi',
    2024,
    'Alquiler · Apartamento',
    '1 Dormitorio · Jacuzzi',
    '55 m² Edif.',
    'Semi Amoblado',
    'Ituzaingó y Verocay',
    'Alquiler',
    'Alquiler Mensual · $ 21.900',
    'UYU',
    55,
    'Ituzaingó y Verocay',
    2,
    'ML-ALQ-0203',
    'ML-APTO-0203'
),
(
    'florida-solano-garcia-alquiler',
    'Casa Cómoda en Florida y Solano García',
    'Alquiler',
    'Casa',
    'Florida y Solano García',
    'Paysandú',
    'Florida y Solano García, Paysandú',
    14500,
    'UYU',
    3,
    1,
    120,
    90,
    1,
    'Active',
    false,
    'ML-ALQ-0204',
    'Casa de 3 dormitorios en Florida y Solano García, Paysandú. Dispone de living, cocina comedor, baño completo y patio cerrado. Zona tranquila con fácil acceso a locomoción y comercios.',
    ARRAY[
      'Alquiler mensual: $ 14.500 UYU',
      '3 Dormitorios',
      'Living y Cocina comedor',
      'Baño completo',
      'Patio cerrado',
      'Garantías: ANDA, Porto, Contaduría CGN, FIDECIU'
    ],
    '/properties/stock-casa-florida.jpg',
    ARRAY[
      '/properties/stock-casa-florida.jpg',
      '/properties/interior-living.jpg',
      '/properties/interior-dormitorio.jpg',
      '/properties/exterior-patio.jpg'
    ],
    'Casa',
    'Casa 3 Dormitorios Florida y Solano García',
    2023,
    'Alquiler · Casa',
    '3 Dormitorios · 1 Baño',
    '90 m² Edif.',
    'Patio Cerrado',
    'Florida y Solano García',
    'Alquiler',
    'Alquiler Mensual · $ 14.500',
    'UYU',
    90,
    'Florida y Solano García',
    3,
    'ML-ALQ-0204',
    'ML-CASA-0204'
),
(
    'casa-residencia-barrio-jardin',
    'Exclusiva Residencia en Barrio Jardín con Piscina y Barbacoa',
    'Venta',
    'Casa',
    'Barrio Jardín',
    'Paysandú',
    'Av. Salto y Barrio Jardín, Paysandú',
    265000,
    'USD',
    4,
    3,
    820,
    280,
    2,
    'Active',
    true,
    'ML-0101',
    'Magnífica residencia contemporánea en la zona más distinguida de Barrio Jardín, Paysandú. Construcción de primer nivel con amplios ventanales, living comedor con estufa a leña, cocina de concepto abierto totalmente equipada. Fondo parquizado con piscina climatizada, barbacoa techada con parrillero y horno a leña. Master suite con vestidor. Documentación al día, apta para préstamo bancario.',
    ARRAY[
      '4 Dormitorios amplios (Master suite con vestidor)',
      '3 Baños completos con terminaciones en porcelanato',
      'Piscina climatizada y solárium parquizado',
      'Barbacoa cerrada con parrillero y horno a leña',
      'Calefacción central y aire acondicionado',
      'Cochera techada para 2 vehículos con portón automatizado',
      'Acepta préstamo hipotecario (BHU, Santander, BROU, Itaú)'
    ],
    '/properties/stock-residencia-jardin.jpg',
    ARRAY[
      '/properties/stock-residencia-jardin.jpg',
      '/properties/residencia-piscina.jpg',
      '/properties/interior-living.jpg',
      '/properties/interior-cocina.jpg'
    ],
    'Casa',
    'Residencia en Barrio Jardín con Piscina',
    2022,
    'Venta · Casa',
    '4 Dormitorios · 3 Baños',
    '280 m² Edif.',
    '820 m² Terreno',
    'Barrio Jardín, Paysandú',
    'Venta',
    'Venta Directa · Acepta Banco',
    'USD',
    280,
    'Barrio Jardín',
    3,
    'ML-0101',
    'ML-CASA-0101'
),
(
    'apartamento-centro-terraza-panoramica',
    'Apartamento Premium con Terraza Panorámica y Parrillero',
    'Venta',
    'Apartamento',
    'Centro',
    'Paysandú',
    '18 de Julio y Leandro Gómez, Paysandú',
    148000,
    'USD',
    2,
    2,
    105,
    88,
    1,
    'Active',
    true,
    'ML-0102',
    'Piso alto con excelente luminosidad natural y vista despejada a la ciudad de Paysandú. Amplio living-comedor con salida directa a terraza privada con parrillero propio. Dos dormitorios con placares empotrados (principal en suite). Cocina moderna con mesadas de granito y terraza lavadero. Edificio con ascensor de última generación y cámaras de seguridad.',
    ARRAY[
      '2 Dormitorios con placares (1 en suite)',
      'Terraza privada con parrillero propio y vista despejada',
      'Cochera fija techada incluida',
      'Edificio moderno con ascensor y cámaras de seguridad',
      'Bajos gastos comunes mensuales',
      'Acepta Préstamo Hipotecario Bancario'
    ],
    '/properties/stock-penthouse-centro.jpg',
    ARRAY[
      '/properties/stock-penthouse-centro.jpg',
      '/properties/stock-apto-larranaga.jpg',
      '/properties/interior-cocina.jpg',
      '/properties/interior-dormitorio.jpg'
    ],
    'Apartamento',
    'Penthouse Centro con Terraza y Parrillero',
    2023,
    'Venta · Apartamento',
    '2 Dormitorios · 2 Baños',
    '88 m² Edif.',
    '105 m² Total',
    'Centro, Paysandú',
    'Venta',
    'Venta · Con Cochera',
    'USD',
    88,
    'Centro',
    5,
    'ML-0102',
    'ML-APTO-0102'
),
(
    'chacra-estancia-paysandu',
    'Chacra Productiva y Turística de 5 Hectáreas sobre Ruta',
    'Venta',
    'Chacra / Campo',
    'Ruta 3 y Constancia',
    'Paysandú',
    'Ruta 3 Km 380, Paysandú',
    340000,
    'USD',
    4,
    3,
    50000,
    320,
    4,
    'Active',
    true,
    'ML-0103',
    'Excelente fracción de 5 hectáreas con inmejorable acceso sobre ruta asfaltada a solo minutos de la ciudad de Paysandú. Casco principal de estilo tradicional colonial con galería perimetral, piscina, tajamar con vertiente natural, galpón de herramientas y casa para casero. Ideal para residencia campestre, emprendimiento turístico o recreativo.',
    ARRAY[
      '5 Hectáreas con costa de cañada y tajamar',
      'Casco principal colonial con galerías techadas',
      'Piscina con deck de piedra natural',
      'Monte frutal en producción y eucaliptos añejos',
      'Pozo semisurgente con excelente caudal de agua',
      'Luz trifásica y conectividad de fibra'
    ],
    '/properties/stock-chacra-ruta3.jpg',
    ARRAY[
      '/properties/stock-chacra-ruta3.jpg',
      '/properties/chacra-casco.jpg',
      '/properties/exterior-patio.jpg',
      '/properties/interior-living.jpg'
    ],
    'Chacra / Campo',
    'Chacra Turística 5 Hás sobre Ruta',
    2021,
    'Venta · Chacra',
    '5 Hectáreas · 4 Dorm.',
    '320 m² Edif.',
    '50.000 m² Terreno',
    'Ruta 3, Paysandú',
    'Venta',
    'Venta · Campo / Chacra',
    'USD',
    320,
    'Ruta 3',
    7,
    'ML-0103',
    'ML-CAMPO-0103'
)
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    operation = EXCLUDED.operation,
    "propertyType" = EXCLUDED."propertyType",
    location = EXCLUDED.location,
    city = EXCLUDED.city,
    address = EXCLUDED.address,
    price = EXCLUDED.price,
    currency = EXCLUDED.currency,
    bedrooms = EXCLUDED.bedrooms,
    bathrooms = EXCLUDED.bathrooms,
    "totalArea" = EXCLUDED."totalArea",
    "coveredArea" = EXCLUDED."coveredArea",
    garages = EXCLUDED.garages,
    status = EXCLUDED.status,
    featured = EXCLUDED.featured,
    code = EXCLUDED.code,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    image = EXCLUDED.image,
    gallery = EXCLUDED.gallery,
    brand = EXCLUDED.brand,
    model = EXCLUDED.model,
    year = EXCLUDED.year,
    category = EXCLUDED.category,
    engine = EXCLUDED.engine,
    power = EXCLUDED.power,
    acceleration = EXCLUDED.acceleration,
    drive = EXCLUDED.drive,
    transmission = EXCLUDED.transmission,
    "transmissionDetail" = EXCLUDED."transmissionDetail",
    "fuelType" = EXCLUDED."fuelType",
    mileage = EXCLUDED.mileage,
    color = EXCLUDED.color;

-- 5. CONSULTAS DE EJEMPLO
INSERT INTO public.inquiries (
    id, "vehicleId", "vehicleName", "fullName", email, phone, message, date, status, "inquiryType"
) VALUES
(
    'inq-1',
    'cerrito-colon-alquiler',
    'Casa en Cerrito y Colón (Alquiler $25.000)',
    'Gonzalo Silva Varela',
    'gonzalo.silva@gmail.com',
    '098 765 432',
    'Buenas tardes, quisiera consultar los requisitos para alquilar la casa en Cerrito y Colón. Tengo garantía de ANDA lista.',
    'Hace 10 min',
    'New',
    'Alquiler'
),
(
    'inq-2',
    'larranaga-33orientales-alquiler',
    'Apartamento a Estrenar Larrañaga y 33 Orientales',
    'Dra. Mariana Rossi',
    'mrossi@salud.uy',
    '091 987 654',
    'Hola, consulto por el apartamento en alquiler en Larrañaga y 33 Orientales si se puede coordinar una visita hoy a la tarde.',
    'Hace 45 min',
    'New',
    'Alquiler'
),
(
    'inq-3',
    'casa-residencia-barrio-jardin',
    'Residencia en Barrio Jardín con Piscina',
    'Ing. Agr. Esteban Martínez',
    'esteban.martinez@agro.uy',
    '099 123 456',
    'Buenas tardes Marcel, quisiera coordinar una tasación y visita a la residencia en Barrio Jardín.',
    'Hace 2 horas',
    'New',
    'Compra'
)
ON CONFLICT (id) DO NOTHING;
