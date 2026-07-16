# Agent rules

- Read PROJECT_AI_NOTES.md before doing major work.
- Prefer small diffs.
- Ask before touching secrets, .env, deployment, infra, auth, billing.
- Follow existing code style.
- Update PROJECT_AI_NOTES.md at meaningful checkpoints.

## OpenCode usage in this template
- Treat this repository as a project-scoped OpenCode workspace.
- Personalize `AGENTS.md` after cloning so the rules match the new project.
- Use `PROJECT_AI_NOTES.md` to track decisions, checkpoints, and pending items across sessions.
- If you use custom commands in your OpenCode setup, document project-specific ones here or in the repository docs.

## Current Focus — 2026-07-15 (Sessione 15 — Migrazione Supabase Completa + Test OK)

### Completato
- **Database Restore:** Tutte le tabelle migrati su target `cgvztkgbzecyregjrtsh` (products=616, attribute_options=292, product_collections=331, collections=21, profiles=4, orders=14, settings=5, legal_pages=3, price_lists=1, user_roles=1, order_items=23, categories=0).
- **Storage Migration:** 607/607 file .jpg migrati. 610/610 image_urls aggiornati. Bucket `ecommerceBUK` pubblico con RLS service_role-write ✅.
- **Auth Users:** 4 utenti creati + profili collegati. Fix bcrypt password + NULL token columns.
- **Edge Functions:** 3 funzioni deployate (send-order-email, admin-create-user, admin-delete-user).
- **Webhook + RESEND_API_KEY:** Configurati in Dashboard.
- **Security Remediation:** ACL funzioni, RLS tabelle (incluse 3 nuove su accessory_rules, audit_logs, categories), storage bucket policy (4 policies). Aggiunta policy `product_accessory_overrides`.
- **app/.env:** Aggiornato per target `cgvztkgbzecyregjrtsh`.
- **Test Playwright:** Login ✅, Admin panel ✅, 616 prodotti ✅, 21 collezioni ✅, Impostazioni ✅.

### Bloccato / Da decidere
- Assegnare categorie ai 65 prodotti orfani (`category_id = NULL`) — **serve decisione CEO**.

### Prossimi step
1. **Go-live target** — switch DNS/Vercel al target `cgvztkgbzecyregjrtsh`

### Data Ultimo Aggiornamento: 2026-07-16
