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

## Current Focus — 2026-06-19 (Sessione 8 - Audit copertura bilingue DB)

### Completato
- Fix AC050.0845: aggiunti `title_en` e `description_en`.
- Audit completo copertura bilingue su 616 prodotti.
- Scoperti 65 prodotti senza descrizione (IT né EN) e senza categoria assegnata.

### In corso
- (nessuno)

### Prossimo step concreto
- Assegnare categorie ai 65 prodotti orfani (`category_id = NULL`) per renderli visibili nel catalogo, poi scrivere descrizioni IT+EN.

### Data Ultimo Aggiornamento: 2026-06-19
