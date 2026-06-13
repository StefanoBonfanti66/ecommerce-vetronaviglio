# Project AI Notes

## Obiettivi e Posizionamento
- **Obiettivo:** Sostituzione e miglioramento dell’attuale e-commerce Vetronaviglio (non progetto greenfield).
- **Autonomia:** Assenza di supporto tecnico interno → piattaforma “zero-manual” gestibile da CEO/Marketing.
- **Punti di forza interni:** Forte competenza SEO/Digital Marketing lato cliente.
- **Requisiti chiave confermati:**
  - Bilingue IT/EN nativo (catalogo e contenuti).
  - Infrastruttura cloud-native gestita.
  - Automazione gestione prodotti/listini per ridurre interventi manuali.
- **Funzionalità strategiche:**
  - Ottimizzazione catalogo (compatibilità collo/vetri/plastica/accessori).
  - Modulo campionature automatizzato.
- **Roadmap:** Integrazione ERP/magazzino rimandata a Fase 2 dopo il go-live.

## Governance ZBN (ZetaByteNexus)
- **Framework:** Il progetto adotta rigorosamente il framework ZBN.
- **Agenti:** Ogni azione di business (pricing, amministrazione, fatturazione) passa attraverso il workflow ZBN e validazione CEO.
- **Documentazione:** `docs/` è la source of truth. Ogni modifica deve essere tracciata e validata.
- **Standard:** Riuso template e comandi definiti in `opencode-config`.

## Vincoli operativi
- **Constraint:** Preventivo con costo manodopera azzerato (risorsa interna).
- **Secret:** ZetaByteNexus (in fase di setup, non esporre).
- **Feature (Campionature):** Modulo "Richiesta Campione" automatizzato (limiti, validazione, spedizione a carico cliente).
- **Roadmap:** Integrazione ERP/Magazzino posticipata (Fase 2).
- **Localization:** Supporto bilingue (IT/EN) nativo.
- **Infrastruttura:** Cloud-native, zero-manual.
- **Approccio:** "Cosa" definito (perimetro MVP), "Come" da definire con approccio conservativo.

## Documentazione
- `docs/leads/ecommerce-vetronaviglio-positioning.md` - Definito.
- `docs/project/ecommerce-vetronaviglio-mvp-scope.md` - Definito.

## Pricing (11-06-2026)
- **Stato:** BozzaPricingGenerata.
- **Modello:** 2.048 €/mese per 4 mesi (fase MVP).
- **Prossimo passo:** Validazione bozza con @commercialista/amministrazione prima di formalizzazione preventivo.

## Data Ingestion (11-06-2026)
- **Status:** Pronta cartella `data/imports/raw/` per upload catalogo.
- **Strategia:** Normalizzazione automatizzata da Excel a `db/seed.sql`.
- **Note:** Placeholder foto gestiti via `image_missing = TRUE` (non bloccante).

## Pricing e Contratto (11-06-2026)
- **Modello:** Sviluppo MVP incluso in attività correnti ZBN (costo zero per cliente).
- **Infrastruttura:** Pass-through (costi vivi di hosting Pro a carico cliente).
- **Stato:** Preventivo formale `docs/proposals/preventivo-ecommerce-vetronaviglio.md` creato.

## Milestone M3: Catalog & Collo Gating (11-06-2026)
- **Status:** Specifica tecnica creata (`docs/project/ecommerce-vetronaviglio-technical-spec-catalog.md`).
- **Logica:** Gating a due livelli (Collezione -> Collo).
- **Prossimo passo:** Implementazione View/Function SQL per il gating lato DB.

## Workflow Amministrativo (13-06-2026)
- **Strumento:** Calendarizzazione documentale introdotta.
- **Path:** `docs/admin/scadenze.md` (Master list).
- **Azione:** Migrazione milestone correnti da `PROJECT_AI_NOTES.md` e `...-plan.md` verso `scadenze.md`.
