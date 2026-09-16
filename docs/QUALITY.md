# Quality Gates v1

Quality gates are risk-based audits. Apply the gates that can materially affect the change.

## Severity

- **P0 Critical** — active security, privacy, data-loss, or production-integrity risk. Blocks ship.
- **P1 High** — major functional, security, accessibility, or reliability problem. Normally blocks ship.
- **P2 Medium** — meaningful defect/quality gap with limited impact or workaround. Fix when in scope or track.
- **P3 Improvement** — polish, maintainability, or optimization opportunity. Track when valuable.

## QG-01 UX & action clarity

Check interactive actions for:
- understandable purpose;
- consistent labels/icons;
- disabled states where needed;
- confirmation for destructive actions;
- clear feedback after action;
- no dead or misleading controls.

Icon-only controls do not automatically require visible labels, but their purpose must be understandable visually and programmatically.

## QG-02 Async state integrity

For perceptibly asynchronous work, evaluate:
- immediate feedback;
- loading/pending state;
- double-submission protection;
- success state;
- error state;
- retry where useful;
- empty state;
- stale-data behavior where relevant;
- optimistic updates only when rollback/integrity is safe;
- reduced-motion preferences for meaningful animation.

Test slow network and API failure for critical flows.

## QG-03 Accessibility

Check applicable UI for:
- semantic elements;
- accessible names;
- keyboard operation;
- visible focus;
- logical focus order;
- focus management for dialogs/menus;
- contrast;
- form labels/errors;
- screen-reader semantics;
- reduced motion.

## QG-04 Responsive behavior

Validate relevant breakpoints and interaction modes:
- narrow mobile;
- common mobile;
- tablet when relevant;
- desktop;
- overflow;
- touch targets;
- fixed/sticky elements;
- dialogs/menus;
- long content and translated text where relevant.

## QG-05 Frontend/runtime performance

Investigate when relevant:
- unnecessary renders;
- oversized bundles;
- expensive client work;
- unoptimized images/assets;
- duplicated requests;
- waterfalls;
- unnecessary eager loading;
- expensive synchronous UI work.

Use lazy loading/code splitting only where it improves real behavior; do not add it ceremonially.

## QG-06 Data access & scale

Check lists/tables/data flows based on plausible cardinality, not a blanket rule.

Evaluate:
- pagination/cursor pagination when data can grow materially;
- bounded page sizes;
- filters/search/order preservation;
- efficient server queries;
- N+1 patterns;
- sequential requests inside loops/maps;
- duplicated RPC/API calls;
- unnecessary `select *` / unused columns or relations;
- indexes for meaningful query paths;
- query count and latency before/after performance fixes.

## QG-07 Security & authorization

Evaluate trust boundaries:
- authentication;
- server-side authorization;
- tenant/user isolation;
- RLS where applicable;
- input validation;
- output/data exposure;
- secrets handling;
- unsafe redirects;
- file upload constraints;
- injection/XSS/CSRF risks as applicable;
- rate limiting/abuse protection for exposed sensitive operations.

Never treat hidden UI controls as authorization.

## QG-08 Concurrency & integrity

For side effects, evaluate:
- duplicate submissions;
- races;
- stale writes;
- idempotency;
- transaction boundaries;
- uniqueness constraints;
- retries and replay behavior;
- partial failure.

Critical operations should fail safely rather than leave ambiguous state.

## QG-09 Heavy operations & reliability

Inspect request paths for operations that may be slow, expensive, or unreliable:
- file/media processing;
- report generation;
- bulk imports/exports;
- large external API chains;
- AI generation;
- email batches;
- long calculations.

Move work to background jobs/queues when the operational characteristics justify it. When async jobs are used, consider:
- trackable status;
- progress when useful;
- idempotent retries;
- timeout/cancellation strategy;
- result retrieval;
- failure visibility;
- logging/observability.

Do not introduce queues for trivial fast operations without a reliability/latency reason.

## QG-10 Regression & compatibility

Verify:
- acceptance criteria;
- existing related flows;
- backwards compatibility where promised;
- migration compatibility;
- API contract changes;
- feature flags/fallback when risk warrants;
- regression tests for bugs with meaningful recurrence risk.

## Quality report format

For every finding record:

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

Do not report speculative defects as confirmed findings. Mark hypotheses as hypotheses and provide a reproduction/measurement plan.