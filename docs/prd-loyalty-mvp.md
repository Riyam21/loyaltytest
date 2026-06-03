# PRD — WhatsApp-Native Loyalty Platform (MVP)

> Status: Ready for agent
> Market: Qatar (Doha), independent cafés first
> Wedge: WhatsApp-native + Arabic-first + local — **not** "low cost"

## Problem Statement

Independent cafés and small businesses in Qatar still run loyalty on paper punch cards. Paper cards get lost, are trivially forged, give the owner zero visibility into whether loyalty actually drives repeat visits, and offer no way to re-engage a customer between visits. Existing digital alternatives either are generic global tools (English-first, Wallet/app-based, no local billing) or require the customer to install yet another app — so adoption dies at the counter. The café owner wants something that is *easier than paper*, that customers will actually use, and that proves it is bringing people back — without buying hardware, installing apps, or wrestling enterprise software.

## Solution

A WhatsApp-native digital loyalty service. The customer joins a café's loyalty card in ~5 seconds by scanning a counter QR that opens WhatsApp with a pre-filled "join" message; sending it opts them in and hands the café their verified WhatsApp number. After each purchase, staff look the customer up by phone number on a shared counter device (a PWA) and tap "+1"; the customer receives a WhatsApp confirming their progress ("7/9 ☕ — 2 more for a free coffee!"). When the threshold is reached the reward becomes redeemable; staff redeem it from the same screen and the customer gets a WhatsApp receipt — which doubles as the owner's anti-fraud control. The owner sees a minimal dashboard (key counts + a per-staff activity log). Everything customer-facing lives inside WhatsApp — no customer app — and the whole experience is bilingual Arabic/English.

For the MVP, the founder onboards each pilot café by hand (creates the business, configures the campaign, prints the QR), billing is collected manually with an "active" flag, and there is no self-serve café signup.

## User Stories

### Customer (end consumer)
1. As a café customer, I want to join a loyalty card by scanning one QR and sending a pre-filled WhatsApp message, so that I can enrol without installing an app or filling a form.
2. As a café customer, I want my opt-in to happen by my own action (sending the WhatsApp), so that I only get messages I actually agreed to.
3. As a café customer, I want a WhatsApp confirmation after each stamp showing my progress, so that I always know how close I am to a reward without opening anything new.
4. As a café customer, I want a WhatsApp message when I earn a reward, so that I know I can claim a free item on my next visit.
5. As a café customer, I want a WhatsApp receipt when a reward is redeemed, so that I have proof it was used and can spot if staff redeemed it without giving it to me.
6. As a café customer, I want to give only my phone number and optionally my first name, so that I share as little personal data as possible.
7. As a café customer, I want to read messages and prompts in Arabic or English, so that I can use the service in my own language.
8. As a café customer, I want to opt out at any time by replying STOP or blocking, so that I can stop receiving messages immediately.
9. As a café customer, I want my card at one café to be independent of my card at another, so that businesses cannot see where else I shop.
10. As a café customer, if I had extra stamps beyond a reward, I want the surplus carried over after redemption, so that I do not lose stamps I earned.

### Staff (counter)
11. As a staff member, I want to open an always-logged-in PWA on the shared counter device, so that I do not have to sign in every shift.
12. As a staff member, I want to identify myself with a 4-digit PIN, so that my actions are attributed to me without a slow login.
13. As a staff member, I want to find a customer by typing their phone number, so that I can add a stamp quickly during a busy line.
14. As a staff member, I want to see the customer's current progress and any available reward on one screen, so that I do not navigate between places.
15. As a staff member, I want to tap "+1" to add a stamp, so that I can reward a purchase in one action.
16. As a staff member, I want to add several stamps at once up to an owner-set cap, so that I can handle a multi-item purchase quickly.
17. As a staff member, I want a "Redeem" button to appear only when a reward is available, so that I cannot accidentally redeem when none is due.
18. As a staff member, I want to enrol a customer manually by entering their phone number (fallback) when they will not scan the QR, so that no customer is turned away.

