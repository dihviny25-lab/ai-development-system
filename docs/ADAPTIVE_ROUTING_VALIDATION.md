# Adaptive Domain Validation

## Purpose

Validate that AI Development System v2 adapts its execution plan to the product, architecture, risk and domain instead of applying the same checklist mechanically to every repository.

This validation is discovery-only. It does not change the evaluated products.

## Hypothesis

Given repositories from different domains, the orchestrator should:

1. discover product and technical context;
2. identify domain-specific invariants and failure modes;
3. classify risk by impact;
4. select only the specialist agents that materially contribute;
5. produce different verification requirements for different systems;
6. preserve the universal evidence contract and Definition of Done.

## Pilot A — Seminario Huguenotes

Observed context:
- academic/seminary product;
- TanStack Start, React, TypeScript and Tailwind;
- database-backed server architecture;
- teacher/student and academic workflows;
- documents, lessons and course content are material product concerns.

Expected adaptive emphasis:
- Architecture: domain boundaries for courses, disciplines, lessons and assignments.
- Security: authorization and role boundaries.
- Database: academic relationships, query integrity and migrations.
- Regression: teacher/student flows and existing academic behavior.
- Reliability: file/content operations where failure can leave inconsistent state.
- UX: dashboards, readers and academic navigation.

Typical high-impact invariants:
- users must not gain capabilities outside their role;
- academic relationships must remain internally consistent;
- a change to one teacher/discipline must not silently affect unrelated records;
- protected content must not become accessible without authorization.

Likely agent selection for an R2/R3 academic feature:
`discovery → architecture → database/security as applicable → implementation → regression → quality-gate → ship`

## Pilot B — Som da Crianca

Observed context:
- child literacy application;
- React, TypeScript and Vite;
- optional cloud account/progress through Neon;
- local-first behavior;
- offline progress and later reconciliation;
- account isolation for responsible adults and children.

Expected adaptive emphasis:
- UX: child-facing interaction and understandable feedback.
- Accessibility: interaction, readability and input behavior.
- Reliability: offline/online transitions and reconciliation.
- Database/Security: account and child isolation when cloud mode is enabled.
- Regression: curriculum/progress behavior.
- Performance: startup and interaction responsiveness on constrained devices.

Typical high-impact invariants:
- progress from different accounts must never be mixed;
- offline work must not disappear merely because connectivity changes;
- reconciliation must be deterministic;
- a child-facing failure state must not trap the interaction;
- curriculum dependencies must remain valid.

Likely agent selection for an R2 learning-flow feature:
`discovery → UX/accessibility → reliability → implementation → regression → quality-gate → ship`

A cloud identity/progress change can escalate to R3 and add security/database specialists.

## Result

**PASS WITH FINDINGS**

The v2 model can express materially different specialist selections and verification concerns while preserving the same lifecycle and evidence contract.

The validation also exposes a gap: v2 currently documents risk profiles and specialist agents, but selection is still too dependent on human/agent judgment. It needs an explicit routing contract so adaptation is repeatable rather than intuitive.

## Required improvement

Add an Adaptive Routing Contract to the orchestrator.

The router must derive specialist selection from observed change surfaces and product invariants, not from domain labels.

Examples:

| Change surface | Default specialist consideration |
| --- | --- |
| Authentication, authorization, roles, tenancy | Security + Regression |
| Schema, migrations, relationships, query behavior | Database + Regression |
| Offline state, retries, synchronization, queues | Reliability + Regression |
| User interaction, loading/error/empty states | UX |
| Keyboard, semantics, assistive technology | Accessibility |
| Rendering, payload, query volume, latency | Performance |
| Cross-boundary or structural change | Architecture |
| Any behavior change | Regression |

Domain knowledge changes the invariants and tests. It must not hard-code the framework to a business vertical.

## Acceptance criteria for adaptive orchestration

The orchestrator is adaptive when it can explain:

- what it learned about the product;
- what can fail in this specific change;
- the assigned risk profile and why;
- which specialists are selected;
- which specialists are intentionally skipped and why;
- which invariants must be preserved;
- what evidence is required before completion.

A specialist is not selected merely because it exists.
