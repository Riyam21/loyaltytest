# 03 — Click-to-WhatsApp enrolment

Label: ready-for-agent · Type: AFK
Source: docs/prd-loyalty-mvp.md

## What to build

The primary, fraud-free enrolment path. Generate a **per-café QR / wa.me link** that opens WhatsApp with a pre-filled "join" message. When the customer sends it, the inbound webhook: deduplicates or creates a platform-global `person` by phone number, creates a per-café `enrollment`, writes a `consent_log` entry (timestamp, method, café scope), and sends a **bilingual (Arabic + English) welcome** via the `MessageSender`. Per-café visibility is enforced — a café never sees a person's data from another café; on a known phone the underlying person key is reused silently and name/consent are collected fresh.

## Acceptance criteria

- [ ] Per-café enrolment QR / wa.me link is generated and resolvable.
- [ ] Inbound webhook creates person (deduped by phone) + per-café enrollment + consent_log.
- [ ] Bilingual welcome message dispatched via the fake sender (asserted in tests).
- [ ] Re-enrolling an existing phone at a new café reuses the person silently and does NOT expose other cafés' data (verified by test).
- [ ] Only phone + optional first name are collected.

## Blocked by

- 01 — Walking skeleton + test harness + messaging port
- 02 — Business + versioned punch-card campaign + active flag
