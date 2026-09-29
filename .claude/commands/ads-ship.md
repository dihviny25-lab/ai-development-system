---
description: SHIP — decide READY / READY_WITH_FOLLOWUPS / BLOCKED from the recorded evidence
argument-hint: <PR, branch, or change (optional)>
---

# /ads-ship

Target: $ARGUMENTS

Run the SHIP gate of the AI Development System.

1. Follow the contract in `agents/ship.md` and `docs/DEFINITION_OF_DONE.md`.
2. Gather the evidence produced by `/ads-verify` and `/ads-qualitygate` in this conversation or in the PR. If evidence is missing, the state is BLOCKED — say which evidence.
3. Check the human approval boundaries in `AGENTS.md`.

Constraints:

- Do not merge, deploy, run migrations, or change production configuration. This command decides readiness; a human decides to ship.
- A technically mergeable branch is not evidence of readiness.

End with the Ship Agent output block. For R2/R3 changes, fill the post-deploy checks using `templates/POSTDEPLOY_REPORT.md`.
