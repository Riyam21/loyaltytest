# 01 — Walking skeleton + test harness + messaging port

Label: ready-for-agent · Type: AFK
Source: docs/prd-loyalty-mvp.md

## What to build

The end-to-end foundation every later slice rides on. A Next.js + PostgreSQL monolith that boots, persists one trivial entity, and reads it back through the real app stack — proving the full path works. Establish the test harness against a **real throwaway Postgres** (not a mocked Prisma), and define the outbound `MessageSender` port with an **in-memory fake** so all later slices can assert messaging behaviour without touching a real provider.

This slice exists to lock the two primary test seams (domain-over-real-Postgres, and the messaging port) before any feature is built.

## Acceptance criteria

- [ ] App boots locally and serves a health route backed by a real DB read.
- [ ] One persisted entity round-trips through schema → use-case → API.
- [ ] Test suite runs against a real ephemeral Postgres (spun up/torn down per run), no Prisma mocking.
- [ ] `MessageSender` port interface defined; in-memory fake implementation available to tests; tests can assert dispatched messages (recipient + template + payload).
- [ ] Project targets a GCC cloud region for deployment config.

## Blocked by

- None — can start immediately.
