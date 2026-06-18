# MVP Scope: E-commerce Vetronaviglio

## 1. Obiettivi del progetto
- Implementare una piattaforma e-commerce performante, sicura e autonoma.
- Garantire la piena autonomia operativa al team marketing/CEO per la gestione di prodotti e prezzi.
- Eliminare la necessità di intervento tecnico manuale (infrastruttura zero-manual).
- Mantenere il supporto multilingua (IT/EN).

## 2. Confini MVP
- Catalogo prodotti completo (Vetro, Plastica, Accessori).
- Modulo di richiesta campionature automatizzato.
- Admin panel semplificato per gestione catalogo.

## 3. Esclusioni esplicite (Fase 1)
- Integrazione ERP o Magazzino in tempo reale.
- Personalizzazioni UI complesse fuori dallo standard e-commerce.
- Gestione flussi logistici complessi (es. spedizioni internazionali automatiche avanzate).

## 4. Requisiti funzionali chiave
- Relazione automatica Prodotto-Accessorio basata su "Collo".
- Gestione dinamica prezzi (sconti automatici su quantità).
- Modulo personalizzazione (Serigrafia/Laccatura).
- Checkout con validazioni integrate (Min €250, Max 3000pz).

## 5. Requisiti operativi
- Infrastruttura Cloud gestita.
- Backup automatici (PITR) e CI/CD.
- Sistema nativamente bilingue (IT/EN).

## 6. Rischi e dipendenze
- Rischio: Complessità nella migrazione dei dati dal sito attuale (scrappable o da ricostruire).
- Dipendenza: Necessità di definire i criteri di validazione delle campionature.

## 7. Decisioni rimandate alla Fase 2
- Integrazione completa con ERP aziendale.
- Analisi approfondita dati di vendita storici.

## 8. Decisioni rimandate alla Fase 2 (Aggiunte)

## 10. Listini Personalizzati (Fase 2)
- **Logica:** Gestione listini associati all'utente (Cliente).
- **Priorità:** Il Listino Personalizzato ha priorità assoluta su `price` base e `price_tiers` (sconti quantità).
- **Governance:** Solo Admin/CEO possono creare/modificare listini.

