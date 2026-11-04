import https from 'https';

function cleanUrl(raw) {
  return raw
    .replaceAll('&amp;', '&')
    .replaceAll('\\u0026', '&')
    .replaceAll('\\/', '/')
    .replace(/^"+|"+$/g, '')
    .trim();
}

function parseCaption(text) {
  const result = {
    title: '',
    operation: undefined,
    propertyType: undefined,
    currency: undefined,
    price: undefined,
    bedrooms: undefined,
    bathrooms: undefined,
    totalArea: undefined,
    garages: undefined,
    location: undefined,
    features: [],
    brand: '',
    model: '',
    year: 2025,
    mileage: null,
    engine: ''
  };

  if (!text) return result;

  const cleanText = text
    .replace(/\\n/g, '\n')
    .replace(/\\"/g, '"')
    .replace(/\\/g, '');

  const lines = cleanText.split('\n').map(l => l.trim()).filter(Boolean);
  const lower = cleanText.toLowerCase();

  // Operation detection (Alquiler vs Venta)
  if (lower.includes('alquila') || lower.includes('alquiler') || lower.includes('arriendo')) {
    result.operation = 'Alquiler';
  } else if (lower.includes('vende') || lower.includes('venta') || lower.includes('oportunidad de compra')) {
    result.operation = 'Venta';
  }

  // Property Type detection
  if (lower.includes('apartamento') || lower.includes('apto') || lower.includes('monoambiente') || lower.includes('penthouse')) {
    result.propertyType = 'Apartamento';
  } else if (lower.includes('chacra') || lower.includes('campo') || lower.includes('estancia') || lower.includes('hectárea') || lower.includes('hectarea')) {
    result.propertyType = 'Chacra / Campo';
  } else if (lower.includes('terreno') || lower.includes('solar') || lower.includes('lote')) {
    result.propertyType = 'Terreno';
  } else if (lower.includes('local') || lower.includes('comercial') || lower.includes('galpón') || lower.includes('galpon')) {
    result.propertyType = 'Local Comercial';
  } else if (lower.includes('oficina') || lower.includes('consultorio')) {
    result.propertyType = 'Oficina';
  } else if (lower.includes('casa') || lower.includes('residencia') || lower.includes('propiedad') || lower.includes('duplex') || lower.includes('dúplex')) {
    result.propertyType = 'Casa';
  }

  // Price & Currency detection
  const usdMatch = cleanText.match(/(?:U\$S|US\$|USD|U\$\$)\s*([0-9]+(?:[\.,][0-9]{3})*)/i);
  const uyuMatch = cleanText.match(/(?:\$\s*|UYU\s*)([0-9]+(?:[\.,][0-9]{3})+)/i);

  if (usdMatch) {
    result.currency = 'USD';
    result.price = parseInt(usdMatch[1].replace(/[\.,]/g, ''), 10);
    if (!result.operation) result.operation = 'Venta';
  } else if (uyuMatch) {
    result.currency = 'UYU';
    result.price = parseInt(uyuMatch[1].replace(/[\.,]/g, ''), 10);
    if (!result.operation) result.operation = 'Alquiler';
  }

  // Bedrooms detection
  const bedMatch = cleanText.match(/([0-9]+)\s*(?:dormitorios?|dorms?\.?|habitaciones?)/i);
  if (bedMatch) {
    result.bedrooms = parseInt(bedMatch[1], 10);
  } else if (lower.includes('monoambiente')) {
    result.bedrooms = 1;
  }

  // Bathrooms detection
  const bathMatch = cleanText.match(/([0-9]+)\s*(?:ba[ñn]os?)/i);
  if (bathMatch) {
    result.bathrooms = parseInt(bathMatch[1], 10);
  }

  // Area (m2 / m² / hectáreas)
  const areaMatch = cleanText.match(/([0-9]+(?:[\.,][0-9]+)*)\s*(?:m2|m²|metros\s*cuadrados)/i);
  if (areaMatch) {
    result.totalArea = parseInt(areaMatch[1].replace(/[\.,]/g, ''), 10);
    result.mileage = result.totalArea;
  } else {
    const haMatch = cleanText.match(/([0-9]+)\s*(?:hect[áa]reas?|has?\b)/i);
    if (haMatch) {
      result.totalArea = parseInt(haMatch[1], 10) * 10000;
      result.mileage = result.totalArea;
    }
  }

  // Garage / Cochera detection
  if (lower.includes('cochera') || lower.includes('garaje') || lower.includes('garage') || lower.includes('entrada para auto')) {
    const garMatch = cleanText.match(/([0-9]+)\s*(?:cocheras?|garajes?|veh[íi]culos?|autos?)/i);
    result.garages = garMatch ? parseInt(garMatch[1], 10) : 1;
  }

  // Location detection from lines with 📍, "Ubicación", "Zona", or "Dirección"
  for (const line of lines) {
    const cleanLine = line.replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '').trim();
    const locMatch = cleanLine.match(/(?:ubicaci[óo]n|zona|direcci[óo]n)\s*[:\-]?\s*(.+)/i);
    if (locMatch && locMatch[1].length > 3) {
      result.location = locMatch[1].replace(/,?\s*paysand[úu].*/i, '').trim();
      break;
    }
    if (line.includes('📍') && cleanLine.length > 3) {
      result.location = cleanLine.replace(/,?\s*paysand[úu].*/i, '').trim();
      break;
    }
  }

  // Build title from first descriptive line or detected attributes
  for (const line of lines) {
    const stripped = line
      .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/^[¡!\-\s•*]+|[¡!\-\s•*]+$/g, '')
      .trim();
    if (stripped.length >= 6 && stripped.length <= 90 && !stripped.startsWith('#')) {
      result.title = stripped;
      break;
    }
  }

  if (!result.title && result.propertyType) {
    const opLabel = result.operation ? ` en ${result.operation}` : '';
    const locLabel = result.location ? ` - ${result.location}` : '';
    result.title = `${result.propertyType}${opLabel}${locLabel}`;
  }

  result.brand = result.propertyType || 'Propiedad';
  result.model = result.title || 'Inmueble en Paysandú';
  result.engine = `${result.bedrooms || 1} Dorms. · ${result.bathrooms || 1} Baños`;

  // Extract bulleted features
  for (const line of lines) {
    if (line.includes('✅') || line.includes('✔') || line.includes('🔹') || line.startsWith('-') || line.startsWith('•')) {
      const feat = line
        .replace(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
        .replace(/^[\-•\*\s✔]+/, '')
        .replace(/[\.]$/, '')
        .trim();
      if (
        feat &&
        feat.length > 3 &&
        !feat.toLowerCase().includes('098 689') &&
        !feat.toLowerCase().includes('4722 7016') &&
        !feat.toLowerCase().includes('33 orientales 950')
      ) {
        result.features.push(feat);
      }
    }
  }

  return result;
}

