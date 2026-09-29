---
description: VERIFY — run applicable checks and map evidence to acceptance criteria
argument-hint: <acceptance criteria or plan reference (optional)>
---

# /ads-verify

Context: $ARGUMENTS

Run the VERIFY phase of the AI Development System.

1. Read `AGENTS.md` ("Verification" and "Evidence standard").
2. Discover the repository's real verification commands (package scripts, Makefile, CI workflows, profile in `profiles/` if adopted). Never invent script names.
3. Run the applicable layers: lint → typecheck → unit → integration → build → E2E. Skip a layer only when it does not apply, and say why.
4. Map every acceptance criterion to evidence.

Report:

```text
Status: PASS | PASS_WITH_FINDINGS | FAIL | BLOCKED
Checks executed (command → result):
Checks not executed + reason:
Acceptance criteria:
  AC1 — evidence — PASS/FAIL/UNVERIFIED
Manual/preview validation still required (exact steps + expected result):
Unverified items:
```

Paste real command output excerpts for failures. Do not fix failures silently in this phase — report them; fixes go back through `/ads-implement`.
