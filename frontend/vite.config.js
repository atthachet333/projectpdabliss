import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
const productionBackendTarget = 'https://pdabliss.chaiyadetprogress.com';
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    const backendTarget = env.VITE_DEV_BACKEND_TARGET || productionBackendTarget;
    return {
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
                        const response = await fetch(`${backendTarget}${req.url}`);
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
                '/api-proxy': {
                    target: backendTarget,
                    changeOrigin: true,
                    secure: false,
                    cookieDomainRewrite: '',
                    rewrite: path => path.replace(/^\/api-proxy/, ''),
                },
                '/sitemap.xml': backendTarget,
                '/robots.txt': backendTarget,
            },
        },
        preview: { port: 4546, strictPort: true },
    };
});
