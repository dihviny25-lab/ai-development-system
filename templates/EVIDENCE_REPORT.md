# Evidence Report — [change title]

> Answers the questions in `docs/PROTOCOL.md` ("Evidence report"): what changed, why, what was tested, what proves the acceptance criteria, what was not tested, and what risk remains.

## Summary

| Field | Value |
|---|---|
| Status | PASS / PASS_WITH_FINDINGS / BLOCKED / FAIL |
| Risk profile | R0 / R1 / R2 / R3 — reason |
| Issue / PR | #… |
| Ship state | READY / READY_WITH_FOLLOWUPS / BLOCKED |

## Requested outcome

One or two sentences describing observable behavior.

## Changes made

- `path/to/file` — what and why

## Acceptance criteria

| # | Criterion | Evidence | Type | Result |
|---|---|---|---|---|
| AC1 | | test name / command / screenshot / query | automated / manual | PASS / FAIL / UNVERIFIED |

## Checks executed

```text
$ <command>
<relevant output excerpt>
```

| Layer | Command | Result |
|---|---|---|
| Lint | | |
| Typecheck | | |
| Unit | | |
| Integration | | |
| Build | | |
| E2E | | |

## Checks not executed

| Check | Reason | Risk of omission |
|---|---|---|

## Quality gate

Applicable gates and outcome (see `docs/QUALITY.md`). Findings use the standard format:

```text
ID:
Gate:
Severity: P0 | P1 | P2 | P3
Evidence:
Impact:
Current scope: yes | no
Recommended action:
Verification after fix:
```

## Manual validation

| Step | Expected | Observed | By |
|---|---|---|---|

## Unverified items and remaining risks

- 

## Deferred follow-ups

- P2/P3 finding → Issue #…
