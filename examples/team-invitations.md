# Example: Team Invitations (R3)

A fictional walkthrough of one material feature through the full lifecycle. The product ("Boardly", a task board SaaS), files, and data are invented for illustration. Outputs are abbreviated but follow the real contracts in `agents/`.

**Request (Issue #42):** "Workspace admins should be able to invite teammates by email. The invitee clicks a link, signs in or signs up, and joins the workspace."

---

## 1. Orchestrator — intake

```text
Risk profile: R3
Reason: creates a new path for users to gain access to a workspace (authorization),
        sends email to external addresses (abuse surface), adds a table (migration).
Specialists applicable: architecture, security, database, reliability, UX, regression.
Specialists not applicable: performance (low volume; revisit if invitations are bulk).
```

## 2. Discovery (`agents/discovery.md`)

### Requested outcome
Admins invite by email; invitee accepts via link and becomes a member with the role chosen by the admin.

### Current implementation
- Membership is a `workspace_members(workspace_id, user_id, role)` table; the only insert path is workspace creation (`src/server/workspaces/create.ts:31`).
- Roles: `owner`, `admin`, `member` (`src/server/auth/roles.ts`).
- Authorization helper `requireRole(workspaceId, 'admin')` is used by all admin routes (`src/server/auth/guard.ts:12`).
- Transactional email exists for password reset (`src/server/email/send.ts`), provider called synchronously.

### Risks
- Anyone holding a link could join → token must be unguessable, single-use, expiring, bound to the invited email.
- An admin could invite with role `owner` → privilege escalation.
- Email sending in the request path can time out.

### Unknowns
- Should invites to already-registered emails behave differently? → Asked product; answer: no, same flow.

### Proposed acceptance criteria
- AC1 Admins/owners can invite an email with role `member` or `admin`; members cannot invite.
- AC2 Nobody can invite with role `owner`.
- AC3 The invite link works once, expires after 7 days, and only for a signed-in user whose verified email matches.
- AC4 Re-inviting the same pending email does not create duplicates; it re-sends the existing invite.
- AC5 Admins can revoke a pending invite; revoked links fail with a clear message.
- AC6 Sending email never blocks or fails the invite request; failures are visible to the admin.

## 3. Architecture (`agents/architecture.md`)

```text
Status: PASS
Affected boundaries: workspace membership (authorization), email integration.
Invariants:
  I1 A user is a member of a workspace only via creation or an accepted invite.
  I2 At most one pending invite per (workspace, email).
  I3 Invite tokens are never stored in plaintext.
Recommended design:
  - Table invitations(id, workspace_id, email_normalized, role, token_hash,
    status[pending|accepted|revoked|expired], expires_at, invited_by, created_at).
  - Partial unique index on (workspace_id, email_normalized) WHERE status = 'pending'.
  - Token: 32 random bytes, sent in the link; only SHA-256 hash stored.
  - Accept: one transaction — lock invite row, check status/expiry/email match,
    insert membership (ON CONFLICT DO NOTHING), set status=accepted.
  - Email sent by the existing job runner, not in the request.
Alternatives considered:
  - Signed stateless JWT link — rejected: cannot revoke (AC5) without a denylist.
  - Magic link that also signs in — rejected: widens auth scope; out of scope.
Decision-log update needed: yes → DEC-007 "Invitation tokens are hashed, single-use, revocable"
```

## 4. Plan (`/ads-plan`)

```text
Risk profile: R3
Non-goals: bulk invite, invite via shareable link without email, SSO/domain auto-join.
Steps:
  1. Migration: invitations table + partial unique index (runbook required).
  2. POST /workspaces/:id/invitations (requireRole admin; role ∈ {member, admin}).
  3. DELETE /workspaces/:id/invitations/:inviteId (revoke).
  4. POST /invitations/accept (authenticated; token in body).
  5. Enqueue email job; show delivery status in the admin list.
  6. Admin UI: invite form, pending list with revoke/resend.
Verification plan:
  AC1 → integration tests: admin 201, member 403
  AC2 → integration test: role=owner → 422
  AC3 → integration tests: reuse → 410, expired → 410, email mismatch → 403
  AC4 → integration test: two invites same email → one row, second call re-enqueues
  AC5 → integration test: revoke then accept → 410; E2E: revoked message shown
  AC6 → unit test: email provider error → job retried, invite status unaffected
Human approval required: yes — production migration.
```

Plan approved by the workspace product owner on the Issue.

## 5. Implement (`agents/implementation.md`)

```text
Status: ready for verification
Files changed:
  migrations/0031_invitations.sql
  src/server/invitations/{create,revoke,accept}.ts
  src/server/jobs/sendInvitationEmail.ts
  src/app/settings/members/InviteForm.tsx, PendingInvites.tsx
  tests/integration/invitations.test.ts, tests/e2e/invite.spec.ts
Implementation decisions:
  - Email normalized with trim + lowercase before hashing uniqueness.
  - Accept uses SELECT … FOR UPDATE on the invite row.
Discoveries outside scope:
  - Password-reset email is also sent synchronously → recorded as Issue #57 (P3).
```

## 6. Verify (`/ads-verify`)

```text
$ npm run lint        → 0 problems
$ npm run typecheck   → 0 errors
$ npm test -- invitations
  ✓ admin can invite member (AC1)
  ✓ member cannot invite (AC1)
  ✓ owner role is rejected (AC2)
  ✓ token reuse returns 410 (AC3)
  ✓ expired token returns 410 (AC3)
  ✓ email mismatch returns 403 (AC3)
  ✓ duplicate pending invite is deduplicated (AC4)
  ✓ revoked invite cannot be accepted (AC5)
  ✓ provider failure retries without changing invite (AC6)
  9 passed
$ npm run build       → success
$ npm run e2e -- invite.spec.ts → 3 passed (invite, accept, revoked message)
```

Migration applied to a preview database branch; up and down migrations both ran cleanly.

## 7. Quality gate (`/ads-qualitygate`)

Specialist audits ran in parallel; consolidated findings:

```text
ID: QG-1
Gate: Security/authorization
Severity: P1
Evidence: accept.ts compares invite.email to user.email, but user.email is not
          required to be verified; an attacker can sign up with the victim's
          address unverified and accept.
Impact: joining a workspace with another person's invitation.
Current scope: yes
Recommended action: require email_verified = true before accept.
Verification after fix: new test "unverified email cannot accept" → 403.

ID: QG-2
Gate: Concurrency/integrity
Severity: P2
Evidence: double-clicking "Invite" sends two requests; second hits the unique
          index and returns 500 instead of the dedup behavior (AC4).
Current scope: yes
Recommended action: catch unique violation → treat as re-send; disable button while pending.

ID: QG-3
Gate: Accessibility
Severity: P3
Evidence: revoke icon button has no accessible name.
Current scope: yes (cheap) → fixed.

ID: QG-4
Gate: Abuse/rate limiting
Severity: P2
Evidence: no per-workspace limit on invitations; could be used to send spam.
Current scope: no → Issue #58 (limit 50 invites/day/workspace).
```

QG-1 blocked shipping. Back to implement → verify: 10 invitation tests pass, including the new verified-email test. QG-2 and QG-3 fixed in the same loop. QG-4 deferred and tracked.

## 8. Code review (`/ads-codereview`)

No P0/P1. One P3 naming suggestion applied.

## 9. Ship (`agents/ship.md`)

```text
Ship state: READY_WITH_FOLLOWUPS
Risk profile: R3
Blocking items: none (QG-1 fixed and verified)
Evidence summary: 10 integration + 3 E2E tests; migration up/down on preview branch.
Required human approvals: production migration 0031 — approved on Issue #42.
Deployment prerequisites: run migration before deploying the app (additive, backwards compatible).
Post-deploy checks: see below.
Deferred follow-ups: #57 (P3 async password reset email), #58 (P2 invite rate limit).
```

Migration runbook filled from `templates/MIGRATION_RUNBOOK.md` (additive table; no locks on existing tables; rollback = drop table, safe because no other table references it).

## 10. Observe (`/ads-postdeploy`)

| Signal | Baseline | After 24 h | Assessment |
|---|---|---|---|
| 5xx on invitation routes | — | 0 | Healthy |
| Invitation email job failures | — | 2 of 311, both retried successfully | Healthy |
| Accept → 403/410 rate | — | 4% (mostly expired links) | Expected |

Critical journey (invite → email → accept → member list) validated manually in production with an internal test workspace.

**Decision:** Healthy with follow-ups (#57, #58). Observation closed.

---

### What this example demonstrates

- Risk assignment drove the depth: R3 triggered architecture review, a runbook, human approval, and post-deploy checks.
- Tests passing did not prove security: the quality gate found QG-1 despite a green suite.
- Findings were classified, not automatically fixed: QG-4 was valid but out of scope and was tracked.
- "Done" came from evidence after deployment, not from the merge.
