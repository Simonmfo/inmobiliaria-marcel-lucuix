-- ================================================================
-- CAR SELLER AUTOMÓVILES (PAYSANDÚ) - ESQUEMA SUPABASE
-- URL: https://rdkkjkfmqjjitllmkhfk.supabase.co
-- ================================================================

-- 1. TABLA DE VEHÍCULOS
CREATE TABLE IF NOT EXISTS public.vehicles (
    id TEXT PRIMARY KEY,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    price NUMERIC NOT NULL,
    category TEXT NOT NULL,
    engine TEXT,
    power TEXT,
    acceleration TEXT,
    drive TEXT,
    transmission TEXT NOT NULL DEFAULT 'Manual',
    "transmissionDetail" TEXT,
    "fuelType" TEXT NOT NULL DEFAULT 'Petrol',
    mileage INTEGER NOT NULL DEFAULT 0,
    color TEXT,
    status TEXT NOT NULL DEFAULT 'Active',
    "daysOnLot" INTEGER DEFAULT 1,
    "stockId" TEXT,
    vin TEXT,
    description TEXT,
    features TEXT[] DEFAULT '{}',
    image TEXT NOT NULL,
    gallery TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. TABLA DE CONSULTAS / CONTACTOS
CREATE TABLE IF NOT EXISTS public.inquiries (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    "vehicleId" TEXT,
    "vehicleName" TEXT,
    "fullName" TEXT NOT NULL,
    email TEXT NOT NULL,
    message TEXT NOT NULL,
    date TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'New',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. POLÍTICAS DE SEGURIDAD (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- Permitir lectura pública a vehículos
DROP POLICY IF EXISTS "Allow public read access to vehicles" ON public.vehicles;
CREATE POLICY "Allow public read access to vehicles"
ON public.vehicles FOR SELECT
USING (true);

-- Permitir agregar/modificar/eliminar vehículos
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

-- 4. CARGA INICIAL DE VEHÍCULOS DE CAR SELLER (@carseller.uy)
INSERT INTO public.vehicles (
    id, brand, model, year, price, category, engine, power, acceleration,
    drive, transmission, "transmissionDetail", "fuelType", mileage, color,
    status, "daysOnLot", "stockId", vin, description, features, image, gallery
) VALUES 
(
    'renault-oroch-zen-0km',
    'Renault',
    'Duster Oroch 1.6 Zen 16V',
    2025,
    21990,
    'Pick Up Doble Cabina',
    '1.6L SCe 16V 4 Cilindros',
    '115 HP',
    '11.5 Sec',
    'FWD Delantera',
    'Manual',
    'Manual de 5 Velocidades',
    'Petrol',
    0,
    'Blanco Glaciar',
    'Active',
    1,
    'CS-ORO-0KM',
    '93YORC25PM910248',
    'Renault Duster Oroch versión Zen 1.6 16v 0 KM a estrenar. Doble cabina con gran espacio interior para 5 adultos y caja de carga muy amplia. Equipada con dirección electrohidráulica, aire acondicionado, pantalla táctil Media Evolution con conectividad para smartphones, frenos ABS y control de estabilidad (ESP). Lista para entrega inmediata en Car Seller Paysandú.',
    ARRAY[
      'Unidad 0 KM a estrenar con garantía oficial de fábrica.',
      'Caja de carga con capacidad de 650 kg y 683 litros.',
      'Pantalla multimedia táctil con Apple CarPlay y Android Auto.',
      'Control de estabilidad (ESP) y asistente de arranque en pendientes (HSA).',
      'Financiación hasta el 100% en Car Seller Paysandú.'
    ],
    '/cars/ig_DY7OSjRlbpA.jpg',
    ARRAY['/cars/ig_DY7OSjRlbpA.jpg']
),
(
    'fiat-strada-endurance-2022',
    'Fiat',
    'Strada Endurance 1.4 Cabina Plus',
    2022,
    15900,
    'Pick Up Utilitario',
    '1.4L Fire EVO 8V',
    '85 HP',
    '12.3 Sec',
    'FWD con TC+ E-Locker',
    'Manual',
    'Manual de 5 Velocidades',
    'Petrol',
    42000,
    'Blanco Banchisa',
    'Active',
    2,
    'CS-STR-2022',
    '9BD28148N0E192847',
    'Fiat Strada Endurance año 2022 con 42.000 km. Excelente estado de conservación general, utilizada únicamente para uso personal. Motor Fire 1.4 sumamente noble y económico. Equipada con control de tracción avanzado TC+, aire acondicionado, dirección asistida, protector de caja, lona marítima y frenos ABS.',
    ARRAY[
      'Motor 1.4 Fire de mínimo mantenimiento y repuestos súper accesibles.',
      'Control de tracción avanzado TC+ para caminos difíciles y arena.',
      'Excelente capacidad de carga de 720 kg.',
      'Protector de caja y lona marítima incluidos.',
      'Financiación en pesos uruguayos o dólares.'
    ],
    '/cars/ig_Dd1aK8HFt2E.jpg',
    ARRAY['/cars/ig_Dd1aK8HFt2E.jpg', '/cars/fiat-strada-rear.jpg', '/cars/fiat-strada-interior.jpg']
),
(
    'volkswagen-saveiro-extreme-2025',
    'Volkswagen',
    'Saveiro Extreme Doble Cabina 1.6 16V',
    2025,
    18900,
    'Pick Up Doble Cabina',
    '1.6L MSI 16V Nafta',
    '110 HP',
    '10.2 Sec',
    'FWD Delantera',
    'Manual',
    'Manual de 5 Velocidades',
    'Petrol',
    5200,
    'Gris Oliver Metalizado',
    'Active',
    2,
    'CS-SAV-EXT25',
    '9BWDB45U2SP019283',
    'Volkswagen Saveiro Extreme Doble Cabina año 2025 con solo 5.200 km reales. Versión tope de gama con diseño renovado. Equipada con llantas diamantadas de 15 pulgadas, cámara de visión trasera, tapizados exclusivos Extreme en cuero ecológico, pantalla táctil Composition Touch con App-Connect, volante multifunción en cuero y sensores de estacionamiento.',
    ARRAY[
      'Solo 5.200 km en garantía oficial de Volkswagen.',
      'Versión Extreme con tapizados en cuero y estética deportiva.',
      'Cámara de estacionamiento trasera y sensores acústicos.',
      'Pantalla multimedia táctil con Android Auto y Apple CarPlay.',
      'Barra de San Antonio exclusiva y lona marítima original.'
    ],
    '/cars/ig_DdobhEpFmJA.jpg',
    ARRAY['/cars/ig_DdobhEpFmJA.jpg', '/cars/vw-saveiro-front.jpg', '/cars/vw-saveiro-rear.jpg']
),
(
    'volkswagen-tiguan-highline-2020',
    'Volkswagen',
    'Tiguan Allspace Highline 1.4 TSI 7 Plazas',
    2020,
    27900,
    'SUV Familiar 7 Plazas',
    '1.4L TSI Turbo 16V',
    '150 HP',
    '9.3 Sec',
    'FWD Delantera',
    'Automatic',
    'Automática Secuencial DSG 6 Velocidades',
    'Petrol',
    68000,
    'Blanco Puro Perlado',
    'Active',
    3,
    'CS-TIG-2020',
    '3VW5T7AX7LM092841',
    'Volkswagen Tiguan Allspace versión Highline año 2020 con 68.000 km. Capacidad para 7 pasajeros con 3 filas de asientos. Máximo nivel de confort y seguridad: techo solar panorámico corredizo eléctrico, tapizados en cuero Vienna con butacas calefaccionadas y memoria eléctrica, climatizador digital tri-zona, faros LED adaptativos y baúl con apertura eléctrica.',
    ARRAY[
      'Configuración de 7 plazas para toda la familia.',
      'Techo solar panorámico corredizo eléctrico con cortina.',
      'Motor 1.4 TSI Turbo de 150 HP potente y eficiente.',
      'Caja automática DSG de doble embrague de respuesta inmediata.',
      'Tapizado en cuero premium, asientos eléctricos con memoria.'
    ],
    '/cars/ig_DdZiZmpl_M0.jpg',
    ARRAY['/cars/ig_DdZiZmpl_M0.jpg', '/cars/vw-tiguan-front.jpg', '/cars/vw-tiguan-interior.jpg', '/cars/vw-tiguan-rear.jpg']
),
(
    'renault-kwid-life-2020',
    'Renault',
    'Kwid Life 1.0 SCe',
    2020,
    9800,
    'City Car Económico',
    '1.0L SCe 3 Cilindros 12V',
    '66 HP',
    '14.1 Sec',
    'FWD Delantera',
    'Manual',
    'Manual de 5 Velocidades',
    'Petrol',
    54000,
    'Blanco Glaciar',
    'Active',
    3,
    'CS-KWD-2020',
    '93YBB0801LL102948',
    'Renault Kwid versión Life año 2020 con 54.000 km. Destacado por su agilidad urbana, despeje del suelo tipo SUV y mínimo consumo (más de 18 km/litro). Equipado con 4 airbags de fábrica (frontales y laterales), frenos ABS, aire acondicionado y dirección asistida eléctrica. Documentación 100% al día.',
    ARRAY[
      '4 airbags de serie para máxima seguridad en el segmento.',
      'Excelente altura libre al suelo de 18 cm.',
      'Consumo promedio sobresaliente: 18 a 20 km/litro.',
      'Patente anual y seguro muy económicos.',
      'Financiación hasta el 100% en Car Seller Paysandú.'
    ],
    '/cars/ig_Dd1_i_GIBUS.jpg',
    ARRAY['/cars/ig_Dd1_i_GIBUS.jpg', '/cars/renault-kwid-front.jpg', '/cars/renault-kwid-rear.jpg']
),
(
    'suzuki-alto-800-2018',
    'Suzuki',
    'Alto 800 GA',
    2018,
    7900,
    'City Car Económico',
    '0.8L F8D 3 Cilindros',
    '48 HP',
    '15.5 Sec',
    'FWD Delantera',
    'Manual',
    'Manual de 5 Velocidades',
    'Petrol',
    62000,
    'Gris Plata Metalizado',
    'Active',
    4,
    'CS-ALT-2018',
    'MA3EAA11S00891024',
    'Suzuki Alto 800 GA año 2018 con 62.000 km. Confiabilidad mecánica japonesa inigualable. El vehículo más rendidor y económico de mantener del mercado uruguayo, superando los 20 km/litro en ruta. Equipado con aire acondicionado, doble airbag frontal y frenos ABS.',
    ARRAY[
      'Consumo récord superior a 20 km/litro.',
      'Mantenimiento y repuestos de costo mínimo.',
      'Aire acondicionado funcionando en perfecto estado.',
      'Doble airbag frontal y sistema de frenos ABS.',
      'Ideal para primer auto o movilidad diaria de bajo costo.'
    ],
    '/cars/ig_DdluPkaljOa.jpg',
    ARRAY['/cars/ig_DdluPkaljOa.jpg', '/cars/suzuki-alto-front.jpg', '/cars/suzuki-alto-rear.jpg']
),
(
    'geely-lc-13-2013',
    'Geely',
    'LC 1.3 GL Full',
    2013,
    6900,
    'City Car',
    '1.3L 4 Cilindros 16V',
    '86 HP',
    '13.2 Sec',
    'FWD Delantera',
    'Manual',
    'Manual de 5 Velocidades',
    'Petrol',
    95000,
    'Rojo Carmín',
    'Active',
    5,
    'CS-GLC-2013',
    'LB3713512DA092184',
    'Geely LC 1.3 GL Full año 2013 con 95.000 km. Excelente precio y completo equipamiento de confort: aire acondicionado, dirección hidráulica, vidrios eléctricos en las 4 puertas, espejos eléctricos, llantas de aleación originales, faros antiniebla, doble airbag y frenos ABS con EBD. Títulos prontos para transferir.',
    ARRAY[
      'Precio de oportunidad muy accesible: US$ 6.900.',
      'Equipamiento Full: 4 vidrios eléctricos y llantas de aleación.',
      'Aire acondicionado y dirección hidráulica.',
      'Motor 1.3 de 86 HP ágil y de repuestos económicos.',
      'Financiación ágil en Car Seller Paysandú.'
    ],
    '/cars/ig_DdrJ5-2loql.jpg',
    ARRAY['/cars/ig_DdrJ5-2loql.jpg']
)
ON CONFLICT (id) DO UPDATE SET
    brand = EXCLUDED.brand,
    model = EXCLUDED.model,
    year = EXCLUDED.year,
    price = EXCLUDED.price,
    category = EXCLUDED.category,
    engine = EXCLUDED.engine,
    power = EXCLUDED.power,
    acceleration = EXCLUDED.acceleration,
    drive = EXCLUDED.drive,
    transmission = EXCLUDED.transmission,
    "transmissionDetail" = EXCLUDED."transmissionDetail",
    "fuelType" = EXCLUDED."fuelType",
    mileage = EXCLUDED.mileage,
    color = EXCLUDED.color,
    status = EXCLUDED.status,
    description = EXCLUDED.description,
    features = EXCLUDED.features,
    image = EXCLUDED.image,
    gallery = EXCLUDED.gallery;

-- 5. CONSULTAS DE EJEMPLO
INSERT INTO public.inquiries (
    id, "vehicleId", "vehicleName", "fullName", email, message, date, status
) VALUES
(
    'inq-1',
    'renault-oroch-zen-0km',
    'Renault Duster Oroch 1.6 Zen 16V 0KM',
    'Gonzalo Silva',
    'gonzalo.silva@ruralpaysandu.com.uy',
    'Buenas tardes, me interesa la Duster Oroch 0KM. ¿Aceptan permuta por una camioneta 2020 y qué opciones de financiación tienen en Paysandú?',
    'Hace 15 min',
    'New'
),
(
    'inq-2',
    'volkswagen-saveiro-extreme-2025',
    'Volkswagen Saveiro Extreme Doble Cabina 1.6 16V',
    'Esteban Martínez',
    'esteban.martinez@agro.uy',
    'Hola, consulto por la Saveiro Extreme 2025 con 5.200 km si se puede ir a ver a Florida 1615 esta tarde.',
    'Hace 1 hora',
    'New'
),
(
    'inq-3',
    'renault-kwid-life-2020',
    'Renault Kwid Life 1.0 SCe 2020',
    'Mariana Rossi',
    'mrossi@gmail.com',
    'Hola, quería consultar qué entrega mínima piden por el Kwid 2020 de US$ 9.800 y cuotas en pesos.',
    'Hace 3 horas',
    'New'
)
ON CONFLICT (id) DO NOTHING;