function getBestImageUrl(mediaNode) {
  if (!mediaNode) return '';
  const candidates = mediaNode.image_versions2?.candidates;
  if (Array.isArray(candidates) && candidates.length > 0) {
    // 1. Prefer candidate without _sNxN / _pNxN downscaling parameter (native full resolution, e.g. 1540x1027 or 1440x1800)
    const unscaled = candidates.find(
      c => c?.url && !/_[sp]\d+x\d+/i.test(c.url)
    );
    if (unscaled?.url) return cleanUrl(unscaled.url);

    // 2. Otherwise pick the candidate with the largest explicit width*height or _sNxN size
    let bestUrl = candidates[0]?.url || '';
    let bestScore = 0;
    for (const c of candidates) {
      if (!c?.url) continue;
      const w = Number(c.width) || 0;
      const h = Number(c.height) || 0;
      let score = w * h;
      if (!score) {
        const sizeMatch = c.url.match(/_[sp](\d+)x(\d+)/i);
        if (sizeMatch) {
          score = parseInt(sizeMatch[1], 10) * parseInt(sizeMatch[2], 10);
        }
      }
      if (score > bestScore) {
        bestScore = score;
        bestUrl = c.url;
      }
    }
    if (bestUrl) return cleanUrl(bestUrl);
  }
  const fallback = mediaNode.display_uri || mediaNode.display_url || '';
  return fallback ? cleanUrl(fallback) : '';
}

