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

## Current Focus — 2026-06-22 (Sessione 11 — Bug fix filtri, Account CEO, Admin link in Header)

### Completato
- **Bug fix filtri homepage:** Bottoni Vetro/Plastica/Accessori ora filtrano il catalogo con raggruppamento custom via `?filter=` param.
- **Admin link in Header:** Aggiunto link "Admin" (arancione) nell'header dopo il login (desktop + mobile).
- **Account CEO:** Creati due account CEO (`b.solitodesolis@vetronaviglio.it`, `f.rosi@vetronaviglio.it`) con password temporanee.
- **Email di accesso:** Bozza salvata in `docs/proposals/email-accesso.md` con istruzioni non tecniche, costi zero, e offerta demo.

### Bloccato / Da decidere
- Assegnare categorie ai 65 prodotti orfani (`category_id = NULL`) — **serve decisione CEO** su quali categorie assegnare.

### Prossimo step concreto
- Attendere riscontro da Bettina/Federico dopo aver girato il sito.
- Successivamente: assegnare categorie ai prodotti orfani e agganciare dominio `www.vetronaviglio.eu`.

### Data Ultimo Aggiornamento: 2026-06-22
