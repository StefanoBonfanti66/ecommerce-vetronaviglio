# Piano di Delivery MVP - E-commerce Vetronaviglio

## 1. Executive Summary
Il presente documento definisce la roadmap di implementazione dell'MVP (Minimum Viable Product) per l'e-commerce Vetronaviglio, seguendo l'approccio incrementale ZetaByteNexus (ZBN).

**Obiettivo:** Raggiungere la piena autonomia operativa per il team marketing/CEO nella gestione di prodotti, prezzi e campionature.

## 2. Metodologia (ZBN Safety Policy)
Il progetto segue il paradigma: **AI propone, Umano valida, Sistema traccia.**
- Ogni attività è suddivisa in *checkpoint*.
- Nessun codice o configurazione tocca la produzione senza validazione esplicita del CEO.
- La qualità è garantita da test in ambiente di replica (non di produzione).

## 3. Roadmap di Delivery (4 Settimane)

| Settimana | Focus | Attività Chiave |
| :--- | :--- | :--- |
| **1** | **M2 - Governance & Architettura** | Definizione DB schema, RLS (sicurezza catalogo), setup infrastruttura. |
| **2** | **M3.1 - Ingestion Dati** | Pulizia dati Excel, script di importazione, validazione dati (Human Gate). |
| **3** | **M3.2 - Sviluppo MVP** | Frontend (Catalogo, Ricerca), logica backend (Campionature, prezzi). |
| **4** | **M4 - QA, Validazione & Deploy** | UAT (User Acceptance Testing), affinamento finale, deploy in produzione. |

## 4. Perimetro MVP (In-Scope)
- **Catalogo:** Gestione completa prodotti (Vetro, Plastica, Accessori) in multilingua.
- **Campionature:** Modulo di richiesta automatizzato.
- **Admin:** Panel semplificato per gestione catalogo (integrato in Supabase).
- **Logica:** Gestione relazioni Prodotto-Accessorio (collo), sconti quantità.

## 5. Esclusioni (Fase 1)
- Integrazione ERP/Magazzino in tempo reale.
- Personalizzazioni UI complesse.
- Gestione flussi logistici internazionali complessi.

## 6. Costi Infrastrutturali (Stima Mensile - Produzione)
I costi di esercizio (infrastruttura Cloud) sono a carico diretto del cliente Vetronaviglio srl.
- **Vercel (Hosting/Bandwidth):** ~€20/mese (Piano Pro).
- **Supabase (Database/Storage/API):** ~€25+/mese (Piano Pro).
- **Totale stimato esercizio:** €45 - €100/mese (dipendente dal traffico reale).
*Nota: In fase di sviluppo, i costi sono minimizzabili tramite piani gratuiti, salvo necessità specifiche di performance.*

## 7. Prossimi passi e validazione
Il piano richiede l'approvazione del CEO per procedere con l'inizializzazione del database (M2).

*Documento ad uso interno/cliente. Da validare con il piano operativo in `PROJECT_AI_NOTES.md`.*
