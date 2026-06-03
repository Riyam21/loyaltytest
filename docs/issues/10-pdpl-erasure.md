# 10 — Manual deletion / anonymisation (PDPPL erasure)

Label: ready-for-agent · Type: AFK
Source: docs/prd-loyalty-mvp.md

## What to build

The PDPPL right-to-erasure capability. A founder/admin action that deletes or anonymises a `person` and all their enrollments on request. For the MVP this is an internal action (not a self-serve portal), but it must be reliably possible and leave no orphaned personal data.

## Acceptance criteria

- [ ] An admin action erases/anonymises a person and all linked enrollments, stamps, and rewards' personal references.
- [ ] No personal data (phone, name) remains retrievable after erasure (verified by test).
- [ ] Aggregate/anonymous counts may remain, but are no longer linkable to the person.

## Blocked by

- 03 — Click-to-WhatsApp enrolment
