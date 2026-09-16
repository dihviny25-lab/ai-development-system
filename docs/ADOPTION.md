# Adoption Guide

The system is designed to be adopted incrementally. Do not copy every file into an existing repository and assume the job is done.

## Level 1 — Guardrails

Add/adapt:
- `AGENTS.md`;
- Definition of Done;
- PR template;
- secret hygiene;
- existing project checks in CI.

Goal: agents stop equating code generation with completion.

## Level 2 — Context

Document:
- product/users/critical journeys;
- actual architecture;
- trust boundaries;
- invariants;
- important historical decisions.

Goal: agents make fewer destructive assumptions.

## Level 3 — Workflow

Adopt:
- Issue → plan → branch → implementation → verification → PR;
- R0–R3 risk profiles;
- evidence reports;
- quality findings P0–P3.

Goal: work becomes repeatable and reviewable.

## Level 4 — Specialist gates

Use bounded specialist audits for the risks the product actually has: security, database, UX/accessibility, performance, reliability, regression.

Goal: parallelize investigation without letting agents expand scope chaotically.

## Level 5 — Delivery/observation

Connect:
- preview environments;
- E2E for critical journeys;
- production observability;
- migration/runbook discipline;
- post-deploy verification.

Goal: evidence continues beyond merge.

## Existing repository adoption checklist

1. Inventory the current stack, scripts, CI, deployment, auth, data layer, and tests.
2. Do not overwrite working conventions blindly.
3. Create `PRODUCT.md` and `ARCHITECTURE.md` from observed reality.
4. Identify 3–10 critical invariants/journeys rather than documenting everything.
5. Map existing scripts to verification layers.
6. Add only applicable quality gates.
7. Pilot the system on one real Issue.
8. Record friction and false positives.
9. Adjust repository-specific rules without weakening core evidence/security principles.
10. Expand adoption after the pilot.

## What belongs in the core vs project

**Core system:** lifecycle, evidence contract, severity, risk profiles, agent behavior, quality dimensions.

**Project repository:** stack commands, architecture, product rules, test accounts policy, deployment details, environment names, database conventions, critical journeys, project-specific human approvals.

## Avoid template cargo cult

A copied workflow that references nonexistent scripts is worse than no workflow. Adapt automation to the repository's actual package manager and scripts. Never disable a failing quality check just to make adoption appear complete.