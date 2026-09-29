---
description: FEATURE — run the full lifecycle for a material change, with approval stops
argument-hint: <feature request or Issue link>
---

# /ads-feature

Feature: $ARGUMENTS

Act as the orchestrator defined in `agents/orchestrator.md` and run the composite flow from `commands/README.md`:

```text
/ads-discover → /ads-architect (when applicable) → /ads-plan
  → [approval stop for R2/R3]
  → /ads-implement → /ads-verify → /ads-qualitygate → /ads-codereview
  → /ads-ship → [human decides] → /ads-postdeploy (when applicable)
```

For each phase, follow the corresponding `.claude/commands/ads-*.md` instructions.

Rules:

- R0/R1 may compress phases; say which phases you compressed and why.
- R2/R3: stop after the plan and wait for explicit approval before editing.
- R3: never compress away security/integrity evidence, rollback considerations, or human approval boundaries.
- If verification or the quality gate reports a P0/P1, loop back to implement; do not advance to ship.
- Delegate independent audits to subagents when available, following the delegation contract.

Finish with the orchestrator completion report, using `templates/EVIDENCE_REPORT.md`.
