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

## Current Focus — 2026-06-29 (Sessione 13 — Fix CodeQL sanitization)

### Completato
- **Fix CodeQL `js/incomplete-multi-character-sanitization`:** Estratto helper `stripHtml()` in `ProductList.tsx` (riga 6) che applica il replace `/<[^>]+>/g` in loop fino a consumare tutti i tag annidati, eliminando il bypass da nesting HTML.
- **Git cleanup:** Committato `package-lock.json` e rimosso `assets/logo-azienda.png` (stale asset).
- **Push & Deploy Vercel:** 3 commit pushati su `origin/main`, deploy automatico Vercel avviato.

### Bloccato / Da decidere
- Assegnare categorie ai 65 prodotti orfani (`category_id = NULL`) — **serve decisione CEO** su quali categorie assegnare.

### Prossimo step concreto
- Attendere riscontro da Bettina/Federico dopo il giro sul sito aggiornato.
- Successivamente: assegnare categorie ai prodotti orfani e agganciare dominio `www.vetronaviglio.eu`.

### Data Ultimo Aggiornamento: 2026-06-29
