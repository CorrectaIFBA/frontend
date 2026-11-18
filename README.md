# Correcta — web

Vite + React + TypeScript, TanStack Router (file routes) and Query, React Hook Form + Zod,
Framer Motion, shadcn/ui on Tailwind v4.

```sh
bun install
cp .env.example .env   # adjust CORE_SERVICE_PROXY_TARGET if the gateway proxy is not on :8080
bun dev                # http://localhost:5173
```

The backend is `core-service`: one process with the identity, cohort, assessment,
workspace and evaluation modules. The browser keeps one prefix per module
(`/api/identity`, `/api/cohort`, `/api/assessment`, `/api/workspace`, `/api/evaluation`).
In development Vite forwards all five to the local gateway proxy (`local/run proxy`,
`CORE_SERVICE_PROXY_TARGET`, default `:8080`), with the `Origin` header removed. The
gateway strips the prefix, authenticates every route except `/api/identity`, adds the
`X-User-*` headers and forwards to core-service. `/api/code-intel` is a separate service
(`CODE_INTEL_SERVICE_PROXY_TARGET`). In production set the `VITE_*_API_URL` variables to
the gateway's public base URLs.

## Routes

| Path | What |
| --- | --- |
| `/login` | Sign in. Further accounts are added from the profile menu (modal). |
| `/account-activation/$token` | First access: create password with the e-mailed token. |
| `/activate-account/$token` | Alias; the activation e-mail currently links here. |
| `/` and `/_app/*` | Authenticated shell (sidebar, search, account menu). |
| `/classes` | Cohorts (turmas) the profile owns or belongs to; faculty create them, everyone joins by code. |
| `/classes/$cohortId/$slug` | A cohort: activities, members and, for faculty, `manage`. |
| `/classes/$cohortId/$slug/activities/$assessmentId` | One activity (assessment): instructions, rules and, for faculty, publishing. |
| `/classes/join/$code` | Shared invitation-code link; joins after confirmation. |
| `/classes/invitation/$cohortId` | Accepts a direct invitation to the cohort. |

The cohort module is called at `/api/cohort/api/v1`.

Activities (assessments) work the same way: the assessment module is called at
`/api/assessment/api/v1`. The module lists them one cohort at a time, so they live inside the cohort page.

The student's code lives in the workspace module, called at `/api/workspace`. The coding page follows
`workspace-service/docs/frontend-integration-guide.md`: it opens every question's
workspace up front, autosaves 2 s after the last keystroke with `If-Match`, resolves
412s (a lost answer is adopted, another window's save asks the student), keeps unsaved
text in `localStorage`, lets one tab per activity edit (Web Lock), and submits per
question or the whole activity. The logic is in `src/lib/workspace/draft-syncer.ts`;
the page side in `src/components/assessments/use-workspaces.ts` and `workspace-panels.tsx`.

Run results come live from the evaluation module over a WebSocket,
`/api/evaluation/ws/workspaces/{workspaceId}/previews` (forwarded by Vite, `ws: true`). Browsers cannot send `Authorization` on a
WebSocket, so `src/lib/api/evaluations.ts` puts the access token in the
`correcta-access-token` cookie, scoped to the socket's path, just before the upgrade,
and clears it once the socket opens. The gateway reads it there. The page side is in
`src/components/assessments/use-preview-execution.ts` and `preview-results.tsx`.

## Session model (`src/lib/auth`)

- **Accounts** (`account-store.ts`): every account signed in on this browser, with its
  refresh token, in `localStorage`. The active one is shared by all tabs.
- **Access tokens** (`token-manager.ts`): persisted per account until expiry, so reloads and new tabs reuse them instead of refreshing.
- **Refresh**: proactive, shortly before expiry, only in visible tabs. Concurrent callers in
  a tab share one request; tabs coordinate through a Web Lock plus a `BroadcastChannel`, so a
  rotated refresh token is never redeemed twice. A 401 forces one refresh and one retry.
- **Expiry**: a refresh rejected with 401/403 drops that account and sends every tab to login.
