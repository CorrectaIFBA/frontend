# CLAUDE-GENERIC.md

Behavioral and structural rules for refactoring **any TypeScript frontend or backend**. Copy this file into a project as `CLAUDE.md`, then fill in the "Project facts" block at the end.

**Tradeoff:** these rules favor safety over speed. For trivial edits, use judgment.

## 1. Think Before Coding

**Do not assume. Do not hide confusion. Surface tradeoffs.**

- State assumptions explicitly. If uncertain, ask.
- If several interpretations exist, present them. Do not pick silently.
- If a simpler approach exists, say so and push back.
- If something is unclear, stop, name what is confusing, and ask.

## 2. Simplicity First

**The minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstraction for code used once.
- No configurability nobody requested.
- No error handling for impossible scenarios.
- If 200 lines could be 50, rewrite them.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

- Do not improve adjacent code, comments or formatting.
- Match the existing style unless the task is to change it.
- Remove imports and variables that your change made unused.
- Mention unrelated dead code. Do not delete it.
- Every changed line traces to the request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

- Refactor: tests and types pass before and after; behavior is identical.
- Fix: reproduce with a test, then make it pass.
- For multi-step work, state a short plan with a check per step.

## 5. Refactoring Protocol

1. **Baseline.** Run typecheck, lint and tests. Record the result. If the project has no git history, copy the source tree somewhere safe first.
2. **Map.** List the files, their size, and the responsibilities each one mixes. List every public entry point (routes, exports, components).
3. **Design.** Pick the target structure (section 6 for backend, 7 for frontend). Write the file-by-file mapping before moving code.
4. **Move, then clean.** Move code first with bodies unchanged. Change logic only in a separate step.
5. **Rename with tooling.** Use the TypeScript language service (or the IDE rename) so every reference changes together. Never rename with search and replace.
6. **Verify after each module.** Typecheck and tests must stay green. The public surface (routes, exports) must be identical. Diff the route list or export list before and after.
7. **Report honestly.** State what was verified, what was not, and any behavior change, even a small one.

## 6. Backend: Feature Modules, Service Layer, Repository Pattern

**One feature, one folder. One responsibility, one file.**

```
src/
  modules/<feature>/
    <feature>.routes.ts       HTTP only: paths, request schemas, call the service
    <feature>.service.ts      business rules, permissions, events, orchestration
    <feature>.repository.ts   every database query for the feature
    <feature>.schemas.ts      request/response schemas shared by several routes
    <feature>.views.ts        shaping data for the client
  shared/                     errors, guards, text, pagination: used by several features
  infra/ (db, gateway, bus)   clients and connections
  app.ts                      composition only
```

- Routes parse and delegate. Services decide. Repositories query. Never mix them.
- Services do not import the database client. They call repositories and use one transaction helper for units of work.
- Repository functions that can run in a transaction accept an executor as the last parameter, defaulting to the database client.
- Split a service when it holds more than one responsibility (`<feature>.admin.service.ts`, `<feature>.moderation.service.ts`).
- Cross-feature reads may use another module's repository. Cross-feature writes go through that module's service.
- Shared code lives once, in `shared/`. Do not copy helpers between modules.
- The composition root registers each feature's routes and nothing else.
- Keep the HTTP contract identical during a refactor: same paths, methods, status codes and response shapes.

## 7. Frontend: Feature-Sliced Design

**Layers, slices, segments. One component per file.**

Layers, top to bottom: `app` > `pages` > `widgets` > `features` > `entities` > `shared`.

- Import only from lower layers. Never upward.
- Slices in the same layer do not import each other. Share through a lower layer. The only exception is an entity's `@x` cross-import API.
- Each slice exposes a public API (`index.ts`). Import through it, never through internals.
- Segments by purpose: `ui` (components), `model` (hooks, state, logic), `api` (requests, loaders), `lib` (pure helpers), `config` (constants).
- `shared` holds generic code with no business knowledge.
- The router folder only declares routes and renders pages.

