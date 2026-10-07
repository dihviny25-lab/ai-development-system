import {
  conflictingMutations,
  executeManifest,
  reconcile,
  validateManifest,
  type ExecutorAdapter,
  type Manifest,
  type SpecialistResult,
} from "./core";

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}

const pass = (evidence: string[] = []): SpecialistResult => ({
  status: "PASS",
  summary: "ok",
  evidence,
  findings: [],
  assumptions: [],
  changesMade: [],
  unverified: [],
});

function manifest(workUnits: Manifest["workUnits"], evidenceRequired: string[] = []): Manifest {
  return { task: "test", goal: "verify runtime", risk: "R1", invariants: [], workUnits, evidenceRequired, stopConditions: [] };
}

const unit = (id: string, dependsOn: string[] = [], mutates: string[] = [], evidenceRequired: string[] = []) => ({
  id, owner: "test", objective: id, dependsOn, mutates, allowedActions: [], forbiddenActions: [], evidenceRequired,
});

async function main() {
  assert(validateManifest(manifest([unit("a", ["b"]), unit("b", ["a"])]))[0]?.includes("cycle"), "cycle must be rejected");
  assert(conflictingMutations([unit("a", [], ["schema"]), unit("b", [], ["schema"])]).length === 1, "shared mutation must conflict");

  const missing = reconcile(manifest([unit("a")], ["proof"]), { a: pass([]) });
  assert(missing.status === "PASS_WITH_FINDINGS", "missing required evidence must create findings state");
  assert(missing.unverified.some((x) => x.includes("proof")), "missing evidence must be named");

  const order: string[] = [];
  const adapter: ExecutorAdapter = {
    async execute(work) {
      order.push(work.id);
      return pass(work.evidenceRequired);
    },
  };
  const success = await executeManifest(manifest([unit("a"), unit("b", ["a"])], []), adapter);
  assert(success.state === "READY_TO_SHIP", "clean execution must become ready");
  assert(order.join(",") === "a,b", "dependency order must be preserved");

  const gated = await executeManifest(manifest([unit("a", [], [], ["proof"])], ["global-proof"]), adapter);
  assert(gated.state === "BLOCKED", "missing global evidence must block shipping");

  console.log("runtime tests: PASS");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
