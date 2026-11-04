import react from '@vitejs/plugin-react';
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
          const igUrl = urlObj.searchParams.get('url');
          if (!igUrl) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: false, error: 'Falta el parámetro url' }));
            return;
          }
          try {
            const publicPropsDir = path.resolve(__dirname, 'public/properties');
            const result = await fetchInstagramCarousel(igUrl, publicPropsDir);
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
