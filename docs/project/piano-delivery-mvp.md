# Piano di Delivery MVP - E-commerce Vetronaviglio

## 1. Executive Summary

Il presente documento definisce la roadmap di implementazione dell'MVP (Minimum Viable Product) per l'e-commerce Vetronaviglio, seguendo l'approccio incrementale.

**Obiettivo:** Raggiungere la piena autonomia operativa per il team marketing/CEO nella gestione di prodotti, prezzi e campionature.

## 2. Roadmap di Delivery (4 Settimane)

| Settimana | Focus | Attività Chiave |
| - | - | - |
| **1** | **M2 - Governance & Architettura** | Definizione DB schema, RLS (sicurezza catalogo), setup infrastruttura. |
| **2** | **M3.1 - Ingestion Dati** | Pulizia dati Excel, script di importazione, validazione dati (Human Gate). |
| **3** | **M3.2 - Sviluppo MVP** | Frontend (Catalogo, Ricerca), logica backend (Campionature, prezzi). |
| **4** | **M4 - QA, Validazione & Deploy** | UAT (User Acceptance Testing), affinamento finale, deploy in produzione. |


## 3. Perimetro MVP (In-Scope)

- **Catalogo:** Gestione completa prodotti (Vetro, Plastica, Accessori) in multilingua.

- **Campionature:** Modulo di richiesta automatizzato.

- **Admin:** Panel semplificato per gestione catalogo (integrato in Supabase).

- **Logica:** Gestione relazioni Prodotto-Accessorio (collo), sconti quantità.

## 4. Esclusioni (Fase 1)

- Integrazione ERP/Magazzino in tempo reale.

- Personalizzazioni UI complesse.

- Gestione flussi logistici internazionali complessi.


## 5. Costi Infrastrutturali (Stima Mensile - Produzione)

I costi di esercizio (infrastruttura Cloud)

- **Vercel (Hosting/Bandwidth):** ~€20/mese (Piano Pro).

- **Supabase (Database/Storage/API):** ~€25+/mese (Piano Pro).

- **Totale stimato esercizio:** €45 - €100/mese (dipendente dal traffico reale).

## 6. Prossimi passi e validazione

Il piano richiede l'approvazione del CEO per procedere con l'inizializzazione dei piani di acquisto verso i fornitori.

*Documento ad uso interno/cliente. Da validare con il piano operativo in `PROJECT\_AI\_NOTES.md`.*

