# 06 — Add stamp (+1) + progress message

Label: ready-for-agent · Type: AFK
Source: docs/prd-loyalty-mvp.md

## What to build

The core daily action. From the customer's card screen, staff tap **+1** (or add several stamps at once, up to the owner-set per-transaction cap). Each stamp writes a `stamp_event` with **staff attribution and timestamp**, and triggers a **bilingual progress WhatsApp** ("7/9 ☕ — 2 more for a free coffee!") via the `MessageSender`. Honours opt-out (no message if opted-out).

## Acceptance criteria

- [ ] Tapping +1 records a stamp_event attributed to the identifying staff PIN.
- [ ] Multi-stamp in one action is allowed up to the per-transaction cap; over-cap is rejected (verified by test).
- [ ] A bilingual progress message is dispatched on each stamp (asserted via fake sender).
- [ ] No message is sent for an opted-out enrollment.
- [ ] Domain tests cover attribution, cap enforcement, and progress calculation against real Postgres.

## Blocked by

- 05 — Staff PWA: session + PIN + customer lookup
