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

## Current Focus — 2026-06-12

### Completato
- Analisi e salvataggio lead Vetronaviglio.
- Definizione perimetro funzionale (MVP Scope) e posizionamento (Positioning).
- Inizializzazione `PROJECT_AI_NOTES.md` e configurazione vincoli operativi ZBN.
- Setup infrastruttura (M1) e validazione modello dati (PoC v2).
- Definizione Governance (M2), Pricing e formalizzazione preventivo.
- Setup iniziale RBAC (M2).
- Implementazione calendario documentale via `docs/admin/scadenze.md`.
- Implementazione workflow Rollup Economico (`/rollup`).
- Creazione template executive report (`docs/admin/executive-report.md`).
- Standardizzazione template processi Obsidian (`process.md`).

### In corso
- Milestone 2: Governance e implementazione RLS (DRAFT).
- Milestone 3.1: Data Ingestion (Analisi e Scripting).

### Prossimo step concreto
- Esecuzione effettiva della migrazione `005_catalog_rls_policies.sql` (Applicazione RLS).
- Aggiornamento summary di progetto con dati reali.

### Data Ultimo Aggiornamento: 2026-06-13
