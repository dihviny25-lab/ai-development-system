# Copilot instructions

This repository uses the AI Development System. Follow the operating rules in `AGENTS.md` at the repository root for every task; they override default behavior.

- Code written is not work completed. Completion requires evidence mapped to acceptance criteria (`docs/DEFINITION_OF_DONE.md`).
- Assign a risk profile (R0–R3, `docs/V2.md`) and scale verification to it.
- Use the phase contracts in `agents/` when investigating, implementing, auditing, or preparing to ship.
- Classify findings P0–P3 (`docs/QUALITY.md`); do not expand scope silently.
- Stop for explicit human approval before destructive or production-affecting actions.
