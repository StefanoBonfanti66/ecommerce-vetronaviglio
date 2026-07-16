![Logo ZetaByteNexus](../../assets/logo-azienda.png)

ZetaByteNexus  
Via Mazzo, 73/B  
20017 Rho (MI) — Italia  
P.IVA: BNFSFN66B13F704A  
Email: info@zetabytenexus.it  
Telefono: 335 7388349  
Web: www.zetabytenexus.it

---

# Preventivo n. ZBN-2025-VN-001

Cliente: Vetronaviglio srl  
Referente: Stefano Bonfanti (CEO)  
Data: 16 luglio 2026  
Validità: 30 giorni

---

## 1. Contesto e obiettivi

Vetronaviglio srl necessita di sostituire il proprio sito e-commerce esistente con una piattaforma moderna, performante e completamente personalizzata. Il nuovo sistema deve essere gestibile autonomamente dal team interno senza supporto tecnico esterno continuativo.

**Stato attuale del progetto:** Sviluppo completato, migrato su Supabase EU, live su Vercel.

**Obiettivi principali:**
- E-commerce B2B/B2C bilingue (IT/EN) con catalogo 616 prodotti
- Pannello amministrativo completo (gestione prodotti, collezioni, attributi, accessori, listini, utenti)
- Infrastruttura cloud-native con costi operativi minimi
- Migrazione dati completa (prodotti, immagini, utenti, ordini)

---

## 2. Ambito del progetto

### In scope

**Frontend (React + Vite + Tailwind CSS)**
- Catalogo prodotti con filtri, ricerca, paginazione
- Dettaglio prodotto con scheda tecnica, accessori compatibili, varianti
- Carrello e checkout con integrazione PayPal
- Area clienti con storico ordini
- Richiesta campioni automatizzata
- Responsive design, ottimizzazione performance (code splitting Vite 8)

**Backend (Supabase — PostgreSQL, Auth, Storage, Edge Functions)**
- Database relazionale: 14 tabelle, 616 prodotti, 292 opzioni attributi, 331 collegamenti prodotto-collezione, 21 collezioni
- Autenticazione: 4 utenti (admin, CEO, customer) con ruoli e profili
- Storage: bucket `ecommerceBUK` pubblico, 607 immagini prodotto migrate
- Edge Functions: `send-order-email` (Resend), `admin-create-user`, `admin-delete-user`
- Webhook ordini per notifiche email automatiche

**Pannello Amministrativo**
- CRUD completo: prodotti, collezioni, attributi, regole accessori, listini, utenti
- Gestione impostazioni (email notifiche, minimale ordine, massimo pezzi)
- Pagine legali e richieste campioni
- Dashboard con statistiche

**Migrazione**
- 616 prodotti con dati, prezzi, stock, attributi JSON
- 607 immagini migrate da storage sorgente a target EU
- 4 utenti auth con profili e ruoli
- 14 ordini storici con 23 order items
- 1300 audit logs

**Infrastruttura**
- Supabase EU (proj `cgvztkgbzecyregjrtsh`) — DB, Auth, Storage, Edge Functions
- Vercel (project `ecommerce-vetronaviglio`) — frontend con auto-deploy da GitHub
- GitHub repo: `StefanoBonfanti64/ecommerce-vetronaviglio`
- Sicurezza: RLS su tutte le tabelle, ACL funzioni, search_path isolato

### Fuori scope / esclusioni

- Integrazione ERP/contabile
- Sistema di pagamenti avanzato (solo PayPal attualmente)
- SEO avanzata / Analytics
- Traduzioni professionali (traduzioni base incluse)
- Manutenzione e supporto post-lancio (vedi sezione Garanzia)
- Configurazione dominio vetronaviglio.eu (già gestito da AfterPixel)
- Assegnazione categorie ai 65 prodotti orfani (da definire con CEO)

---

## 3. Articolazione per milestone

| Milestone | Descrizione | Ore stimate | Importo |
|----------|-------------|------------:|--------:|
| M1 – Analisi e progettazione | Requirements, architettura dati, wireframe, scelte tecnologiche | 40h | 2.800 € |
| M2 – Backend e database | Schema DB, RLS, Auth, Edge Functions, Storage, API | 100h | 7.000 € |
| M3 – Frontend e UI | Catalogo, prodotto, carrello, checkout, admin panel, responsive | 140h | 9.800 € |
| M4 – Migrazione dati | 616 prodotti, 607 immagini, 4 utenti, ordini, verifica integrità | 40h | 2.800 € |
| M5 – Testing e deployment | QA, fix bug, deploy Supabase EU + Vercel, go-live, sicurezza | 60h | 4.200 € |
| **Totale** | | **380h** | **26.600 €** |

Note sulle stime:
- Le ore includono sviluppo, comunicazione, revisioni ragionevoli, test e documentazione interna essenziale.
- Le stime riflettono il lavoro effettivamente svolto (progetto completato e live).
- Tariffa oraria di riferimento: €70/h (sviluppo), €80/h (progettazione/infrastruttura).

---

## 4. Modello di prezzo

**Fixed-Price** — importo concordato a priori, indipendentemente dall'effettivo tempo di sviluppo.

Justificatif del prezzo rispetto alle alternative di mercato:

| Soluzione | Costo setup | Costo mensile | Note |
|-----------|-------------|---------------|------|
| Shopify Basic | €2.000-5.000 | €79-299/mese | Template, personalizzazione limitata, commissioni transazionali |
| Shopify Plus | €50.000-200.000+ | €2.000+/mese | Enterprise, ma eccessivo per B2B piccolo |
| WooCommerce | €3.000-10.000 | €50-200/mese | Hosting, manutenzione, sicurezza a carico del cliente |
| **ZetaByteNexus (questo progetto)** | **€26.600** | **~€50/mese** | Custom, zero commissioni, proprietario, manutenzione minima |

Vantaggi della soluzione custom:
- Zero commissioni transazionali
- Costi operativi minimi (piani gratuiti Supabase + Vercel)
- Codice sorgente proprietario, nessun lock-in
- Manutenzione ridotta grazie a infrastruttura serverless

---

## 5. Condizioni economiche

- Importo complessivo stimato: **26.600 € + IVA**
- Pagamento:
  - **30%** alla firma (€7.980)
  - **40%** a milestone M3 completato (€10.640)
  - **30%** a collaudo e go-live (€7.980)

Termini di pagamento: 30 giorni data fattura.

---

## 6. Garanzia e manutenzione

- Periodo di garanzia correttiva: **30 giorni** su bug di produzione
- Dopo la garanzia:
  - Retainer manutenzione: €300/mese per 5h incluse (backup, monitoraggio, patch sicurezza, supporto minore)
  - Interventi extra: €70/h

---

## 7. Prerequisiti e responsabilità del cliente

Il cliente si impegna a fornire:
- Un referente unico decisionale (Stefano Bonfanti, CEO)
- Accesso a sistemi e dati necessari (Supabase, Vercel, dominio)
- Feedback su prototipi e rilascio entro tempi concordati
- Assegnazione categorie ai 65 prodotti ancora senza categoria
- Caricamento manuale delle 6 immagini prodotto senza fonte (SKUs composite)

---

## 8. Prossimi passi

1. Conferma scritta del presente preventivo
2. Emissione fattura di acconto (30%)
3. Definizione milestone aggiuntive per Fase 2 (eventuali integrazioni)

---

_ZetaByteNexus — Soluzioni software su misura_
