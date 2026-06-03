# 07 — Earn + redeem reward (idempotent) + receipt

Label: ready-for-agent · Type: AFK
Source: docs/prd-loyalty-mvp.md

## What to build

Closing the loop. Reaching N stamps creates a discrete `reward` in state `available` and notifies the customer by WhatsApp. On the staff card screen a **Redeem button appears only when a reward is available**. Redemption is **idempotent** (`available → redeemed`, never reversible, never double-redeemable) and **deducts the threshold while carrying the remainder**. Each redemption is attributed to the staff PIN and fires a **WhatsApp receipt** to the customer — the anti-self-dealing control.

## Acceptance criteria

- [ ] Reaching N creates an `available` reward and sends a bilingual "reward earned" message.
- [ ] Redeem button is shown only when a reward is available.
- [ ] Redemption transitions `available → redeemed` idempotently; a second attempt is a no-op (verified by test).
- [ ] Threshold is deducted and any surplus stamps carry over.
- [ ] Redemption is attributed to staff and a WhatsApp receipt is dispatched to the customer.
- [ ] No receipt is sent for an opted-out enrollment.

## Blocked by

- 06 — Add stamp (+1) + progress message
