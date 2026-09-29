---
description: OBSERVE — validate the production-relevant outcome after a deployment
argument-hint: <deployment, release, or PR that shipped>
---

# /ads-postdeploy

Deployment: $ARGUMENTS

Run the OBSERVE phase of the AI Development System.

1. Read the post-deploy checks recorded by `/ads-ship` or in the PR.
2. Use `templates/POSTDEPLOY_REPORT.md` as the output structure.
3. Validate with the evidence you can actually reach: critical journey behavior, error rates/logs, migrations/jobs/integrations, and metrics named in the plan.

Constraints:

- Read-only by default. Rollbacks, data fixes, or configuration changes require explicit human approval (`AGENTS.md`).
- Never paste secrets, tokens, or private customer data from logs into the report.
- If you cannot access production signals, list the exact checks a human must perform.

Record regressions as findings (P0–P3) and deferred work as follow-ups.
