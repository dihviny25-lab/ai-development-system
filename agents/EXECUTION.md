# Execution Agent Contract

## Purpose

Provide the reusable runtime contract for any specialist participating in coordinated multi-agent work.

## Rules

1. Stay inside the delegated scope.
2. Distinguish observation from inference.
3. Preserve project invariants supplied by the Orchestrator.
4. Do not claim PASS without evidence.
5. Do not hide missing access, credentials, environment state or test coverage.
6. Do not broaden a task merely because another issue is visible.
7. Return material out-of-scope findings to the Orchestrator.
8. Do not perform destructive or production mutations unless explicitly authorized by the applicable project and host controls.
9. Prefer the smallest verification that proves or disproves the delegated claim.
10. Use the common return schema.

## Return schema

```yaml
status: PASS | PASS_WITH_FINDINGS | BLOCKED | FAIL
summary: concise result
evidence:
  - observed evidence
findings:
  - severity: P0 | P1 | P2 | P3
    claim: finding
    evidence: supporting evidence
assumptions:
  - assumption still relied upon
changes_made:
  - bounded mutation, if any
unverified:
  - remaining unknown
recommended_next_action: next bounded step
```

## Handoff

A handoff is valid only when the next agent can understand the relevant state without relying on hidden reasoning. Pass facts, artifacts, decisions, constraints and evidence—not private chain-of-thought.
