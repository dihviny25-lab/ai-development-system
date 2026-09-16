# AI Development System

A reusable, evidence-driven protocol for building software with AI agents without sacrificing engineering quality.

## Core principle

> Code written is not work completed. Completion requires verifiable evidence.

## Lifecycle

`DISCOVERY → CONTEXT → ARCHITECTURE → PLAN → IMPLEMENT → VERIFY → QUALITY GATE → SHIP → OBSERVE`

## Goals

- Make AI-assisted development repeatable instead of prompt-dependent.
- Preserve existing behavior and architecture unless change is explicitly justified.
- Require acceptance criteria and evidence before declaring work complete.
- Separate investigation, planning, implementation, verification, and shipping.
- Apply quality gates proportionally instead of blindly overengineering.
- Keep human approval around scope, risk, production changes, and destructive operations.

## Repository structure

- `AGENTS.md` — operating constitution for AI agents.
- `docs/PROTOCOL.md` — complete development lifecycle.
- `docs/QUALITY.md` — quality gates and severity model.
- `docs/DEFINITION_OF_DONE.md` — universal completion criteria.
- `docs/ARCHITECTURE.md` — architecture-contract template.
- `docs/PRODUCT.md` — product-context template.
- `docs/DECISIONS.md` — architectural/product decision log template.
- `agents/` — reusable audit and execution instructions.
- `.github/` — Issue, PR, and CI standards.

## Status

Version 1 is the baseline protocol. Projects adopting it should customize product and architecture context while preserving the lifecycle and evidence requirements.