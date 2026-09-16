# Definition of Done

## Not done

A task is not complete merely because:
- code was written;
- an agent says it works;
- lint/typecheck/build passed;
- tests exist;
- a PR was opened;
- a PR was merged;
- deployment succeeded technically.

## Done

A task is complete when all applicable conditions are true:

- [ ] The requested outcome is implemented.
- [ ] Acceptance criteria are satisfied.
- [ ] Existing behavior outside scope is preserved or deliberate changes are documented.
- [ ] Applicable lint/static checks pass.
- [ ] Applicable type checks pass.
- [ ] Applicable unit/integration/E2E tests pass.
- [ ] A regression test exists when the defect has meaningful recurrence risk and is practical to automate.
- [ ] Applicable quality gates were evaluated.
- [ ] No unresolved P0/P1 finding remains.
- [ ] Deferred P2/P3 findings are documented/tracked when meaningful.
- [ ] Preview/manual validation is complete when automation cannot prove user-visible behavior.
- [ ] Production-impacting changes have an appropriate post-deploy verification plan.
- [ ] No secret/private data was exposed.
- [ ] Remaining risks, assumptions, and unverified items are explicit.
- [ ] The PR/work report contains evidence.

## Evidence beats assertion

Bad:
> Fixed. Everything should work now.

Good:
> Acceptance criterion A is covered by test X. The affected integration suite passed. The preview was validated at mobile and desktop widths. API failure produces the expected retry state. One P3 visual improvement was deferred to Issue #N.

## Risk proportionality

Definition of Done is universal; the amount of evidence is proportional to risk. A copy change and a billing mutation should not require identical verification depth.