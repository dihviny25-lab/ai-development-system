# Migration Runbook — [migration name]

> Required for R3 production migrations. Production application requires explicit human approval (`AGENTS.md`, "Human approval boundaries"). Never paste connection strings, credentials, or production records into this document.

## 1. Summary

| Field | Value |
|---|---|
| Migration file(s) | |
| Issue / PR | |
| Risk profile | R3 (or justify lower) |
| Approver | |
| Planned window | |

## 2. Change

What objects change (tables, columns, constraints, indexes, policies, functions) and why.

## 3. Preconditions

Assumptions about current data that must hold. Each needs a read-only verification query.

| Precondition | Verification query | Expected result |
|---|---|---|
| | | |

## 4. Compatibility during rollout

- Can the currently deployed application run against the migrated schema? (expand/contract)
- Can the new application run against the old schema if the deploy order differs?
- Required deploy order: migration → app, or app → migration.

## 5. Locking and runtime

- Expected locks and duration on realistic data volume.
- Long-running statements (index builds, backfills) and whether they need batching or concurrent variants.
- Measured on: staging / branch / copy (never guess for large tables).

## 6. Execution steps

1. Confirm approval recorded.
2. Take/confirm backup or snapshot per the project's mechanism.
3. Run preconditions (section 3).
4. Apply through the project's approved mechanism.
5. Run post-conditions (section 7).
6. Validate the application flow (section 8).

## 7. Post-conditions

| Check | Query / command | Expected result |
|---|---|---|

## 8. Application validation

Critical journeys to exercise after migration, with expected results.

## 9. Recovery / rollback

- Is the migration reversible? Down migration tested where?
- Data written after migration: what happens to it on rollback?
- If not reversible: forward-fix plan and restore procedure.
- Decision trigger: which observed signal means "roll back now".

## 10. Record

| Step | Time | Operator | Result / evidence |
|---|---|---|---|
