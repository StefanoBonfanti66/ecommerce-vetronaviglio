# PROJECT_AI_NOTES.md - Ecommerce Vetronaviglio

## Scopo
Tracciare decisioni, checkpoint, inventario documenti e TODOs per il progetto Vetronaviglio.

## Document Inventory
- `docs/leads/`: Lead intake, brief, positioning, pricing, admin check.
- `docs/proposals/`: Preventivi ed email.
- `docs/project/`: Piani, kickoff, amministrazione checklist.
- `docs/admin/`: Cashflow, solleciti.
- `docs/invoices/`: Fatture.

## Decision Log
- 2026-06-16: Creato il file `PROJECT_AI_NOTES.md` per allineamento con `AGENTS.md`.
- 2026-06-16: Implementazione architettura DB flessibile (JSONB) e migrazione immagini in Supabase Storage.
- 2026-06-16: Popolamento collezioni e mappatura automatica prodotti.

## TODOs
- [x] Inizializzare struttura `docs/`.
- [x] M3.1: Esecuzione script di importazione catalogo.
- [x] M2: Validazione RLS catalogo.
- [x] M3.1-Fix: Normalizzazione URL immagini catalogo.
- [x] M3.1-Mig: Migrazione immagini da dominio esterno a Supabase Storage (ecommerceBUK).
- [x] M3.1-Collections: Popolamento collezioni e mappatura automatica prodotti.
- [ ] Admin Interface: Sviluppo pannello "Admin-Simple" per gestione assegnazioni (NO SQL manuale).
