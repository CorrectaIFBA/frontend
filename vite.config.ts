import path from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // The local gateway proxy (local/run proxy). It strips each /api/<module> prefix and sends the request to core-service.
  const coreTarget = env.CORE_SERVICE_PROXY_TARGET || 'http://localhost:8080'
  const codeIntelTarget = env.CODE_INTEL_SERVICE_PROXY_TARGET || 'http://localhost:8080'

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
          The identity module only trusts its own origins for CORS. In
          development the browser talks to Vite, and Vite forwards to the
          gateway without an Origin header, so the request reads as
          same-origin on the other side.
        */
        '/api/identity': {
          target: coreTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyRequest) => {
              proxyRequest.removeHeader('origin')
            })
          },
        },
        /*
          The other core-service modules trust only the gateway's X-User-*
          headers. The gateway checks the token before it forwards.
        */
        '/api/cohort': {
          target: coreTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyRequest) => {
              proxyRequest.removeHeader('origin')
            })
          },
        },
        '/api/assessment': {
          target: coreTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyRequest) => {
              proxyRequest.removeHeader('origin')
            })
          },
        },
        // Drafts and submissions of the student's code.
        '/api/workspace': {
          target: coreTarget,
          changeOrigin: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyRequest) => {
              proxyRequest.removeHeader('origin')
            })
          },
        },
        /*
          Run results. The WebSocket keeps its Origin: the evaluation module
          checks it on upgrade.
        */
        '/api/evaluation': {
          target: coreTarget,
          changeOrigin: true,
          ws: true,
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyRequest) => {
              proxyRequest.removeHeader('origin')
            })
          },
        },
        // C diagnostics and completions, through the same gateway.
        '/api/code-intel': {
          target: codeIntelTarget,
          changeOrigin: true,
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
