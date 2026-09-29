---
description: QUALITY GATE — audit the change against applicable quality dimensions and classify findings P0–P3
argument-hint: <scope: diff, branch, PR, or feature (optional)>
---

# /ads-qualitygate

Scope: $ARGUMENTS (default: the current branch's diff against its base)

Run the QUALITY GATE phase of the AI Development System.

1. Read `docs/QUALITY.md` and follow the contract in `agents/quality-gate.md`.
2. Decide which of the 10 gates materially apply. For each applicable specialist area, apply the matching contract:
   - UX/accessibility → `agents/ux-audit.md`
   - security/authorization → `agents/security-audit.md`
   - data/migrations → `agents/database-audit.md`
   - performance → `agents/performance-audit.md`
   - async/reliability → `agents/reliability-audit.md`
   - regression/compatibility → `agents/regression-audit.md`
3. When the client supports parallel subagents, you may delegate independent audits using the delegation contract in `agents/orchestrator.md`.

Constraints:

- Do not modify code. Audit only.
- Every finding needs evidence. Do not invent bugs or use severity for preference.
- Separate current-scope findings from unrelated discoveries.

End with the Quality Gate Agent output, including "Ship blockers" (confirmed P0/P1 or unmet acceptance criteria only).
