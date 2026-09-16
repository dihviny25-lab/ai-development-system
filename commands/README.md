# Command Workflow

These commands are conceptual interfaces. An AI client may implement them as slash commands, prompt files, skills, or plain-language instructions.

They intentionally reuse common engineering meanings rather than bind the protocol to one tool.

## `/discover`

Inspect the product/repository/change request without editing. Produce current behavior, relevant files, risks, unknowns, and proposed acceptance criteria.

## `/architect`

For a material change, analyze boundaries, invariants, data/API impact, failure modes, alternatives, and verification requirements.

## `/plan`

Turn discovery/architecture into a bounded execution plan with acceptance criteria, risks, non-goals, implementation steps, and validation plan.

## `/implement`

Execute the approved plan. Do not silently expand scope. End in `ready for verification`, not `done`.

## `/verify`

Run applicable static/type/unit/integration/build/E2E/preview/manual checks and map evidence to acceptance criteria.

## `/qualitygate`

Audit applicable quality dimensions, classify findings P0–P3, separate blockers from follow-ups, and identify unverified items. Do not automatically fix unrelated findings.

## `/codereview`

Review the diff for correctness, regressions, maintainability, security, data integrity, and contract violations. Findings require evidence and severity.

## `/ship`

Evaluate readiness using the Ship Agent contract. Report `READY`, `READY_WITH_FOLLOWUPS`, or `BLOCKED`. Respect human approval boundaries.

## `/postdeploy`

Validate the production-relevant outcome after deployment: critical journey, errors, logs/metrics, migrations/jobs/integrations as applicable. Record regressions/follow-ups.

## Composite flow: `/feature`

For a material feature, the orchestrator may execute:

```text
/discover
  ↓
/architect (when applicable)
  ↓
/plan
  ↓
/implement
  ↓
/verify
  ↓
/qualitygate
  ↓
/codereview
  ↓
/ship
  ↓
/postdeploy (when applicable)
```

Small R0/R1 tasks may compress phases. R3 tasks must not compress away risk/security/integrity evidence or human approval boundaries.