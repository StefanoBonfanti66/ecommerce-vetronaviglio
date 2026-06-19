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

## Current Focus — 2026-06-19 (Sessione 9 - Admin UX, Auth, Content & Mobile Fixes)

### Completato
- Fix AC050.0845: aggiunti `title_en` e `description_en`.
- Audit completo copertura bilingue su 616 prodotti (551/616 = 89.4% con IT+EN).
- Scoperti 65 prodotti orfani (`category_id = NULL`) senza descrizione né categoria.
- Admin User Management migrato a Edge Functions v2:
  - `admin-create-user`: fix CORS (handler OPTIONS + headers)
  - `admin-delete-user`: nuovo — cancella `profiles` + `auth.users` (prerequisito: no ordini attivi)
  - Ruolo `ceo` abilitato in `AdminRoute.tsx` (accesso pari ad `admin`)
- Auth: flusso reset password (`ResetPasswordPage.tsx`, `UpdatePasswordPage.tsx`, link in `LoginPage.tsx`)
- Mobile UX: Cart & Checkout responsive (righe impilate, target tattili ingranditi, testi leggibili)
- Content sync da vetronaviglio.it:
  - About page: riscritta completa (intro, blockquote, certificazioni, timeline 1991→2022, customizzazione)
  - Contact page: foto sede (`/img/dove-siamo-sede.jpg`) + Google Maps embed
  - Footer: anno fondazione corretto 1966 → 1991
- Product page: accessori compatibili — rimosso `scrollbar-hide`, scrollbar nativa visibile
- Import catalogo: `scripts/import_catalog.py` upsert single-pass con `stock_quantity` e `box_quantity`
- Documentazione aggiornata: `docs/changelog.md` + `docs/admin-guide.md` + `PROJECT_AI_NOTES.md`
- Deferred SMTP confermato per produzione (Resend su `vetronaviglio.eu`)

### In corso
- (nessuno)

### Prossimo step concreto
- Assegnare categorie ai 65 prodotti orfani (`category_id = NULL`) per renderli visibili nel catalogo, poi scrivere descrizioni IT+EN.

### Data Ultimo Aggiornamento: 2026-06-19
