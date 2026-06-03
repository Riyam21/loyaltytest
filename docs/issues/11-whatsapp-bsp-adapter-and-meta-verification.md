# 11 — Real WhatsApp adapter + Meta verification + template approval

Label: ready-for-agent · Type: HITL
Source: docs/prd-loyalty-mvp.md

## What to build

The real messaging backbone behind the `MessageSender` port. Select the **flat-fee BSP (360dialog-class)** — explicitly avoiding per-message-markup providers — complete **Meta business verification** tied to the Qatar company, submit and get approval for the **bilingual utility templates** (welcome, progress, reward-earned, redemption receipt), and implement the real BSP adapter behind the existing port. Configure the shared platform sender number with the café name carried in the message body.

This is **HITL**: it requires human paperwork and waits on Meta's review queues. It does **not** block the build spine (slices 01–10 run against the in-memory fake) and should be started in parallel from day 1, as it is the real critical path.

## Acceptance criteria

- [ ] Flat-fee BSP selected and account provisioned; no per-message markup.
- [ ] Meta business verification completed for the Qatar entity.
- [ ] Bilingual utility templates (welcome, progress, reward-earned, receipt) approved.
- [ ] Real adapter implemented behind `MessageSender`; messages deliver to a live test number.
- [ ] Café name appears in the message body on the shared sender.
- [ ] Switching the app from fake to real sender requires no domain-code changes (port is the only swap point).

## Blocked by

- 01 — Walking skeleton + test harness + messaging port