function fetchWithGooglebot(shortcode) {
  return new Promise((resolve) => {
    const url = `https://www.instagram.com/p/${shortcode}/`;
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    }, res => {
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => {
        try {
          const codeIdx = html.indexOf(`"code":"${shortcode}"`);
          if (codeIdx === -1) return resolve(null);

          const start = html.lastIndexOf('{"__typename":"XIGPolaris', codeIdx);
          if (start === -1) return resolve(null);

          let depth = 0;
          let end = -1;
          for (let i = start; i < html.length; i++) {
            if (html[i] === '{') depth++;
            else if (html[i] === '}') {
              depth--;
              if (depth === 0) {
                end = i + 1;
                break;
              }
            }
          }

          if (end === -1) return resolve(null);

          const jsonStr = html.slice(start, end);
          const targetObj = JSON.parse(jsonStr);
          const inner = targetObj.if_not_gated_logged_out || targetObj;
          const caption = inner.caption?.text || '';

          let slides = [];
          if (Array.isArray(inner.carousel_media) && inner.carousel_media.length > 0) {
            slides = inner.carousel_media.map(getBestImageUrl).filter(Boolean);
          } else {
            const single = getBestImageUrl(inner);
            if (single) slides = [single];
          }

          if (slides.length > 0) {
            return resolve({ slides, caption });
          }
          resolve(null);
        } catch {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function fetchWithEmbed(shortcode) {
  return new Promise((resolve) => {
    const embedUrl = `https://www.instagram.com/p/${shortcode}/embed/captioned/`;

    https.get(embedUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.5 Mobile/15E148 Safari/604.1',
        'Accept-Language': 'es-ES,es;q=0.9,en;q=0.8'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          let clean = data.replaceAll('\\/', '/').replaceAll('&amp;', '&').replaceAll('\\u0026', '&');

          // Strip out all HoverCard / recommendations so unrelated posts are never included
          clean = clean.replace(/<div[^>]*class=["'][^"']*HoverCard[^"']*["'][^>]*>[\s\S]*?<\/div>/gi, '');
          clean = clean.replace(/<div[^>]*HoverCard[^>]*>[\s\S]*?<\/div>/gi, '');

          // Prefer highest resolution URL from srcset (1080w) on EmbeddedMediaImage before falling back to src
          const imgTagMatch = clean.match(/<img[^>]*class=["'][^"']*EmbeddedMediaImage[^"']*["'][^>]*>/i);
          const slides = [];
          if (imgTagMatch) {
            const imgTag = imgTagMatch[0];
            const srcsetMatch = imgTag.match(/srcset=["']([^"']+)["']/i);
            let chosenUrl = '';
            if (srcsetMatch) {
              const parts = srcsetMatch[1]
                .split(',')
                .map(s => s.trim().split(/\s+/)[0])
                .filter(Boolean);
              if (parts.length > 0) {
                chosenUrl = cleanUrl(parts[parts.length - 1]);
              }
            }
            if (!chosenUrl) {
              const srcMatch = imgTag.match(/src=["']([^"']+)["']/i);
              if (srcMatch) chosenUrl = cleanUrl(srcMatch[1]);
            }
            if (chosenUrl && !chosenUrl.includes('t51.2885-19') && !chosenUrl.includes('s150x150') && !chosenUrl.includes('100x100')) {
              slides.push(chosenUrl);
            }
          }

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

          resolve({ slides, caption });
        } catch {
          resolve({ slides: [], caption: '' });
        }
      });
    }).on('error', () => resolve({ slides: [], caption: '' }));
  });
}

function toProxyUrl(rawUrl) {
  const cleaned = cleanUrl(rawUrl);
  if (!cleaned) return '';
  if (cleaned.startsWith('/api/instagram?img=')) return cleaned;
  if (cleaned.startsWith('http') && (cleaned.includes('cdninstagram.com') || cleaned.includes('fbcdn.net'))) {
    return `/api/instagram?img=${encodeURIComponent(cleaned)}`;
  }
  return cleaned;
}

function fetchImageBuffer(imageUrl, redirects = 3) {
  return new Promise((resolve, reject) => {
    https.get(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
        'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
      }
    }, (imgRes) => {
      if (imgRes.statusCode && imgRes.statusCode >= 300 && imgRes.statusCode < 400 && imgRes.headers.location && redirects > 0) {
        imgRes.resume();
        return resolve(fetchImageBuffer(imgRes.headers.location, redirects - 1));
      }
      if (imgRes.statusCode !== 200) {
        imgRes.resume();
        return reject(new Error(`Upstream image status ${imgRes.statusCode}`));
      }
      const chunks = [];
      imgRes.on('data', chunk => chunks.push(chunk));
      imgRes.on('end', () => {
        resolve({
          buffer: Buffer.concat(chunks),
          contentType: imgRes.headers['content-type'] || 'image/jpeg'
        });
      });
      imgRes.on('error', reject);
    }).on('error', reject);
  });
}

async function fetchInstagramCarousel(urlOrCode) {
  try {
    const match = urlOrCode.match(/\/(?:p|reel|tv)\/([A-Za-z0-9_-]+)/);
    const shortcode = match ? match[1] : urlOrCode.replace(/^\/+|\/+$/g, '').trim();

    if (!shortcode) {
      return {
        success: false,
        images: [],
        caption: '',
        parsed: parseCaption(''),
        error: 'No se pudo detectar el código de publicación de Instagram.'
      };
    }

    // 1. Try Googlebot crawler first to extract all carousel slides
    const botResult = await fetchWithGooglebot(shortcode);
    if (botResult && botResult.slides && botResult.slides.length > 0) {
      return {
        success: true,
        shortcode,
        images: botResult.slides.map(toProxyUrl),
        caption: botResult.caption,
        parsed: parseCaption(botResult.caption)
      };
    }

    // 2. Fallback to embed
    const embedResult = await fetchWithEmbed(shortcode);
    if (embedResult && embedResult.slides && embedResult.slides.length > 0) {
      return {
        success: true,
        shortcode,
        images: embedResult.slides.map(toProxyUrl),
        caption: embedResult.caption,
        parsed: parseCaption(embedResult.caption)
      };
    }

    return {
      success: false,
      images: [],
      caption: '',
      parsed: parseCaption(''),
      error: 'No se pudieron extraer fotos para esta publicación de Instagram. Comprobá que sea pública.'
    };
  } catch (err) {
    return {
      success: false,
      images: [],
      caption: '',
      parsed: parseCaption(''),
      error: err?.message || 'Error inesperado al conectar con Instagram'
    };
  }
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url, img } = req.query || {};

  // Image proxy mode to bypass Instagram CDN CORS / regional / tracking blocks and cache at Vercel Edge
  if (img && typeof img === 'string') {
    try {
      let targetUrl = cleanUrl(img);
      if (targetUrl.startsWith('/api/instagram?img=')) {
        targetUrl = decodeURIComponent(targetUrl.slice('/api/instagram?img='.length));
      }
      const { buffer, contentType } = await fetchImageBuffer(targetUrl);
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, s-maxage=31536000, immutable');
      return res.status(200).send(buffer);
    } catch (err) {
      return res.status(502).json({ success: false, error: err?.message || 'Error al cargar imagen de Instagram' });
    }
  }

  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, error: 'Falta el parámetro url' });
  }

  try {
    const result = await fetchInstagramCarousel(url);
    return res.status(200).json(result);
  } catch (err) {
    return res.status(500).json({ success: false, error: err?.message || 'Error del servidor' });
  }
}

