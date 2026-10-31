import https from 'https';
import fs from 'fs';
import path from 'path';

export interface ParsedVehicleInfo {
  brand: string;
  model: string;
  year: number | null;
  price: number | null;
  mileage: number | null;
  engine: string;
  features: string[];
}

export interface InstagramCarouselResult {
  success: boolean;
  shortcode?: string;
  images: string[];
  caption: string;
  parsed: ParsedVehicleInfo;
  error?: string;
}

function cleanUrl(u: string): string {
  return u.replace(/[,;"'\\)]+$/, '').trim();
}

export function parseCaption(text: string): ParsedVehicleInfo {
  const result: ParsedVehicleInfo = {
    brand: '',
    model: '',
    year: null,
    price: null,
    mileage: null,
    engine: '',
    features: []
  };

  if (!text) return result;
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // Year: Año 2022, 2023, etc.
  const yearMatch = text.match(/A[ñn]o\s*([12][0-9]{3})/i);
  if (yearMatch) result.year = parseInt(yearMatch[1], 10);

  // Mileage: 79.400km, 12000 km, 0km
  const kmMatch = text.match(/([0-9]+(?:[\.,][0-9]+)*)\s*(?:km|kms|kilometros)/i);
  if (kmMatch) {
    const rawKm = kmMatch[1].replace(/[\.,]/g, '');
    result.mileage = parseInt(rawKm, 10);
  }

  // Price: U$$ 11.990, US$ 12.000, USD 14.500, U$S 10.000, $ 10.000
  const priceMatch = text.match(/[uU][sS$]{1,3}\s*([0-9\.,]+)/);
  if (priceMatch) {
    const rawPrice = priceMatch[1].replace(/[\.,]/g, '');
    result.price = parseInt(rawPrice, 10);
  }

  // Engine: Motor 1.4 Fire, Motor 1.0, etc.
  const engineMatch = text.match(/Motor\s+([^\n\r]+)/i);
  if (engineMatch) {
    result.engine = engineMatch[1].replace(/[\.]$/, '').trim();
  }

  // Known car brands
  const knownBrands = [
    'Fiat', 'Chevrolet', 'Volkswagen', 'VW', 'Renault', 'Suzuki', 
    'Toyota', 'Ford', 'Peugeot', 'Citroen', 'Citroën', 'Nissan', 
    'Hyundai', 'Jeep', 'Honda', 'BYD', 'BMW', 'Audi', 'Mercedes-Benz'
  ];
  for (const b of knownBrands) {
    if (text.toLowerCase().includes(b.toLowerCase())) {
      result.brand = b === 'VW' ? 'Volkswagen' : b;
      break;
    }
  }

  // Model candidate from line containing brand
  for (const line of lines) {
    if (result.brand && line.toLowerCase().includes(result.brand.toLowerCase())) {
      const modelCandidate = line
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(new RegExp(result.brand, 'i'), '')
        .replace(/[!¡]/g, '')
        .trim();
      if (modelCandidate.length > 1) {
        result.model = modelCandidate;
        break;
      }
    }
  }

  // Features from lines with bullets or checkmarks
  for (const line of lines) {
    if (line.includes('✅') || line.startsWith('-') || line.startsWith('•')) {
      const feat = line
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/^[\-•\*\s]+/, '')
        .replace(/[\.]$/, '')
        .trim();
      if (
        feat && 
        !feat.toLowerCase().includes('año') && 
        !feat.toLowerCase().includes('km') && 
        !feat.toLowerCase().includes('motor') &&
        !feat.toLowerCase().includes('florida') &&
        !feat.toLowerCase().includes('tel')
      ) {
        result.features.push(feat);
      }
    }
  }

  return result;
}

export function fetchInstagramCarousel(urlOrCode: string, saveDir?: string): Promise<InstagramCarouselResult> {
  return new Promise((resolve) => {
    try {
      const match = urlOrCode.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
      const shortcode = match ? match[1] : urlOrCode.replace(/^\/+|\/+$/g, '').trim();
      
      if (!shortcode) {
        return resolve({ 
          success: false, 
          images: [], 
          caption: '', 
          parsed: parseCaption(''),
          error: 'No se pudo detectar el código de publicación de Instagram.' 
        });
      }

      const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/`;

      https.get(embedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
          'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
        }
      }, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', async () => {
          try {
            const clean = data.replaceAll('\\/', '/').replaceAll('&amp;', '&').replaceAll('\\u0026', '&');
            const regex = /https:\/\/[^\s"'<>]+\.(?:fbcdn\.net|cdninstagram\.com)\/v\/t39\.30808-6\/[^\s"'<>]+/g;
            const matches = (clean.match(regex) || []).map(cleanUrl);

            const photoMap = new Map<string, string>();
            for (const u of matches) {
              const fidMatch = u.match(/\/([0-9]+_[0-9]+_[0-9]+_n\.(?:jpg|webp))/);
              if (fidMatch) {
                const fid = fidMatch[1];
                if (!photoMap.has(fid) || u.length > (photoMap.get(fid)?.length || 0)) {
                  photoMap.set(fid, u);
                }
              }
            }

            // Extract caption
            let caption = '';
            const key = String.raw`\"text\":\"`;
            const start = data.indexOf(key);
            if (start !== -1) {
              const sub = data.slice(start + key.length);
              const end = sub.indexOf(String.raw`\"`);
              if (end !== -1) {
                const rawText = sub.slice(0, end);
                caption = rawText
                  .replace(/\\n/g, '\n')
                  .replace(/\\u([0-9a-fA-F]{4})/g, (_, c) => String.fromCharCode(parseInt(c, 16)));
              }
            }

            const rawUrls = Array.from(photoMap.values());
            const savedPaths: string[] = [];

            // If save directory exists, save images locally so they never expire
            if (saveDir && fs.existsSync(saveDir)) {
              let idx = 1;
              for (const u of rawUrls) {
                const fname = `ig_${shortcode}_${idx}.jpg`;
                const fpath = path.join(saveDir, fname);
                try {
                  await new Promise<void>((resFile) => {
                    https.get(u, {
                      headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)' }
                    }, (imgRes) => {
                      if (imgRes.statusCode === 200) {
                        const out = fs.createWriteStream(fpath);
                        imgRes.pipe(out);
                        out.on('finish', () => {
                          savedPaths.push(`/cars/${fname}`);
                          resFile();
                        });
                        out.on('error', () => {
                          savedPaths.push(u);
                          resFile();
                        });
                      } else {
                        savedPaths.push(u);
                        resFile();
                      }
                    }).on('error', () => {
                      savedPaths.push(u);
                      resFile();
                    });
                  });
                } catch {
                  savedPaths.push(u);
                }
                idx++;
              }
            }

            const finalImages = savedPaths.length > 0 ? savedPaths : rawUrls;
            const parsedData = parseCaption(caption);

            resolve({
              success: finalImages.length > 0,
              shortcode,
              images: finalImages,
              caption,
              parsed: parsedData,
              error: finalImages.length === 0 ? 'No se encontraron imágenes en el enlace proporcionado.' : undefined
            });
          } catch (err: any) {
            resolve({ 
              success: false, 
              images: [], 
              caption: '', 
              parsed: parseCaption(''),
              error: err?.message || 'Error procesando la respuesta de Instagram' 
            });
          }
        });
      }).on('error', (err: any) => {
        resolve({ 
          success: false, 
          images: [], 
          caption: '', 
          parsed: parseCaption(''),
          error: err?.message || 'Error al conectar con Instagram' 
        });
      });
    } catch (e: any) {
      resolve({ 
        success: false, 
        images: [], 
        caption: '', 
        parsed: parseCaption(''),
        error: e?.message || 'Error inesperado' 
      });
    }
  });
}
