import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchInstagramCarousel } from '../src/lib/instagramExtractor';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { url } = req.query;
  if (!url || typeof url !== 'string') {
    return res.status(400).json({ success: false, error: 'Falta el parámetro url' });
  }

  try {
    const result = await fetchInstagramCarousel(url);
    return res.status(200).json(result);
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err?.message || 'Error del servidor' });
  }
}
