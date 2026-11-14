import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import https from 'node:https';
import { URL } from 'node:url';
import { defineConfig, Plugin } from 'vite';
base: '/English/',

function ttsPlugin(): Plugin {
  const handleTts = (req: any, res: any) => {
    try {
      const reqUrl = new URL(req.url || '', `http://${req.headers.host || 'localhost:3000'}`);
      const text = reqUrl.searchParams.get('text');
      if (!text) {
        res.statusCode = 400;
        res.end('Missing text query parameter');
        return;
      }

      const encoded = encodeURIComponent(text.slice(0, 300));
      const upstreamUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en&client=tw-ob&q=${encoded}`;

      const request = https.get(
        upstreamUrl,
        {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          },
        },
        (upstreamRes) => {
          if (upstreamRes.statusCode !== 200) {
            res.statusCode = upstreamRes.statusCode || 500;
            res.end('Upstream TTS error');
            return;
          }

          res.writeHead(200, {
            'Content-Type': 'audio/mpeg',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*',
          });
          upstreamRes.pipe(res);
        }
      );

      request.on('error', (err) => {
        res.statusCode = 500;
        res.end(err.message);
      });
    } catch (err: any) {
      res.statusCode = 500;
      res.end(err.message || 'Internal error');
    }
  };

  return {
    name: 'tts-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/tts', handleTts);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/api/tts', handleTts);
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), ttsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

