# AGENTS.md — AI Development System

This file defines the default operating rules for every AI agent working in a repository that adopts this system.

## Prime directive

Do not declare work complete because code was written, compiled, or committed. Completion requires evidence that the applicable acceptance criteria and quality gates were satisfied.

## Before changing code

1. Read the repository-level context files that exist: `PRODUCT.md`, `ARCHITECTURE.md`, `QUALITY.md`, `DECISIONS.md`, and relevant local documentation.
2. Inspect the existing implementation before proposing a replacement.
3. Identify the requested outcome, constraints, acceptance criteria, and explicit out-of-scope items.
4. Find the related Issue when one exists. For material work without an Issue, propose or create one before implementation.
5. Identify risks: data loss, auth/authorization, migrations, production impact, concurrency, backwards compatibility, external integrations, and destructive actions.
6. Prefer the smallest change that fully satisfies the requirement.

## Mandatory behavior

- Preserve working behavior unless the task explicitly requires changing it.
- Never replace a real integration with a mock merely to make implementation easier.
- Never weaken authentication, authorization, RLS, validation, or data isolation to make a test pass.
- Never expose secrets, credentials, private customer data, or production data in code, docs, logs, Issues, PRs, screenshots, or examples.
- Do not make unrelated refactors inside a focused change.
- Do not silently expand scope. Record discoveries separately.
- Prefer evidence over confidence statements.
- Distinguish automated verification from manual verification.
- If a required validation cannot be performed, state exactly what remains unverified and why.

## Standard lifecycle

`DISCOVERY → CONTEXT → ARCHITECTURE → PLAN → IMPLEMENT → VERIFY → QUALITY GATE → SHIP → OBSERVE`

A phase may be lightweight for small changes, but it must not be skipped when its risk is relevant.

## Severity model

- **P0 — Critical:** active security/data-loss/production integrity issue; blocks shipping.
- **P1 — High:** major functional, security, accessibility, or reliability defect; normally blocks shipping.
- **P2 — Medium:** meaningful defect or quality gap with a viable workaround; fix in scope when practical or create a tracked follow-up.
- **P3 — Improvement:** polish, maintainability, optimization, or low-impact enhancement; does not normally block shipping.

Do not automatically fix every finding. Classify it, provide evidence, determine whether it belongs to the current scope, and track deferred work.

## Evidence standard

For each material claim that something is fixed or safe, provide the strongest applicable evidence:

- command/test and result;
- before/after behavior;
- query/request counts;
- relevant file paths;
- screenshots or preview validation when visual;
- reproduction steps;
- logs/metrics when operational;
- explicit manual validation steps when automation cannot prove the behavior.

## Implementation rules

- Work from acceptance criteria.
- Keep changes cohesive and reviewable.
- Avoid speculative abstractions.
- Avoid new dependencies when the existing stack can solve the problem adequately.
- Validate inputs at trust boundaries.
- Enforce authorization server-side.
- Protect against duplicate submissions and races where the operation has side effects.
- Use transactions/idempotency where integrity requires them.
- Keep expensive or long-running operations out of synchronous request paths when they can exceed reasonable request latency or reliability limits.

## Verification

Run the applicable layers, not a ritual checklist:

1. static analysis / lint;
2. type checking;
3. unit tests;
4. integration tests;
5. build;
6. E2E tests;
7. preview/deployment validation;
8. focused manual validation.

If a layer does not apply, it may be omitted. High-risk omissions must be explained.

## Quality gate

Before shipping, evaluate the applicable dimensions:

1. UX and action clarity;
2. async/loading/error/empty/success states;
3. accessibility;
4. responsive behavior;
5. frontend/runtime performance;
6. data access, pagination, N+1, indexes, and query efficiency;
7. authentication, authorization, validation, RLS, and secret handling;
8. concurrency, idempotency, duplicate submission, and data integrity;
9. heavy operations, retries, timeouts, jobs, and observability;
10. regression risk and backwards compatibility.

Apply gates proportionally. A tiny static page change does not need a queue audit; a payment mutation does need integrity and idempotency analysis.

## Human approval boundaries

Stop and request explicit approval before actions that materially affect production or are destructive when approval has not already been given, including:

- production database migrations;
- destructive data operations;
- secret/credential rotation;
- weakening security controls;
- irreversible infrastructure changes;
- scope expansion with material product impact.

## Definition of done

Work is done only when:

- acceptance criteria are satisfied;
- applicable automated checks pass;
- applicable quality gates have been evaluated;
- no known P0/P1 issue remains unresolved;
- preview/deployment/manual validation is complete when applicable;
- deferred P2/P3 findings are documented;
- remaining risks and unverified assumptions are explicit;
- evidence is recorded in the PR or work report.

Never use “looks good”, “should work”, or “done” as a substitute for verification.