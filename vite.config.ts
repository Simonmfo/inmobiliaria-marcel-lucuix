import react from '@vitejs/plugin-react';
import https from 'https';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { fetchInstagramCarousel } from './src/lib/instagramExtractor';

function instagramApiPlugin(): Plugin {
  return {
    name: 'instagram-api-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url && req.url.startsWith('/api/instagram')) {
          const urlObj = new URL(req.url, 'http://localhost:3000');
          const imgParam = urlObj.searchParams.get('img');
          if (imgParam) {
            https.get(imgParam, {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
              }
            }, imgRes => {
              res.statusCode = imgRes.statusCode || 200;
              res.setHeader('Content-Type', imgRes.headers['content-type'] || 'image/jpeg');
              res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
              imgRes.pipe(res);
            }).on('error', err => {
              res.statusCode = 502;
              res.end(err.message);
            });
            return;
          }
          const igUrl = urlObj.searchParams.get('url');
          if (!igUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Falta el parámetro url' }));
            return;
          }
          try {
            const result = await fetchInstagramCarousel(igUrl);
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(result));
          } catch (err: any) {
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: err?.message || 'Error del servidor' }));
          }
          return;
        }
        next();
      });
    }
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), instagramApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
