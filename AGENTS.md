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

## Current Focus — 2026-06-23 (Sessione 12 — Fix traduzione IT/EN attributi, visibilità SVG homepage, deploy Vercel)

### Completato
- **Bug fix filtri homepage:** Bottoni Vetro/Plastica/Accessori ora filtrano il catalogo con raggruppamento custom via `?filter=` param.
- **Admin link in Header:** Aggiunto link "Admin" (arancione) nell'header dopo il login (desktop + mobile).
- **Account CEO:** Creati due account CEO (`b.solitodesolis@vetronaviglio.it`, `f.rosi@vetronaviglio.it`) con password temporanee.
- **Email di accesso:** Bozza salvata in `docs/proposals/email-accesso.md` con istruzioni non tecniche, costi zero, e offerta demo.
- **Fix traduzione IT/EN:** Nuova funzione `translateValue()` in `ProductPage.tsx` che gestisce lookup diretto, reverse lookup, case-insensitive e word-by-word per attributi composti (es. "Marrone satinato" → "Brown Satin").
- **Chiavi traduzione mancanti:** Aggiunte `Semitrasparente` e `Nessuna finitura` a `translations.ts`.
- **Specifiche tecniche:** `materiale` e `finitura` ora usano `translateValue()` invece di `t()` diretto.
- **Visibilità SVG homepage:** Aumentate opacity e strokeWidth delle illustrazioni decorative (card categorie e hero).
- **Deploy Vercel:** Build e deploy su https://ecommerce-vetronaviglio.vercel.app con i fix.

### Bloccato / Da decidere
- Assegnare categorie ai 65 prodotti orfani (`category_id = NULL`) — **serve decisione CEO** su quali categorie assegnare.

### Prossimo step concreto
- Attendere riscontro da Bettina/Federico dopo il giro sul sito aggiornato.
- Successivamente: assegnare categorie ai prodotti orfani e agganciare dominio `www.vetronaviglio.eu`.

### Data Ultimo Aggiornamento: 2026-06-23
