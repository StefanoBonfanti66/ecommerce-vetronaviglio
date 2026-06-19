# Project AI Notes

## Obiettivi e Posizionamento
- **Obiettivo:** Sostituzione e miglioramento dell’attuale e-commerce Vetronaviglio (non progetto greenfield).
- **Dominio:** Il nuovo sito utilizzerà `vetronaviglio.eu`. Sarà implementato un redirect dal vecchio sito a questo nuovo dominio.
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

## Decision Log
- 2026-06-16: Creato il file `PROJECT_AI_NOTES.md` (unificato).
- 2026-06-16: Implementazione architettura DB flessibile (JSONB) e migrazione immagini.
- 2026-06-16: Evoluzione Governance: introdotto controllo granulare ruoli (admin, ceo, magazzino, acquisti) e tabella Audit Log.

## TODOs
- [x] Admin Interface: Sviluppo pannello base.
- [x] Admin Interface: Master Control Editor (attributi, collezioni, audit).
- [x] Implementazione ruoli Magazzino/Acquisti nell'interfaccia.
- [x] Validazione piano MVP con il CEO.
- [x] Configurazione DNS e validazione dominio `vetronaviglio.eu` su Resend (Punto sospeso: da eseguire in fase di messa in produzione).
- [x] Traduzione dati dinamici nel DB: Implementato supporto multilingua nella tabella `settings` per `shipping_notes` aggiungendo la chiave `shipping_notes_en`.
- [x] Inseriti testi di cortesia per pagine legali (terms, privacy, cookies) nel DB.
- [ ] **IMPORTANTE (Legal):** Sottoporre i testi inseriti nelle pagine legali al CEO/Legale per validazione formale prima del go-live.
- [ ] Restanti campi nel DB (attributi prodotti, descrizioni) necessitano di migrazione simile per supporto EN completo.
- [x] Implementazione M2 Governance & Architettura (Audit Logs e Triggers attivi).
- [ ] @amministrazione: Inserimento Resend nel ledger.md come costo pass-through (attualmente €0).
- [ ] @pricing: Revisione stima costi infrastrutturali includendo Resend per scaling.
- [ ] **Admin Panel: Gestione logistica e pricing avanzato (Master Control Editor evoluzione):**
    - [ ] Aggiunta campi `box_quantity`, `stock_quantity`, `is_active` (prodotti) nel pannello Admin.
    - [ ] Aggiunta interfaccia configurazione "Sconti Quantità" (tier di prezzo) gestibile dall'Admin.
- [x] **Implementazione logica Frontend (basata su dati Admin):**
    - [x] Logica visibilità: `stock_quantity == 0` -> nascosto.
    - [x] Visualizzazione `box_quantity` in scheda prodotto.
    - [x] Visualizzazione `stock_quantity` in scheda prodotto.
    - [x] Visualizzazione note logistiche in scheda prodotto (Ex-Works, Min. fatturabile).
    - [x] Implementazione selettore scatole (+/- moltiplicatore `box_quantity`).
    - [x] Gating logico: blocco acquisto se `totale > stock` con avviso.
    - [x] Tasto "Aggiungi tutto lo stock disponibile".
    - [x] Validazione importo minimo fatturabile (€250) nel carrello.
    - [ ] Visualizzazione prezzi dinamici e sconti nel carrello.
    - [ ] Logica note logistica Ex-Works in Checkout.
