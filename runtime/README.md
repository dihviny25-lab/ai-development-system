# Executable Runtime

This directory defines a provider-neutral reference runtime for AI Development System v2.

The runtime turns the protocol into a deterministic state machine. It does not embed a model vendor, database, CI provider or business domain.

## Lifecycle

```text
CREATED → DISCOVERED → ROUTED → RUNNING → RECONCILING → VERIFYING → GATING → READY_TO_SHIP
                                                   ↘ BLOCKED
                                                   ↘ FAILED
```

Only valid transitions are accepted. Work units become runnable when their dependencies have terminal non-blocking results.

## Adapter boundary

An executor adapter receives a bounded work unit and returns the common specialist result contract.

```ts
interface ExecutorAdapter {
  execute(unit: WorkUnit, context: ExecutionContext): Promise<SpecialistResult>
}
```

Adapters may be backed by an agent runtime, a local deterministic tool, CI, a human review step or another execution environment. The core scheduler does not care which.

## Safety

The runtime never upgrades authority. A work unit may only perform actions already permitted by its manifest and host environment. Production, destructive, billing, credential and irreversible operations remain subject to external approval controls.

## Reference implementation

`runtime/core.ts` contains the dependency scheduler and state transitions. It is intentionally dependency-free TypeScript so repositories can adopt or wrap it without inheriting a vendor SDK.
