# Stack Profiles

Profiles specialize the generic protocol for a common stack. They are optional guidance: the core (`AGENTS.md`, `docs/`, `agents/`) must never depend on a profile.

## Available profiles

| Profile | Stack |
|---|---|
| [typescript-supabase-vercel.md](typescript-supabase-vercel.md) | TypeScript, Supabase (Postgres + Auth + RLS), Vercel |
| [nextjs-prisma-postgres.md](nextjs-prisma-postgres.md) | Next.js (App Router), Prisma, PostgreSQL |
| [python-fastapi-postgres.md](python-fastapi-postgres.md) | Python, FastAPI, SQLAlchemy/Alembic, PostgreSQL |
| [react-native-expo.md](react-native-expo.md) | React Native, Expo, EAS |

## Writing a profile

A profile must:

1. start with a `# Optional Profile: <stack>` title;
2. include a `## Typical verification mapping` section that maps the generic verification layers to the stack's usual tools, without inventing script names;
3. focus on stack-specific failure modes — where this stack typically loses security, integrity, or performance;
4. reference the core contracts instead of restating them.

A profile must not:

- weaken a core rule (for example, "skip authorization tests because the framework handles it");
- hard-code project-specific names, environments, or credentials;
- require a vendor that the core does not require.

`scripts/validate.py` checks the required title and section.
