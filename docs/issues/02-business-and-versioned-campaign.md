# 02 — Business + versioned punch-card campaign + active flag

Label: ready-for-agent · Type: AFK
Source: docs/prd-loyalty-mvp.md

## What to build

The café and its loyalty card. Create a `business` and a single punch-card `campaign` configured with: stamps required (N), reward description (free text), card title/colour, and a per-transaction stamp cap. Campaigns are **versioned**: editing terms creates a new version applied going forward, while in-flight cards keep the terms they were created under. A business carries an **active/suspended** flag used for manual billing control.

For the MVP this is exercised via the internal admin path (Prisma Studio / minimal server actions) — no self-serve café signup.

## Acceptance criteria

- [ ] A business can be created and toggled active/suspended.
- [ ] A versioned punch-card campaign can be created with N, reward text, title/colour, and per-transaction cap.
- [ ] Editing campaign terms produces a new version; existing in-flight cards remain bound to their original version (verified by test).
- [ ] Only one active campaign per business is exposed.
- [ ] Domain tests cover versioning and the active flag against real Postgres.

## Blocked by

- 01 — Walking skeleton + test harness + messaging port