### Owner
19. As an owner, I want to identify myself with a PIN and see an owner-only dashboard, so that staff cannot see business-level data.
20. As an owner, I want to see active members, stamps issued this period, and rewards redeemed, so that I can tell the program is working.
21. As an owner, I want a per-staff activity log of stamps and redemptions, so that I can detect staff giving away free product.
22. As an owner, I want to see a returning-customers signal, so that I can judge whether loyalty drives repeat visits.
23. As an owner, I want to add and remove staff names/PINs myself, so that I can handle staff churn without IT help.
24. As an owner, I want the café name to appear in every customer message, so that customers know who is messaging them even on a shared sender number.

### Founder / internal admin
25. As the founder, I want to create a business and its campaign on a customer's behalf, so that I can onboard pilots by hand without building self-serve signup.
26. As the founder, I want to generate a printable per-café enrolment QR, so that the café can put it on the counter.
27. As the founder, I want to toggle a business active/suspended, so that I can manage manual billing without an automated gateway.
28. As the founder, I want to manually delete or anonymise a person and their enrolments on request, so that I can honour PDPPL erasure requests.
29. As the founder, I want every stamp and redemption stored with staff attribution and timestamp, so that disputes and fraud can be investigated.

### Messaging / consent (cross-cutting)
30. As the platform, I want to log each opt-in with timestamp, method, and café scope, so that consent can be proven to Meta and the regulator.
31. As the platform, I want to suppress all messaging to an opted-out enrolment, so that I never message someone who left.
32. As the platform, I want the café name carried in the message body, so that branding works on a shared sender number.
33. As the platform, I want to send stamp/reward/redeem messages as approved utility templates, so that business-initiated messages are deliverable outside the service window.
34. As the platform, I want the messaging channel to be swappable behind one interface, so that SMS fallback or a different provider can be added without rework.

## Implementation Decisions

### Architecture & stack
- **Single Next.js + PostgreSQL monolith**, hosted in a **GCC cloud region** (AWS `me-south-1` Bahrain or UAE). All three surfaces (staff PWA, owner dashboard, internal admin) are one role-gated app. The customer surface is WhatsApp — no separate customer app is built.
- **No microservices, no native app, no separate customer frontend.** Internal admin starts as Prisma Studio / Retool over Postgres; a real admin UI is built only when manual becomes painful.

### Data model (hybrid identity, ADR-worthy)
- `person` — one row per phone number, platform-global, deduplicated. Never exposed across cafés.
- `enrollment` — one row per (person ↔ business). Carries that café's stamps, **its own consent record**, and is the unit of data visibility. A café only ever sees its own enrolments.
- `business`, `staff` (name + 4-digit PIN, role: owner | staff), `campaign` (versioned), `stamp_event` (with staff attribution + timestamp + quantity), `reward` (state: `available | redeemed`, idempotent), `consent_log` (timestamp, method, café scope), `message_log`.
- When a new café enrols a phone that already exists as a `person`, the underlying person key is reused silently; the café re-collects name + consent fresh and is **never** shown the person's data from other cafés.

### Loyalty / campaign rules
- One **punch card** campaign per café. Configurable: stamps required (N), reward description (free text), card title/colour, and per-transaction stamp cap.
- **Campaigns are versioned.** Editing terms (e.g. N) applies going forward; in-flight cards keep the terms they were created under.
- **Redemption:** reward is a discrete entity transitioning `available → redeemed`, **idempotent** (a redeemed reward can never be re-redeemed). On redeem, deduct the threshold and **carry the remainder**.
- Multi-stamp per transaction allowed up to the owner-set cap.
- Out for MVP: stamp/reward expiry, POS integration, tiered/variable rewards, points-based rewards.

### Messaging (WhatsApp)
- **WhatsApp-first** via a **flat-fee BSP (360dialog-class)** — explicitly avoid per-message-markup providers (e.g. Twilio) to protect margin. Cloud-API-direct is a later cost optimisation.
- **Shared platform sender number** for the MVP; café identity carried in the **message body**. Per-café branded WhatsApp is a later paid upgrade.
- All outbound business-initiated messages are **approved utility templates**, **bilingual (Arabic + English)**.
- Outbound messaging sits behind a single **`MessageSender` port** so the channel/provider is swappable (SMS fallback later).
- **Enrolment = inbound click-to-WhatsApp** (customer sends a pre-filled message via counter QR) as primary; staff-entered confirmation as fallback. Inbound webhook handles enrolment and `STOP` opt-out.

