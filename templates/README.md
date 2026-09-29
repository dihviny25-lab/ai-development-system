# Templates

Reusable artifacts for the lifecycle phases. Copy them into an Issue, PR, or work report and fill them from real evidence. Delete sections that do not apply rather than filling them with "N/A" noise, and state why when a high-risk section is omitted.

| Template | Phase | Use when |
|---|---|---|
| [EVIDENCE_REPORT.md](EVIDENCE_REPORT.md) | VERIFY → SHIP | Closing any material task (R1+) |
| [MIGRATION_RUNBOOK.md](MIGRATION_RUNBOOK.md) | PLAN → SHIP | Any schema or data migration; mandatory for R3 production migrations |
| [POSTDEPLOY_REPORT.md](POSTDEPLOY_REPORT.md) | OBSERVE | After deploying R2/R3 changes |

Related templates elsewhere:

- Feature Issue: `.github/ISSUE_TEMPLATE/feature.md`
- Bug Issue: `.github/ISSUE_TEMPLATE/bug.md`
- Pull request: `.github/PULL_REQUEST_TEMPLATE.md`
- Decision record: the template at the top of `docs/DECISIONS.md`

See `examples/` for filled-in versions.
