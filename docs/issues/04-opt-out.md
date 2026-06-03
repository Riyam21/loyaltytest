# 04 — Opt-out (STOP / block)

Label: ready-for-agent · Type: AFK
Source: docs/prd-loyalty-mvp.md

## What to build

The universal exit required by PDPPL and WhatsApp policy. An inbound `STOP` keyword (or WhatsApp block signal) transitions the relevant enrollment to **opted-out**, and the `MessageSender` suppresses all subsequent messages to that enrollment at send time. Opt-out is scoped per enrollment (per café), consistent with the hybrid identity model.

## Acceptance criteria

- [ ] Inbound `STOP` transitions the enrollment to opted-out.
- [ ] WhatsApp block signal is handled equivalently where available.
- [ ] No message is dispatched for an opted-out enrollment (verified by test against the fake sender).
- [ ] Opt-out is per-café; other enrollments for the same person are unaffected.

## Blocked by

- 03 — Click-to-WhatsApp enrolment
