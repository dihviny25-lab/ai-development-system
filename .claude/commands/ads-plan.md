---
description: PLAN — turn discovery/architecture into a bounded, verifiable execution plan
argument-hint: <change request, Issue link, or prior discovery output>
---

# /ads-plan

Change: $ARGUMENTS

Run the PLAN phase of the AI Development System.

1. Read `AGENTS.md` and follow it.
2. Use the discovery/architecture findings from this conversation. If none exist and the change is not R0, run the discovery steps from `agents/discovery.md` first (read-only).
3. Assign the risk profile using `docs/V2.md`. Risk is determined by impact, not code size.

Produce the plan in this structure:

```text
Risk profile: R0 | R1 | R2 | R3 — reason
Requested outcome:
Acceptance criteria:
  - [ ] AC1 — observable, testable
Non-goals / out of scope:
Affected files/areas:
Implementation steps:
  1.
Verification plan (map each AC to evidence):
  AC1 → check/test/manual step
Applicable quality gates (docs/QUALITY.md):
Human approval required: yes/no — which boundary in AGENTS.md
Risks / unknowns:
```

Do not edit files in this phase. For R2/R3, stop and wait for the user to approve the plan before `/ads-implement`.
