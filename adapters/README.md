# Client Adapters

The core system is vendor-independent: `AGENTS.md` plus the contracts in `agents/` and `docs/`. Adapters only tell a specific AI client where to find those rules. They must not duplicate or fork the rules themselves — point to `AGENTS.md` instead, so there is one source of truth.

| Client | How it loads the rules | What to copy |
|---|---|---|
| Codex, and other clients that read `AGENTS.md` | Reads `AGENTS.md` natively | Nothing extra |
| Claude Code | Reads `CLAUDE.md`, which imports `AGENTS.md` with `@AGENTS.md`; project slash commands in `.claude/commands/` | `CLAUDE.md`, `.claude/commands/` |
| Cursor | Project rules in `.cursor/rules/*.mdc` | `adapters/cursor/ai-development-system.mdc` → `.cursor/rules/ai-development-system.mdc` |
| GitHub Copilot | Repository instructions in `.github/copilot-instructions.md` | `adapters/copilot/copilot-instructions.md` → `.github/copilot-instructions.md` |

`scripts/adopt.sh --adapters` copies these into a target repository without overwriting existing files.

## Command naming

The conceptual commands in `commands/README.md` (`/discover`, `/plan`, …) ship for Claude Code as `/ads-discover`, `/ads-plan`, and so on. The `ads-` prefix (AI Development System) avoids collisions with client built-ins such as `/plan` and `/review`.

For clients without slash commands, use plain language that names the phase and the contract, for example: "Run the discovery phase from `agents/discovery.md` for Issue #42; do not edit files."

## Writing a new adapter

1. Find the client's documented project-instruction location.
2. Reference `AGENTS.md` and the relevant `agents/*.md` contracts by path.
3. Keep client-specific content to loading/mechanics only.
4. Add a row to the table above and, if useful, a flag in `scripts/adopt.sh`.
