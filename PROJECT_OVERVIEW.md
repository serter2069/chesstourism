# ChessTourism — Project Overview

## Tagline
Discover, register, and play in FIDE-rated chess tournaments worldwide.

## Description
Platform for the International Chess Tourism Association. Connects players, certified commissars, and venues across 50+ countries for discovering and participating in FIDE-rated chess tournaments. Handles registration, payments, ELO tracking, and certificate issuance.

## Roles
- **GUEST** — Unauthenticated visitor. Can browse tournaments, commissars, ratings. Cannot register or pay.
- **PLAYER** — Registered user. Can register for tournaments, pay fees, track ELO history, view results.
- **COMMISSAR** — Certified tournament organizer. Can create/manage tournaments, manage registrations, record results, issue certificates.
- **ADMIN** — Platform administrator. Full access to users, tournaments, organizations, finances, disputes, webhooks.

## Scenarios
### S-001: Player registers for a tournament (PLAYER)
1. Guest browses Tournament Catalog (landing → /tournaments)
2. Opens Tournament Detail (/tournaments/:id)
3. Clicks "Register" → redirected to Login if not authenticated
4. Logs in via Email OTP ((auth)/login → (auth)/otp)
5. Returns to tournament, confirms registration form (FIDE ID, agreement)
6. Pays entry fee (/payment/:id)
7. Receives confirmation email + notification
8. Views registration in My Registrations (/my-registrations)

### S-002: Commissar creates and runs a tournament (COMMISSAR)
1. Logs in → Commissioner Cabinet (/commissioner)
2. Creates tournament (multi-step form: /tournaments/create)
3. Publishes → tournament appears in catalog
4. Manages registrations (/tournaments/:id/registrations)
5. Runs rounds: generate pairings, record results (/tournaments/:id/rounds, /results)
6. Uploads photos (/tournaments/:id/photos)
7. Posts announcements (/tournaments/:id/announcements)
8. Finalizes results → ELO updated automatically
9. Issues certificates

### S-003: Organization applies to host tournaments (COMMISSAR)
1. Visits Organization Apply page (/organizations/apply)
2. Submits form (org name, country, FIDE federation code, venue details)
3. Admin reviews in Admin Organizations (/admin/organizations)
4. Approved → org can now create tournaments via commissar accounts

### S-004: Admin moderates a dispute (ADMIN)
1. Player submits dispute after result recorded incorrectly
2. Admin sees dispute in Admin Moderation (/admin/moderation)
3. Reviews both parties messages
4. Resolves: corrects result or dismisses
5. ELO recalculated if needed
