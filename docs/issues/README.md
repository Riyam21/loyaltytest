# Build issues — WhatsApp-Native Loyalty MVP

Tracer-bullet vertical slices derived from [../prd-loyalty-mvp.md](../prd-loyalty-mvp.md).
Each slice cuts end-to-end (schema → domain → API → UI/WhatsApp → tests) and is demoable on its own.
All carry the `ready-for-agent` label for import into a real tracker later.

| # | Slice | Type | Blocked by |
|---|-------|------|------------|
| 01 | Walking skeleton + test harness + messaging port | AFK | — |
| 02 | Business + versioned punch-card campaign + active flag | AFK | 01 |
| 03 | Click-to-WhatsApp enrolment | AFK | 01, 02 |
| 04 | Opt-out (STOP / block) | AFK | 03 |
| 05 | Staff PWA: session + PIN + lookup | AFK | 01, 02, 03 |
| 06 | Add stamp (+1) + progress message | AFK | 05 |
| 07 | Earn + redeem reward (idempotent) + receipt | AFK | 06 |
| 08 | Staff-entered manual enrolment (fallback) | AFK | 05, 03 |
| 09 | Owner dashboard + staff management | AFK | 06, 07 |
| 10 | Manual deletion / anonymisation (PDPPL erasure) | AFK | 03 |
| 11 | Real WhatsApp adapter + Meta verification + templates | HITL | 01 |

## Suggested order

Spine first (demoable to a real café — the founder — by slice 07):
**01 → 02 → 03 → 05 → 06 → 07**, then **04, 08, 09, 10** in any order.
Run **11 (HITL)** in parallel from day 1 — it's the real critical path (Meta queues) but does not block the spine, which builds against the in-memory fake sender.
