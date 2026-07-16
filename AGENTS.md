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

## Current Focus — 2026-07-16 (Sessione 16 — Bug Fix + Admin UX)

### Completato
- **Go-live Vercel:** Sito live su `https://ecommerce-vetronaviglio.vercel.app` con target Supabase `cgvztkgbzecyregjrtsh` (commit `aed8d85`, deploy `dpl_BoHQhzHqvfiBLp9XENXjZ7Hse7Cr`).
- **Bug fix: Product category persist** — RLS policies su `products` aggiunte (UPDATE/INSERT/DELETE per `authenticated`, ALL per `service_role`). Ora `attributes.categoria` si salva correttamente.
- **Admin UX: Edit icon su card prodotto** — Hook `useIsAdmin.ts` + modifica `ProductCard.tsx`. Icona matita (hover, solo admin/ceo) → `/admin/products/edit/{SKU}`. Deployato commit `21b677d`.
- **Audit logs verificati** — 1.916 righe, trigger funzionante, cambio categoria tracciato con user_id admin.

### Bloccato / Da decidere
- Assegnare categorie ai 65 prodotti orfani (`category_id = NULL`) — **serve decisione CEO**.
- `audit_logs` batches 005-012 pending — utente ha detto skip salvo richiesta esplicita.
- Leaked password protection — limitazione piano free Supabase.

### Prossimi step
1. **Decisione CEO** su 65 prodotti senza categoria → poi eventualmente script di assegnazione bulk.
2. **Eventuale** migrazione audit_logs batch 005-012 se richiesto.

### Data Ultimo Aggiornamento: 2026-07-16
