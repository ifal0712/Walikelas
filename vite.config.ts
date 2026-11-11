import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import { GoogleGenAI } from '@google/genai';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'gemini-api-endpoint',
        configureServer(server) {
          server.middlewares.use('/api/gemini', async (req, res) => {
            if (req.method !== 'POST') {
              res.statusCode = 405;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ error: 'Method not allowed' }));
              return;
            }

            let body = '';
            req.on('data', chunk => {
              body += chunk;
            });

            req.on('end', async () => {
              try {
                const parsed = JSON.parse(body || '{}');
                const prompt = parsed.prompt;
                const systemInstruction = parsed.systemInstruction || 'Anda adalah Asisten Manajemen Wali Kelas Profesional di sekolah Indonesia.';

                const apiKey = process.env.GEMINI_API_KEY;
                if (!apiKey) {
                  res.statusCode = 200;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({
                    text: 'Catatan: GEMINI_API_KEY belum disetel di lingkungan. Menggunakan mode analisis cerdas lokal terintegrasi.',
                    isFallback: true
                  }));
                  return;
                }

                const ai = new GoogleGenAI({ apiKey });
                const response = await ai.models.generateContent({
                  model: 'gemini-3.8-flash',
                  contents: prompt,
                  config: {
                    systemInstruction,
                    temperature: 0.6,
                  }
                });

                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  text: response.text || '',
                  isFallback: false
                }));
              } catch (error: any) {
                console.error('Gemini API Error:', error);
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({
                  error: error?.message || 'Gagal memproses permintaan AI',
                }));
              }
            });
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
