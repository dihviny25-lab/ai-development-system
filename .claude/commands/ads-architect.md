---
description: ARCHITECTURE — analyze boundaries, invariants, and design for a material change
argument-hint: <change request or discovery summary>
---

# /ads-architect

Change: $ARGUMENTS

Run the ARCHITECTURE phase of the AI Development System.

1. Read `AGENTS.md` and follow it.
2. Read `docs/ARCHITECTURE.md` and `docs/DECISIONS.md` when they exist, then verify them against the actual code — the code is the source of truth when they disagree.
3. Follow the contract in `agents/architecture.md`.

Constraints:

- Do not edit application code. You may propose a `docs/DECISIONS.md` entry, but only write it if the user asks.
- Do not redesign unrelated architecture.
- For each alternative considered, state why it was not chosen.

End with the Architecture Agent output block and the recommended next command (`/ads-plan`).
