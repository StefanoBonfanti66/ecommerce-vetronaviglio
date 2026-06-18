# Checklist Tecnica M2 - Governance & Architettura

## 1. Schema Database
- [ ] Definizione entità: `products`, `collections`, `roles`, `audit_logs`.
- [ ] Configurazione FK, Unique Constraints e indici.

## 2. RLS (Row Level Security)
- [ ] Implementazione policy per separazione dati (Admin vs User).
- [ ] Verifica accesso `auth.users` e ruoli custom.

## 3. Infrastruttura
- [ ] Verifica piano Supabase (Pro necessario).
- [ ] Setup variabili ambiente per autenticazione/API.

## 4. Validazione Sicurezza
- [ ] Protocollo di validazione per script DDL.
- [ ] Review script DDL da parte del CEO.

*Checkpoint: M2 completato solo dopo validazione CEO su ambiente di replica.*