Components:
- **One component per file**, named like the file. Extract private sub-components that exceed a few lines into their own files.
- Components render. Fetching, subscriptions and derived state live in hooks or loaders.
- Split a component past about 150 lines or when it mixes layout, state and behavior.
- Type props explicitly as `<Component>Props`.
- Do not duplicate a component across slices. Move it to the lowest layer all users can reach.

If the project uses another frontend structure (Next.js app router, feature folders), keep its conventions for routing and apply the same rules inside it: one component per file, logic out of components, public APIs, no upward imports.

## 8. Naming

**Long, explanatory names. No single letters except loop indices where the meaning is obvious.**

- Callback parameters are the singular of what they iterate: `boards.map((board) => ...)`.
- A variable from a lookup is named after it: `const member = await findMemberByNick(nick)`.
- Maps keyed by id say what they hold: `authorsById`.
- Sort comparators use `first` and `second`.
- Do not shadow imports or table constants. Add a suffix such as `Row` when a name is taken.
- Files are kebab-case and named after the one thing they hold.
- Booleans read as questions: `isHidden`, `hasAccess`. Functions are verbs: `loadThread`, `setPostHidden`.

## 9. Spacing

**Blank lines separate groups of statements, not every statement.**

- Consecutive single-line guards (`if (...) throw ...`) stay together.
- Consecutive single-line declarations stay together.
- Consecutive assignments stay together.
- Consecutive single-line `await` calls stay together.
- Synchronous calls form a separate group from `await` calls.
- Multi-line statements always have a blank line before and after.
- `return` has a blank line before it, unless it is the only statement.
- Top-level constants and imports are not split.

```ts
export async function postShout(content: string, actor: Viewer) {
  const text = content.trim()

  if (!text || text.length > MAX_SHOUT) throw invalid('Invalid length.')
  if (await activeBan(actor.id)) throw forbidden('Banned.')

  const row = await repository.insertShout({ authorId: actor.id, content: text })
  const authorsById = await authors([actor.id])

  await publish({ room: 'shoutbox', type: 'shout.created' })

  return { shout: row }
}
```

## 10. Quality Checklist

Before calling a refactor done:

- [ ] No file mixes responsibilities (routes with queries, components with fetching, services with SQL).
- [ ] No file is large because it holds several features or several components.
- [ ] No duplicated helper. Each lives once in the lowest shared place.
- [ ] No single-letter names left outside obvious indices.
- [ ] No dead code, commented-out code or unused exports introduced.
- [ ] Typecheck, lint and tests pass.
- [ ] Public surface (routes, exports, props of public components) is unchanged, or the change is reported.
- [ ] Spacing follows section 9.

## Project facts (fill in per project)

- Runtime and package manager: Bun, Vite 8, React 19, TanStack Router (file routes) and Query.
- Verification commands (typecheck, lint, test, build): `bun run typecheck`, `bun run build`. No linter or tests are configured yet.
- Source root and path alias: `src/`, `@/*` maps to `src/*`.
- Frontend structure in use (FSD or other): FSD. `src/routes/` holds TanStack route declarations only; route components live in `pages/`, layouts in `app/layouts/`. Pages read their route through `getRouteApi('<route id>')`, never by importing the route file.
- Backend: every API the frontend calls is served by `core-service/`. Backend changes go there, never to the legacy `*-service/` folders (see the repository's root `CLAUDE.md`).
- Known exceptions to these rules:
  - `shared/ui` keeps shadcn primitive families (dialog, dropdown-menu, sheet, sidebar, form, avatar, tooltip) as one file each.
  - `shared` segments are imported per file (`@/shared/ui/button`), not through an index.
  - Components may call `useQuery(xQueryOptions(...))` directly; query options live in `shared/api`. Mutations with side effects and multi-step state live in `model/` hooks.
