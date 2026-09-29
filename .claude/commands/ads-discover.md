---
description: DISCOVERY — investigate a change request without editing code
argument-hint: <change request, Issue link, or area to investigate>
---

# /ads-discover

Change request: $ARGUMENTS

Run the DISCOVERY phase of the AI Development System.

1. Read `AGENTS.md` and follow it.
2. Read the context files that exist (`docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, or root-level equivalents).
3. Follow the contract in `agents/discovery.md`.

Constraints:

- This phase is read-only. Do not edit, create, or delete files.
- Cite file paths/symbols for every observation. Label inferences as inferences.
- If the change request is empty or the requested outcome is unclear, ask for it before investigating.

End with the Discovery Agent output sections, plus:

- a proposed risk profile (R0–R3, see `docs/V2.md`) and why;
- the recommended next command: `/ads-architect` when boundaries, data, auth, or integrations change materially; otherwise `/ads-plan`.
