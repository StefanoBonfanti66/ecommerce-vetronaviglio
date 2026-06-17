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

## Current Focus — 2026-06-17 (Sessione 4 - Aggiornamento)

### Completato
- Riequilibrio sito "Commerce-First" (ProductPage, Catalogo, Carrello).
- Implementazione Master Control Editor (Admin panel per prodotti, attributi, collezioni, utenti, impostazioni).
- Logica campionature (flusso separato, gestione 0€, disclaimer logistico).
- Gestione dinamica ruoli e attributi via database.
- Importazione immagini collezioni.
- Implementazione Role-based Routing (admin, ceo, magazzino, acquisti).
- Sistema invio notifiche email ordini via Edge Function + Webhook.
- Logica disattivazione prodotti/collezioni (soft-delete).
- Sistema accessori correlati (FORCE_INCLUDE) con pannello di gestione.

### In corso
- Validazione del Piano di Delivery MVP e dei costi infrastrutturali con il CEO.

### Prossimo step concreto
- Attesa validazione CEO per avvio M2.

### Data Ultimo Aggiornamento: 2026-06-17
