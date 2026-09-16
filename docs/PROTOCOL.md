# Development Protocol v1

## 0. Principle

Quality must be a property of the process, not something an agent remembers at the end.

The protocol is risk-based. Small changes use a lightweight version; high-risk changes require deeper evidence.

## 1. DISCOVERY

Goal: understand the problem before changing the system.

Determine:
- product/user outcome;
- current behavior;
- desired behavior;
- relevant code and dependencies;
- constraints;
- risks;
- acceptance criteria;
- out-of-scope work.

**Gate:** the agent can explain what exists, what must change, what must remain unchanged, and how success will be proven.

## 2. CONTEXT

Read and reconcile repository context. Do not trust stale documentation over observed implementation; record meaningful drift.

Minimum useful context:
- product purpose and users;
- architecture and boundaries;
- quality/security requirements;
- relevant historical decisions.

**Gate:** assumptions and unknowns are explicit.

## 3. ARCHITECTURE

For material changes, define the architecture impact before implementation.

Review:
- frontend/backend boundaries;
- domain/data ownership;
- database changes;
- authentication and authorization;
- external services;
- failure modes;
- invariants.

Example invariant: `A tenant must never read or mutate another tenant's data.`

**Gate:** the proposed change respects or deliberately updates documented invariants.

## 4. PLAN

A material task should have:
- problem statement;
- expected outcome;
- acceptance criteria;
- implementation approach;
- test/validation plan;
- risks;
- explicit non-goals.

Prefer an Issue for important work and a dedicated branch.

**Gate:** implementation can be executed without inventing product decisions mid-task.

## 5. IMPLEMENT

Implement the minimum cohesive change needed to satisfy acceptance criteria.

Rules:
- preserve unrelated behavior;
- avoid opportunistic refactors;
- reuse existing patterns when sound;
- do not weaken security or integrity for convenience;
- record discoveries outside current scope.

**Gate:** implementation is reviewable and traceable to acceptance criteria.

## 6. VERIFY

Use applicable layers:

`static analysis → typecheck → unit → integration → build → E2E → preview → manual validation`

The exact stack varies by project. Evidence matters more than tool names.

**Gate:** failures are resolved or explicitly documented; unexecuted high-value checks have a reason.

## 7. QUALITY GATE

Audit applicable quality dimensions defined in `QUALITY.md`.

Classify findings P0/P1/P2/P3. Do not silently fix unrelated findings. P0/P1 normally block shipping. P2/P3 may be deferred with tracking and rationale.

**Gate:** applicable quality dimensions have evidence, not assumptions.

## 8. SHIP

Recommended path:

`Issue → branch → implementation → verification → quality gate → PR → review → preview → manual validation → merge → production → post-deploy check`

PR creation is not deployment. Merge is not proof of correct production behavior.

**Gate:** shipping decision is based on known evidence and remaining risk.

## 9. OBSERVE / ITERATE

For production-relevant changes, verify operational behavior after deployment when possible:
- errors;
- latency;
- failed jobs;
- unusual query volume;
- user-impacting regressions;
- relevant business/technical metrics.

Feed meaningful findings back into Issues, tests, documentation, and future quality gates.

## Scope discipline

When an audit discovers unrelated problems:
1. record evidence;
2. classify severity;
3. determine whether it blocks current work;
4. create/prepare a follow-up when appropriate;
5. do not expand the implementation automatically.

## Evidence report

A finished work report should make it possible for another engineer to answer:
- What changed?
- Why?
- What was tested?
- What evidence proves the acceptance criteria?
- What was not tested?
- What risks remain?
- What follow-ups exist?