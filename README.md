# AI Development System

A vendor-independent, evidence-driven operating system for building software with AI agents without sacrificing engineering quality.

## Core principle

> Code written is not work completed. Completion requires verifiable evidence.

## Lifecycle

`DISCOVERY → CONTEXT → ARCHITECTURE → PLAN → IMPLEMENT → VERIFY → QUALITY GATE → SHIP → OBSERVE`

## v2 operating model

Version 2 adds an orchestrator, specialist-agent contracts, proportional R0–R3 risk profiles, reusable lifecycle commands, an evidence contract, incremental adoption guidance, and optional stack profiles.

The system is deliberately **risk-based**: a typo does not receive the same ceremony as an authorization or production database change.

## Start here

1. Read `AGENTS.md` for non-negotiable agent behavior.
2. Read `docs/V2.md` for orchestration, risk profiles, and evidence contracts.
3. Read `docs/PROTOCOL.md` for the lifecycle.
4. Read `docs/QUALITY.md` for the 10 quality gates and P0–P3 findings.
5. Use `docs/ADOPTION.md` and `scripts/adopt.sh` to bring the system into an existing repository.
6. Use `commands/README.md` as the reusable command interface; Claude Code users get them as `/ads-*` slash commands.
7. See `examples/` for a full R3 walkthrough and a minimal R0 change.

## Using it with your AI client

| Client | Entry point |
|---|---|
| Claude Code | `CLAUDE.md` (imports `AGENTS.md`) and `/ads-discover`, `/ads-plan`, `/ads-feature`, … from `.claude/commands/` |
| Codex and other `AGENTS.md`-aware clients | `AGENTS.md` |
| Cursor | `adapters/cursor/` |
| GitHub Copilot | `adapters/copilot/` |

See `adapters/README.md`.

## Adopting in another repository

```bash
# Preview what level 1 (guardrails) would add — writes nothing
scripts/adopt.sh ../my-app

# Apply level 3 with a stack profile and client adapters
scripts/adopt.sh --level 3 --profile nextjs-prisma-postgres --adapters --apply ../my-app
```

The script never overwrites existing files and does not copy CI workflows; wire your repository's real checks yourself (`docs/ADOPTION.md`).

## Validating this repository

```bash
python3 scripts/validate.py
```

CI runs the same validator, plus shellcheck and an adoption smoke test.

`validate.py` proves the files are well formed, not that an agent obeys them. To check behavior with a real model (costs API usage, non-deterministic):

```bash
scripts/eval-commands.sh          # needs the `claude` CLI and credentials
```

It runs `/ads-discover` and `/ads-plan` in throwaway repositories and asserts objective facts: discovery changes no files, and a destructive authorization + migration change is classified R3 with an approval requirement. It is opt-in (the manual "Command Evals" workflow) and never gates pull requests. Exit code 77 means skipped or inconclusive, which verifies nothing.

## Repository structure

```text
AGENTS.md                 non-negotiable agent rules (single source of truth)
CLAUDE.md                 Claude Code entry point (imports AGENTS.md)
.claude/commands/         /ads-* slash commands for Claude Code
agents/                   orchestrator and specialist contracts
  orchestrator.md  discovery.md  architecture.md  implementation.md
  ux-audit.md  security-audit.md  database-audit.md  performance-audit.md
  reliability-audit.md  regression-audit.md  quality-gate.md  ship.md
commands/README.md        conceptual lifecycle commands
docs/                     V2, protocol, quality gates, DoD, adoption, context templates
templates/                evidence report, migration runbook, post-deploy report
examples/                 worked R0 and R3 walkthroughs
profiles/                 optional stack profiles
  typescript-supabase-vercel.md  nextjs-prisma-postgres.md
  python-fastapi-postgres.md     react-native-expo.md
adapters/                 Cursor and Copilot adapters
scripts/
  adopt.sh                incremental, non-destructive adoption
  validate.py             structure and contract validation (used by CI)
.github/
  ISSUE_TEMPLATE/         feature, bug
  PULL_REQUEST_TEMPLATE.md
  workflows/quality.yml
```

## Design goals

- Make AI-assisted development repeatable instead of prompt-dependent.
- Preserve existing behavior and architecture unless change is explicitly justified.
- Require acceptance criteria and evidence before declaring work complete.
- Separate investigation, planning, implementation, verification, and shipping.
- Apply quality gates proportionally instead of blindly overengineering.
- Allow specialist agents without surrendering orchestration or scope control.
- Keep humans in control of destructive and materially production-sensitive operations.
- Remain usable across AI vendors and application stacks.

## What belongs in a project

The core protocol should stay generic. Each adopting repository supplies its real product context, architecture, commands/scripts, deployment details, critical journeys, invariants, and project-specific approval boundaries.

## Public-safety rule

Never put secrets, credentials, private customer data, production records, or private-project details into this public template, its examples, Issues, PRs, or logs.