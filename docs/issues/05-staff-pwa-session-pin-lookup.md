# 05 — Staff PWA: session + PIN + customer lookup

Label: ready-for-agent · Type: AFK
Source: docs/prd-loyalty-mvp.md

## What to build

The counter surface. A PWA that stays persistently logged into the **business** (not per-shift login). Staff identify themselves per-action with a **4-digit PIN**. Staff look a customer up by **phone number** and see, on one screen, the current progress (e.g. 7/9) and whether a reward is available. Bilingual Arabic/English UI with RTL support.

## Acceptance criteria

- [ ] PWA installs ("add to home screen") and persists the business session.
- [ ] Staff identify via 4-digit PIN; identity available for attribution.
- [ ] Customer lookup by phone returns the enrollment's progress and reward state.
- [ ] UI renders correctly in both Arabic (RTL) and English.
- [ ] Role gating: staff cannot reach owner-only data (verified at the HTTP/server-action seam).

## Blocked by

- 01 — Walking skeleton + test harness + messaging port
- 02 — Business + versioned punch-card campaign + active flag
- 03 — Click-to-WhatsApp enrolment