### Staff / access
- One business account; **named staff each with a 4-digit PIN**. Counter device stays logged into the business; staff identify per-action via PIN. Every stamp and redemption is attributed and logged.
- Owner role: dashboard + staff management + everything staff can do. Staff role: lookup, stamp, redeem (all attributed). Redemption is staff-allowed but always customer-notified.
- Staff surface is a **PWA**, **online-only** for MVP (offline-queue is a later upgrade).

### Privacy / compliance (PDPPL)
- **Mandatory MVP:** consent log per enrolment; universal opt-out (STOP keyword + WhatsApp block → suppress messaging); manual deletion/anonymisation capability; minimal data (phone + optional first name); bilingual privacy policy + terms.
- Café framed as **data controller**, platform as **processor**, via standard terms (formal per-café DPA deferred). Self-serve DSAR tooling deferred.

### Business / GTM
- **Incorporate in Qatar.** Manual billing (bank transfer / cash) + **active-flag** per business for the pilot; Tap Payments / MyFatoorah gateway integration deferred until post-PMF.
- **Founder-led onboarding** for the first cohort; self-serve café signup is cut.
- **Pricing:** single flat QAR plan (~QAR 149–249), **volume-bounded** (active members / messages) with overage. Feature-tiers deferred. Rationale: WhatsApp is the dominant variable cost (~$16–48/mo per active café); never price flat-and-unlimited.

## Testing Decisions

A good test asserts **external behaviour** — observable database state changes and messages dispatched — never internal implementation details. Mock **only** the two true externals: the outbound BSP send and inbound webhook payloads. Do **not** mock Prisma or internal modules.

Seams (highest first):
1. **Domain / use-case layer over a real test Postgres** *(primary seam).* Verify `enroll`, `addStamp`, `earnReward`, `redeem`, and consent/opt-out as real behaviour against a throwaway Postgres. Covers: idempotent redemption (cannot double-redeem), deduct-and-carry remainder, versioned-campaign edits not affecting in-flight cards, per-transaction stamp cap, staff attribution recorded, hybrid identity (café cannot see another café's enrolment).
2. **Outbound messaging port.** Inject an **in-memory fake `MessageSender`**; assert the correct template + recipient fire on enrol / stamp / reward-earned / redeem, that the café name is in the body, and that **nothing** is sent for an opted-out enrolment. The real BSP adapter is never hit in tests.
3. **Inbound webhook handler.** Feed synthetic WhatsApp webhook payloads (click-to-WhatsApp enrol, `STOP`) and assert enrolment creation, consent-log entry, and opt-out state transition.
4. **HTTP / server-action layer** *(thin end-to-end).* Drive the API the PWA calls with a real DB and faked messaging port; assert role/PIN gating (staff cannot reach owner data).

Prior art: none yet (greenfield). Establish (1) and (2) first as the reference patterns for all later tests.

## Out of Scope

Customer mobile app; SMS-first delivery; per-café branded WhatsApp sender; self-serve café signup / campaign-creation wizard; billing automation and payment-gateway integration; native mobile apps; stamp/reward expiry; POS integration; tiered/variable or points-based rewards; full analytics dashboard; offline stamping; code-confirmed redemption; multi-branch support; referral programs; Apple/Google Wallet integration; white-label. All are explicitly deferred to post-MVP.

## Further Notes

- **Margin and reputation both live on WhatsApp.** Cost is controlled via volume-bounded pricing + flat-fee BSP; the **shared sender's quality rating** is protected via strict consent + opt-out hygiene. A throttled shared number that all cafés depend on is the highest-severity risk.
- **Critical-path dependency:** Meta / WhatsApp Business verification (tied to the Qatar company) and utility-template approval run through Meta's review queues. **Start this paperwork on day 1, in parallel with the build** — it, not the code, is the long pole.
- **Pilot success gates (set concrete thresholds before launch):** (1) café week-6 active retention [primary], (2) pilot → paid conversion, with (3) customer opt-out rate as a guardrail.
- **Build sequence (solo founder):** build the spine end-to-end first — enrol → stamp → message → redeem → receipt — verified with one real café (the founder) before owner dashboard and admin.
- **Still open:** exact price point and included-volume within the band; concrete success thresholds; specific BSP and GCC region; free-pilot length (1 vs 2 months).
