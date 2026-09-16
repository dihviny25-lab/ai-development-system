# Architecture Contract Template

> Replace/adapt this template per product. Document architecture that exists; do not invent aspirational architecture as current fact.

## System overview

Describe the major runtime components and responsibilities.

## Stack

### Frontend
- Framework:
- Rendering model:
- State/data fetching:

### Backend
- Runtime/framework:
- API style:

### Data
- Database:
- ORM/query layer:
- Storage:

### Auth
- Authentication:
- Authorization:
- Tenant/data isolation:

### Infrastructure
- Hosting:
- CI/CD:
- Observability:

## Domain boundaries

| Domain | Owns | May depend on |
|---|---|---|
| | | |

## Critical data flows

### Flow: [name]
1.
2.
3.

Failure modes:

## Invariants

These are rules the system must preserve.

- INV-001:
- INV-002:

Where practical, map invariants to automated tests or database constraints.

## Trust boundaries

Document where untrusted input/data enters the system and where authorization must be enforced.

## Database rules

- Migration strategy:
- Transaction requirements:
- Indexing conventions:
- RLS/data-isolation policy:

## Integration rules

For each critical external service document timeout, retry, idempotency, and failure behavior where relevant.

## Performance constraints

Record actual budgets/SLOs only when the product has them. Do not invent arbitrary numbers.

## Architectural changes

Material architecture changes should be recorded in `DECISIONS.md` or an ADR and linked from the implementation PR.