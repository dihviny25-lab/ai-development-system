---
description: IMPLEMENT — execute an approved plan with minimal scope
argument-hint: <plan reference or bounded change>
---

# /ads-implement

Plan / change: $ARGUMENTS

Run the IMPLEMENT phase of the AI Development System.

1. Read `AGENTS.md` and follow it.
2. Follow the contract in `agents/implementation.md`.
3. Confirm an approved plan exists in this conversation. If none exists and the change is above R1, run `/ads-plan` steps first and ask for approval.

Rules:

- Implement only what the plan covers. Record discoveries outside scope instead of fixing them.
- Never hide failures with mocks, disabled checks, broad casts, swallowed errors, or weakened security.
- Stop before any action listed under "Human approval boundaries" in `AGENTS.md`.
- Run the cheap local checks (lint/typecheck/unit tests for touched code) before reporting.

End with the Implementation Agent output block. The final status is "ready for verification", never "done". Recommended next command: `/ads-verify`.
