export type Risk = "R0" | "R1" | "R2" | "R3";
export type ResultStatus = "PASS" | "PASS_WITH_FINDINGS" | "BLOCKED" | "FAIL";
export type RuntimeState =
  | "CREATED"
  | "DISCOVERED"
  | "ROUTED"
  | "RUNNING"
  | "RECONCILING"
  | "VERIFYING"
  | "GATING"
  | "READY_TO_SHIP"
  | "BLOCKED"
  | "FAILED";

export interface Finding {
  severity: "P0" | "P1" | "P2" | "P3";
  claim: string;
  evidence: string[];
}

export interface SpecialistResult {
  status: ResultStatus;
  summary: string;
  evidence: string[];
  findings: Finding[];
  assumptions: string[];
  changesMade: string[];
  unverified: string[];
  recommendedNextAction?: string;
}

export interface WorkUnit {
  id: string;
  owner: string;
  objective: string;
  dependsOn: string[];
  mutates: string[];
  allowedActions: string[];
  forbiddenActions: string[];
  evidenceRequired: string[];
}

export interface Manifest {
  task: string;
  goal: string;
  risk: Risk;
  invariants: string[];
  workUnits: WorkUnit[];
  evidenceRequired: string[];
  stopConditions: string[];
}

export interface ExecutionContext {
  manifest: Manifest;
  results: Readonly<Record<string, SpecialistResult>>;
}

export interface ExecutorAdapter {
  execute(unit: WorkUnit, context: ExecutionContext): Promise<SpecialistResult>;
}

const transitions: Record<RuntimeState, RuntimeState[]> = {
  CREATED: ["DISCOVERED", "BLOCKED", "FAILED"],
  DISCOVERED: ["ROUTED", "BLOCKED", "FAILED"],
  ROUTED: ["RUNNING", "BLOCKED", "FAILED"],
  RUNNING: ["RECONCILING", "BLOCKED", "FAILED"],
  RECONCILING: ["VERIFYING", "BLOCKED", "FAILED"],
  VERIFYING: ["GATING", "BLOCKED", "FAILED"],
  GATING: ["READY_TO_SHIP", "BLOCKED", "FAILED"],
  READY_TO_SHIP: [],
  BLOCKED: [],
  FAILED: [],
};

export function transition(from: RuntimeState, to: RuntimeState): RuntimeState {
  if (!transitions[from].includes(to)) {
    throw new Error(`Invalid runtime transition: ${from} -> ${to}`);
  }
  return to;
}

export function validateManifest(manifest: Manifest): string[] {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const unit of manifest.workUnits) {
    if (!unit.id) errors.push("Work unit id is required");
    if (ids.has(unit.id)) errors.push(`Duplicate work unit id: ${unit.id}`);
    ids.add(unit.id);
  }

  for (const unit of manifest.workUnits) {
    for (const dep of unit.dependsOn) {
      if (!ids.has(dep)) errors.push(`Unknown dependency ${dep} for ${unit.id}`);
      if (dep === unit.id) errors.push(`Self dependency in ${unit.id}`);
    }
  }

  const visiting = new Set<string>();
  const visited = new Set<string>();
  const byId = new Map(manifest.workUnits.map((u) => [u.id, u]));

  const visit = (id: string): void => {
    if (visiting.has(id)) {
      errors.push(`Dependency cycle detected at ${id}`);
      return;
    }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dep of byId.get(id)?.dependsOn ?? []) visit(dep);
    visiting.delete(id);
    visited.add(id);
  };

  for (const unit of manifest.workUnits) visit(unit.id);
  return [...new Set(errors)];
}

function terminalSuccess(result: SpecialistResult | undefined): boolean {
  return result?.status === "PASS" || result?.status === "PASS_WITH_FINDINGS";
}

export function runnableUnits(
  manifest: Manifest,
  results: Readonly<Record<string, SpecialistResult>>,
): WorkUnit[] {
  return manifest.workUnits.filter(
    (unit) =>
      !results[unit.id] &&
      unit.dependsOn.every((dependency) => terminalSuccess(results[dependency])),
  );
}

export function conflictingMutations(units: WorkUnit[]): [string, string, string][] {
  const conflicts: [string, string, string][] = [];
  for (let i = 0; i < units.length; i++) {
    for (let j = i + 1; j < units.length; j++) {
      for (const surface of units[i].mutates) {
        if (units[j].mutates.includes(surface)) {
          conflicts.push([units[i].id, units[j].id, surface]);
        }
      }
    }
  }
  return conflicts;
}

