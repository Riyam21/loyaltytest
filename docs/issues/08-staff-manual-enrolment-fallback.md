# 08 — Staff-entered manual enrolment (fallback)

Label: ready-for-agent · Type: AFK
Source: docs/prd-loyalty-mvp.md

## What to build

The fallback for customers who won't scan the QR. From the staff PWA, staff enter a phone number to enrol the customer directly. This reuses the same person-dedup + enrollment + consent_log path as click-to-WhatsApp, with consent method recorded as staff-entered, and sends the bilingual welcome.

## Acceptance criteria

- [ ] Staff can enrol a customer by entering a phone number from the PWA.
- [ ] Person dedup + per-café enrollment + consent_log are created (consent method = staff-entered).
- [ ] Bilingual welcome dispatched via the fake sender.
- [ ] Same per-café visibility guarantees as click-to-WhatsApp enrolment.

## Blocked by

- 05 — Staff PWA: session + PIN + customer lookup
- 03 — Click-to-WhatsApp enrolment
