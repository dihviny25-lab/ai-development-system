---
description: CODE REVIEW — review a diff for correctness, regressions, security, and contract violations
argument-hint: <diff, branch, or PR (optional)>
---

# /ads-codereview

Target: $ARGUMENTS (default: the current branch's diff against its base)

Review the change using the AI Development System standards.

1. Read `AGENTS.md` and `docs/QUALITY.md` (severity model and finding format).
2. Read the full diff and enough surrounding code to understand each change.
3. Check: correctness, regressions (`agents/regression-audit.md`), security and data integrity, maintainability, scope discipline (unrelated refactors, silent scope expansion), and whether tests prove the acceptance criteria.

For each finding:

```text
ID:
File:line:
Severity: P0 | P1 | P2 | P3
Evidence:
Impact:
Suggested fix:
```

Do not modify code. Rank findings most severe first. If there are no findings, state what was reviewed and what was not.
