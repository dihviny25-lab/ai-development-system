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
5. Use `docs/ADOPTION.md` to bring the system into an existing repository.
6. Use `commands/README.md` as the reusable command interface.

## Repository structure

```text
AGENTS.md
agents/
  orchestrator.md
  discovery.md
  architecture.md
  implementation.md
  ux-audit.md
  security-audit.md
  database-audit.md
  performance-audit.md
  reliability-audit.md
  regression-audit.md
  quality-gate.md
  ship.md
commands/
  README.md
docs/
  V2.md
  PROTOCOL.md
  QUALITY.md
  DEFINITION_OF_DONE.md
  ADOPTION.md
  PRODUCT.md
  ARCHITECTURE.md
  DECISIONS.md
profiles/
  typescript-supabase-vercel.md
.github/
  ISSUE_TEMPLATE/
  PULL_REQUEST_TEMPLATE.md
  workflows/
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