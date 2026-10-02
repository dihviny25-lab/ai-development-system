# Optional Profile: Next.js + Prisma + PostgreSQL

This profile specializes the generic protocol for Next.js (App Router) applications using Prisma against PostgreSQL. It is guidance, not a mandatory core dependency.

## Typical verification mapping

Use the repository's actual scripts. Common layers may include:
- ESLint (`next lint` or flat config) and a formatter;
- `tsc --noEmit` type checking;
- unit tests (Vitest or Jest);
- integration tests against a disposable Postgres (container or database branch), with `prisma migrate deploy` applied;
- `next build` — also catches server/client boundary and route config errors;
- Playwright or equivalent E2E for critical journeys;
- preview deployment validation.

Never invent script names or disable checks when adopting this profile.

## Server/client boundary

- Server Actions and Route Handlers are public HTTP endpoints. Authenticate and authorize inside every one; hiding a button is not authorization.
- Validate Server Action inputs at the boundary (for example with a schema library already in the project). Types are erased at runtime.
- Never import server-only modules (Prisma client, secrets) into client components. Prefer `import 'server-only'` in modules that must not leak.
- Only `NEXT_PUBLIC_*` variables reach the browser; audit any new one as a potential secret exposure.
- Middleware is not a complete authorization layer: it can be bypassed by misconfigured matchers. Enforce authorization at the data access point too.

## Caching and data freshness

- Know which fetches/routes are statically cached. A mutation that does not `revalidatePath`/`revalidateTag` the affected data leaves users seeing stale state.
- Personalized or tenant-scoped data must never be cached in a shared (cross-user) cache.
- Verify cache behavior in a production build (`next build && next start`) or preview; dev mode behaves differently.

## Prisma data access

Pay special attention to:
- tenant scoping on every query (`where: { workspaceId }`) — consider a scoped helper or Prisma extension rather than relying on each call site;
- N+1: `findMany` inside loops/`map`; prefer `include`/`select` or a batched `where: { id: { in } }`;
- over-fetching: default `findMany` returns all scalar columns — use `select` for large/sensitive fields;
- pagination for plausibly large collections (cursor pagination for feeds);
- `$transaction` for multi-write invariants; interactive transactions hold a connection — keep them short;
- unique constraints for idempotency instead of check-then-insert;
- raw queries: `$queryRaw` tagged templates are parameterized; `$queryRawUnsafe` with interpolated input is an injection risk;
- connection limits in serverless environments (pooler/`connection_limit`).

## Migration workflow

- `prisma migrate dev` is for local development only; production uses `prisma migrate deploy` through the project's approved mechanism.
- Review the generated SQL, not only `schema.prisma`. Renames can be generated as drop + add (data loss).
- Adding a required column to a populated table needs a default or a backfill in steps (expand/contract).
- For R3 migrations, fill `templates/MIGRATION_RUNBOOK.md` and obtain human approval.
- `prisma db push` against shared or production databases bypasses migration history — do not use it there.

## Preview validation

A successful build is not a valid preview. Confirm the preview points to a database whose schema matches the branch's migrations, and that required environment variables exist for the preview environment.

## Observability progression

Start with error reporting for server and client, plus request logs that include route and status without personal data. Add Prisma query logging or tracing when debugging data performance justifies it.
