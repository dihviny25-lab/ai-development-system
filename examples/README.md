# Examples

Filled-in walkthroughs showing how the protocol behaves at different risk levels. All products, people, files, and data are fictional.

| Example | Risk | Shows |
|---|---|---|
| [R0 — copy fix](#r0--copy-fix) (below) | R0 | How little ceremony a trivial change needs |
| [team-invitations.md](team-invitations.md) | R3 | Full lifecycle: discovery → architecture → plan → implement → verify → quality gate → ship → observe |

Risk is determined by impact, not code size (`docs/V2.md`). Compare the two: the R0 fix has a one-line evidence report; the R3 feature needs security, integrity, and approval evidence at every step.

## R0 — copy fix

**Request:** "The settings page says 'Delete acount'. Fix the typo."

**Orchestrator:** R0 — static copy, no behavior change. Compress DISCOVERY/PLAN/VERIFY into one step.

**Discovery:** `grep -rn "acount" src/` → one match, `src/settings/DangerZone.tsx:18`. No test snapshots reference the string.

**Implementation:** change `"Delete acount"` to `"Delete account"`.

**Evidence report:**

```text
Status: PASS
Risk profile: R0 — copy only
Changes: src/settings/DangerZone.tsx:18 (label text)
Checks executed: lint → pass; unit tests for settings → pass (12/12)
Checks not executed: E2E — no behavior change; build — covered by CI
Unverified: none
```

No quality gate audit, architecture review, or post-deploy observation is required. Running them would be ceremony, not evidence.
