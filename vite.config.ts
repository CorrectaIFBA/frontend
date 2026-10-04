import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const identityTarget = env.IDENTITY_SERVICE_PROXY_TARGET || 'http://localhost:8080'

  return {
    plugins: [
      tanstackRouter({
        target: 'react',
        routeToken: 'layout',
        autoCodeSplitting: true,
      }),
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      proxy: {
        /*
          The identity service only trusts its own origins for CORS. In
          development the browser talks to Vite, and Vite forwards to the
          service without an Origin header, so the request reads as
          same-origin on the other side.
        */
        '/api/identity': {
          target: identityTarget,
          changeOrigin: true,
          rewrite: (requestPath) => requestPath.replace(/^\/api\/identity/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyRequest) => {
              proxyRequest.removeHeader('origin')
            })
          },
        },
      },
    },
  }
})
