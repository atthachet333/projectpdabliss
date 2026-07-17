import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
    plugins: [
        react(),
        {
            name: 'pda-seo-dev-proxy',
            configureServer(server) {
                const handler = async (req, res, next) => {
                    if (req.url !== '/sitemap.xml' && req.url !== '/robots.txt') {
                        next();
                        return;
                    }
                    const response = await fetch(`http://localhost:4547${req.url}`);
                    res.statusCode = response.status;
                    res.setHeader('content-type', response.headers.get('content-type') ?? 'text/plain');
                    res.end(await response.text());
                };
                server.middlewares.stack.unshift({ route: '', handle: handler });
            },
        },
    ],
    server: {
        port: 4546,
        strictPort: true,
        proxy: {
            '/api': 'http://localhost:4547',
            '/sitemap.xml': 'http://localhost:4547',
            '/robots.txt': 'http://localhost:4547',
        },
    },
    preview: { port: 4546, strictPort: true },
});
