# Multi-Agent Execution Protocol

## Goal

Turn adaptive routing into coordinated execution without coupling AI Development System to a business domain, stack, hosting provider or database.

## Execution model

The Orchestrator owns the task lifecycle. Specialists own bounded analysis and evidence. No specialist may independently declare the overall task done.

```text
DISCOVER
  → ROUTE
  → DELEGATE
  → COLLECT
  → RECONCILE
  → VERIFY
  → QUALITY GATE
  → SHIP
```

## 1. Execution manifest

Before delegation, the Orchestrator creates a manifest:

```text
Task:
Goal:
Risk:
Change surfaces:
Invariants:
Work units:
Dependencies:
Selected specialists:
Skipped specialists + reason:
Evidence required:
Stop conditions:
Ship authority:
```

A work unit must be independently understandable and have an owner, inputs, expected output, evidence requirement and dependency set.

## 2. Delegation contract

Every specialist receives only the context needed for its bounded responsibility:

```text
Role:
Objective:
Scope:
Out of scope:
Known invariants:
Inputs:
Questions to answer:
Evidence required:
Allowed actions:
Forbidden actions:
Return schema:
```

Specialists must not silently expand scope. New material risk is returned as a finding for Orchestrator triage.

## 3. Specialist return schema

Every specialist returns:

```text
status: PASS | PASS_WITH_FINDINGS | BLOCKED | FAIL
summary:
evidence:
findings:
assumptions:
changes_made:
unverified:
recommended_next_action:
```

Evidence must identify what was actually observed. Absence of evidence is not PASS.

## 4. Parallelism

Work may run in parallel only when work units do not mutate the same surface and do not depend on each other's unresolved output.

Good parallel candidates:
- read-only Security and Accessibility audits;
- independent UX and Performance analysis;
- test execution and documentation checks after implementation is stable.

Serialize when:
- two agents may edit the same files or schema;
- one decision changes another agent's assumptions;
- migrations, destructive operations or external side effects are involved;
- risk is R3 and ordering is part of safety.

## 5. Reconciliation

The Orchestrator merges specialist results, not merely their prose.

Precedence:
1. confirmed P0/P1 safety or data-integrity findings block progression;
2. BLOCKED means required evidence is unavailable;
3. conflicting findings trigger targeted re-verification;
4. PASS_WITH_FINDINGS requires explicit disposition of each material finding;
5. only reconciled evidence can feed the Quality Gate.

A specialist PASS cannot override another specialist's confirmed blocking finding.

## 6. Conflict protocol

When specialists disagree:
1. identify the exact disputed claim;
2. compare evidence and assumptions;
3. prefer direct/reproducible evidence over inference;
4. run the smallest targeted verification that can resolve the dispute;
5. if still unresolved, mark BLOCKED and surface the uncertainty.

The Orchestrator must not average opinions.

## 7. Mutation authority

Read-only analysis may be delegated broadly.

Mutations require an explicit work unit and bounded authority. Destructive, production, credential, billing or irreversible operations retain the approval requirements of the host environment and project policy.

Agents must never interpret task urgency as permission to bypass those controls.

## 8. Completion

Multi-agent execution is complete only when:
- all required work units have terminal states;
- material findings are reconciled;
- required evidence exists;
- regression expectations are satisfied;
- Quality Gate returns an allowed ship state;
- remaining uncertainty is recorded.

The Orchestrator alone emits the final task state.

## 9. Minimal mode

R0/R1 tasks should not manufacture agent ceremony. The Orchestrator may execute directly when delegation would not materially improve correctness, evidence or speed.

Multi-agent execution is a capability, not a mandatory fan-out.
