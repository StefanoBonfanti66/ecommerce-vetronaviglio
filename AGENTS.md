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

## Current Focus — 2026-06-22 (Sessione 10 - Pricing Tiers, Color Translation, Accessory Gate)

### Completato
- **Logica Prezzi:** Implementate fasce quantità (Prezzo Doppio + X%: 100-999/+40%, 1000-2999/+30%, 3000-4999/+20%, 5000+10%) in `resolvePrice()`.
- **Traduzione Colori:** `translateColor()` con match esatto + parola per parola case-insensitive + gestione punteggiatura.
- **Traduzioni:** ~60 parole colore IT/EN aggiunte in `translations.ts` (base + tecnici: Ghiera/Collar, Bulbo/Bulb, Tasto/Stopper ecc.).
- **Accessori:** Sezione "Accessori compatibili" nascosta per prodotti con `is_accessory = true`.
- **Documentazione:** `docs/changelog.md` e `docs/admin-guide.md` aggiornate.

### In corso
- (nessuno)

### Prossimo step concreto
- Assegnare categorie ai 65 prodotti orfani (`category_id = NULL`) per renderli visibili nel catalogo, poi scrivere descrizioni IT+EN.

### Data Ultimo Aggiornamento: 2026-06-22
