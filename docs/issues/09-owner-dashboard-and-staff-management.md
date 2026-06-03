# 09 — Owner dashboard + staff management

Label: ready-for-agent · Type: AFK
Source: docs/prd-loyalty-mvp.md

## What to build

The value-and-trust surface that drives pilot → paid conversion. An owner-only view (entered via owner PIN) showing: active members, stamps issued this period, rewards redeemed, a returning-customers signal, and a **per-staff activity log** of stamps and redemptions (the fraud control). The owner can **add and remove staff names/PINs**. Read-only on data; no campaign config here (that's the cut self-serve flow). Bilingual UI.

## Acceptance criteria

- [ ] Owner-only access gated by owner role/PIN; staff cannot view it (verified at the HTTP seam).
- [ ] Dashboard shows active members, stamps this period, rewards redeemed, and a returning-customers signal.
- [ ] Per-staff activity log lists stamps and redemptions with attribution and timestamps.
- [ ] Owner can add and remove staff PINs.
- [ ] Bilingual Arabic/English, RTL-correct.

## Blocked by

- 06 — Add stamp (+1) + progress message
- 07 — Earn + redeem reward (idempotent) + receipt