export function reconcile(
  manifest: Manifest,
  results: Readonly<Record<string, SpecialistResult>>,
): SpecialistResult {
  const all = manifest.workUnits.map((u) => results[u.id]).filter(Boolean);
  const findings = all.flatMap((r) => r.findings);
  const evidence = [...new Set(all.flatMap((r) => r.evidence))];
  const unverified = [...new Set(all.flatMap((r) => r.unverified))];

  if (all.some((r) => r.status === "FAIL")) {
    return { status: "FAIL", summary: "At least one work unit failed", evidence, findings, assumptions: [], changesMade: [], unverified };
  }
  if (all.length !== manifest.workUnits.length || all.some((r) => r.status === "BLOCKED")) {
    return { status: "BLOCKED", summary: "Required work is incomplete or blocked", evidence, findings, assumptions: [], changesMade: [], unverified };
  }
  if (findings.some((f) => f.severity === "P0" || f.severity === "P1")) {
    return { status: "FAIL", summary: "Blocking P0/P1 finding exists", evidence, findings, assumptions: [], changesMade: [], unverified };
  }
  const requiredEvidence = [
    ...manifest.evidenceRequired,
    ...manifest.workUnits.flatMap((unit) => unit.evidenceRequired),
  ];
  const missingEvidence = [...new Set(requiredEvidence.filter((required) => !evidence.includes(required)))];
  const reconciledUnverified = [...new Set([...unverified, ...missingEvidence.map((item) => `Missing required evidence: ${item}`)])];

  const hasFindings =
    findings.length > 0 ||
    reconciledUnverified.length > 0 ||
    all.some((r) => r.status === "PASS_WITH_FINDINGS");
  return {
    status: hasFindings ? "PASS_WITH_FINDINGS" : "PASS",
    summary: hasFindings ? "Execution completed with findings" : "Execution completed",
    evidence,
    findings,
    assumptions: [...new Set(all.flatMap((r) => r.assumptions))],
    changesMade: [...new Set(all.flatMap((r) => r.changesMade))],
    unverified: reconciledUnverified,
  };
}

export async function executeManifest(
  manifest: Manifest,
  adapter: ExecutorAdapter,
): Promise<{ state: RuntimeState; results: Record<string, SpecialistResult>; reconciliation: SpecialistResult }> {
  const errors = validateManifest(manifest);
  if (errors.length) throw new Error(errors.join("; "));

  let state: RuntimeState = "CREATED";
  state = transition(state, "DISCOVERED");
  state = transition(state, "ROUTED");
  state = transition(state, "RUNNING");

  const results: Record<string, SpecialistResult> = {};

  while (Object.keys(results).length < manifest.workUnits.length) {
    const runnable = runnableUnits(manifest, results);
    if (!runnable.length) {
      const reconciliation: SpecialistResult = {
        status: "BLOCKED",
        summary: "No runnable work units remain",
        evidence: [],
        findings: [],
        assumptions: [],
        changesMade: [],
        unverified: manifest.workUnits.filter((u) => !results[u.id]).map((u) => u.id),
      };
      return { state: "BLOCKED", results, reconciliation };
    }

    const conflicts = conflictingMutations(runnable);
    const conflicted = new Set(conflicts.flatMap(([a, b]) => [a, b]));
    const batch = runnable.filter((u) => !conflicted.has(u.id));
    const selected = batch.length ? batch : [runnable[0]];

    const completed = await Promise.all(
      selected.map(async (unit) => [unit.id, await adapter.execute(unit, { manifest, results })] as const),
    );
    for (const [id, result] of completed) results[id] = result;

    if (completed.some(([, result]) => result.status === "FAIL")) {
      return { state: "FAILED", results, reconciliation: reconcile(manifest, results) };
    }
    if (completed.some(([, result]) => result.status === "BLOCKED")) {
      return { state: "BLOCKED", results, reconciliation: reconcile(manifest, results) };
    }
  }

  state = transition(state, "RECONCILING");
  const reconciliation = reconcile(manifest, results);
  if (reconciliation.status === "FAIL") return { state: "FAILED", results, reconciliation };
  if (reconciliation.status === "BLOCKED") return { state: "BLOCKED", results, reconciliation };

  state = transition(state, "VERIFYING");
  state = transition(state, "GATING");

  // Findings and unverified items require an explicit disposition before shipping.
  // The reference runtime cannot invent that decision, so it stops at the gate.
  if (reconciliation.status === "PASS_WITH_FINDINGS") {
    state = transition(state, "BLOCKED");
    return { state, results, reconciliation };
  }

  state = transition(state, "READY_TO_SHIP");
  return { state, results, reconciliation };
}
