# Optional Profile: TypeScript + Supabase + Vercel

This profile specializes the generic protocol for a common SaaS stack. It is guidance, not a mandatory core dependency.

## Typical verification mapping

Use the repository's actual scripts. Common layers may include:
- formatter/linter (Biome or ESLint);
- `tsc`/framework type checking;
- unit/integration tests;
- production build;
- Playwright or equivalent critical-flow E2E;
- Vercel preview validation.

Never invent script names or disable checks when adopting this profile.

## Supabase data/auth audit

Pay special attention to:
- RLS enabled where required;
- policy behavior for anon/authenticated/service roles;
- server-side authorization beyond UI visibility;
- `select('*')`/over-fetching;
- repeated queries inside loops/maps;
- sequential calls that could be batched;
- RPC security/authorization;
- migrations, constraints, indexes, and data backfill;
- storage bucket access policies;
- service-role key confinement to trusted server environments;
- auth redirect/OTP flows and environment-specific URLs.

## Migration workflow

For R3 production migrations:
1. review SQL and affected objects;
2. identify data assumptions/preconditions;
3. determine locking/runtime implications where material;
4. define verification queries/checks;
5. define recovery/rollback strategy appropriate to the migration;
6. obtain required human approval;
7. apply through the project's approved mechanism;
8. validate schema/data and application flow afterward.

## Vercel preview

A successful build is not equivalent to a valid preview. When user-visible behavior or runtime integrations changed, verify the deployed preview against the intended environment and data/schema prerequisites.

Check for environment mismatch: a preview can run correct code against an incompatible database/configuration.

## PWA considerations when applicable

Audit:
- service-worker/cache invalidation;
- stale assets/data;
- offline fallback behavior;
- install/update behavior;
- manifest/icons;
- destructive or auth-dependent actions while offline.

## Observability progression

Do not force an enterprise stack on a small project. Start with actionable error reporting and deployment/runtime visibility; add traces/metrics/performance budgets when scale or debugging cost justifies them.