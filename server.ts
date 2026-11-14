import express from 'express';
import path from 'path';
import https from 'node:https';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Audio TTS proxy endpoint (works on all devices, iOS, Android, Desktop)
app.get('/api/tts', (req, res) => {
  try {
    const text = req.query.text as string;
    if (!text) {
      res.status(400).send('Missing text query parameter');
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
          res.status(upstreamRes.statusCode || 500).send('TTS upstream error');
          return;
        }

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.setHeader('Access-Control-Allow-Origin', '*');
        upstreamRes.pipe(res);
      }
    );

    request.on('error', (err) => {
      res.status(500).send(err.message);
    });
  } catch (err: any) {
    res.status(500).send(err.message || 'Internal error');
  }
});

async function startServer() {
  if (!isProduction) {
    // Development mode: mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: Number(PORT),
        host: '0.0.0.0',
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: serve built assets from dist
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT} (${isProduction ? 'production' : 'development'})`);
  });
}

startServer();
