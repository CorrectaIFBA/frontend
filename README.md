# Correcta — web

Vite + React + TypeScript, TanStack Router (file routes) and Query, React Hook Form + Zod,
Framer Motion, shadcn/ui on Tailwind v4.

```sh
bun install
cp .env.example .env   # adjust IDENTITY_SERVICE_PROXY_TARGET if the service is not on :8080
bun dev                # http://localhost:5173
```

In development the browser calls `/api/identity/*`; Vite forwards it to the identity
service with the `Origin` header removed, so the service's CORS list needs no change.
In production set `VITE_IDENTITY_API_URL` to the service's public base URL.

## Routes

| Path | What |
| --- | --- |
| `/login` | Sign in. Further accounts are added from the profile menu (modal). |
| `/account-activation/$token` | First access: create password with the e-mailed token. |
| `/activate-account/$token` | Alias; the activation e-mail currently links here. |
| `/` and `/_app/*` | Authenticated shell (sidebar, search, account menu). |

## Session model (`src/lib/auth`)

- **Accounts** (`account-store.ts`): every account signed in on this browser, with its
  refresh token, in `localStorage`. The active one is shared by all tabs.
- **Access tokens** (`token-manager.ts`): persisted per account until expiry, so reloads and new tabs reuse them instead of refreshing.
- **Refresh**: proactive, shortly before expiry, only in visible tabs. Concurrent callers in
  a tab share one request; tabs coordinate through a Web Lock plus a `BroadcastChannel`, so a
  rotated refresh token is never redeemed twice. A 401 forces one refresh and one retry.
- **Expiry**: a refresh rejected with 401/403 drops that account and sends every tab to login.
