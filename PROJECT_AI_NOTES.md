# Project AI Notes

## Lesson Learned: immagini prodotto
- Un URL presente in `products.image_urls` **non garantisce** che l'immagine sia valida.
- Alcuni prodotti hanno URL con file finti (33 byte) caricati per motivi tecnici.
- Per verificare se un'immagine è reale: controllare `content-length > 33` e `content-type` dalla response storage. Un 200 non basta.

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
- **Nota Importante:** Implementata logica fasce prezzo basata su "Prezzo Doppio + %". Si nota un aumento del prezzo unitario all'aumentare della quantità. Da validare con CEO se la logica è corretta o se va invertita in sconto decrescente.

## Milestone M3: Catalog & Collo Gating (11-06-2026)
- **Status:** Specifica tecnica creata (`docs/project/ecommerce-vetronaviglio-technical-spec-catalog.md`).
- **Logica:** Gating a due livelli (Collezione -> Collo).
- **Prossimo passo:** Implementazione View/Function SQL per il gating lato DB.

## Workflow Amministrativo (13-06-2026)
- **Strumento:** Calendarizzazione documentale introdotta.
- **Path:** `docs/admin/scadenze.md` (Master list).
- **Azione:** Migrazione milestone correnti da `PROJECT_AI_NOTES.md` e `...-plan.md` verso `scadenze.md`.

## Checkpoint Sessione 8 — Audit copertura bilingue (2026-06-19)
- **Fix puntuale:** AC050.0845 — aggiunti `title_en` e `description_en`.
- **Copertura bilingue:** 551/616 (89.4%) hanno IT+EN; 65/616 (10.6%) senza descrizione e senza categoria.
- **Scoperta:** 65 prodotti orfani hanno `category_id = NULL` — non compaiono nel catalogo.
- **Prossimo:** Assegnare categorie ai 65 prodotti orfani, poi scrivere descrizioni IT+EN.

## Deferred: Custom SMTP & Email Templates (2026-06-19)
- **Bloccante:** Supabase tier gratuito non permette personalizzazione template email (reset password, conferma, invito).
- **Soluzione rinvio:** Configurare Resend come SMTP custom per Supabase Auth durante la migrazione a Vercel.
- **Dominio:** Usare `info@vetronaviglio.eu` (o analogo) come sender.
- **Priorità:** Medio-alta (necessario per onboarding utenti amministrati e reset password funzionante).
- Segnato come reminder per la fase di produzione.

## Checkpoint Sessione 9 — Admin UX, Auth, Content & Mobile Fixes (2026-06-19)
- **Audit bilingue completato:** 551/616 prodotti (89.4%) con IT+EN; 65 orfani (`category_id = NULL`) senza descrizione né categoria — non compaiono nel catalogo.
- **Fix AC050.0845:** Aggiunti `title_en` e `description_en` mancanti.
- **Admin User Management:** Migrato a Edge Functions v2
  - `admin-create-user`: Fix CORS (handler OPTIONS + headers)
  - `admin-delete-user`: Nuovo — cancella sia `profiles` che `auth.users` (prerequisito: no ordini attivi)
  - Ruolo `ceo` abilitato in `AdminRoute.tsx` (accesso pari ad `admin`)
- **Auth:** Flusso reset password implementato (`ResetPasswordPage.tsx`, `UpdatePasswordPage.tsx`, link in `LoginPage.tsx`)
- **Mobile UX:** Cart & Checkout responsive — righe impilate su mobile, target tattili ingranditi, testi leggibili
- **Content sync da vetronaviglio.it:**
  - About page: riscritta completa (intro, blockquote, certificazioni, timeline 1991→2022, customizzazione)
  - Contact page: foto sede (`/img/dove-siamo-sede.jpg`) + Google Maps embed
  - Footer: anno fondazione corretto 1966 → 1991
- **Product page:** Accessori compatibili — rimosso `scrollbar-hide`, scrollbar nativa visibile
- **Import catalogo:** `scripts/import_catalog.py` — upsert single-pass con `stock_quantity` e `box_quantity` da Excel
- **Documentazione aggiornata:** `docs/changelog.md` + `docs/admin-guide.md` (utenti, import, ruoli)
- **Deferred SMTP** confermato per produzione (Resend su `vetronaviglio.eu`)

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

## Sessione 10 — 22-06-2026: Pricing Tiers, Color Translation, Accessory Gate

### Decisioni chiave
- **`translateColor()`**: Prima match esatto su chiave unica, poi parola per parola con fallback case-insensitive + stripping punteggiatura. L'import di `translations` in `ProductPage.tsx` è necessario per la ricerca case-insensitive.
- **`is_accessory` gate**: Usato `product.is_accessory` per nascondere la sezione "Accessori compatibili" — la query `get_compatible_accessories` RPC non filtra in base al tipo di prodotto principale.
- **Aumento prezzo con quantità**: Logica "Prezzo Doppio + %" approvata ma segnalata come "da validare CEO" in `docs/admin-guide.md`.

### Modifiche principali
- `app/src/pages/ProductPage.tsx`: nuova `translateColor()`, condizione `!product.is_accessory` su sezione accessori, import `translations`.
- `app/src/constants/translations.ts`: ~60 parole colore IT/EN aggiunte.
- `docs/changelog.md`, `docs/admin-guide.md`, `AGENTS.md`: sincronizzati.

### Dati utili
- 3 colori più frequenti nel DB: `bianco` (246), `ghiera` (113), `bulbo` (96).
- `trasparente`: 67 occorrenze, `satinato`: 76.
- Parole con punteggiatura: `brillante,` (31), `satinato,` (28), `neutro,` (5) ecc. — gestite dallo stripping nella `translateColor()`.

## Sessione 11 — Bug fix filtri homepage

### Obiettivo
Risolvere il bug: bottoni Vetro/Plastica/Accessori in Home aprivano il catalogo completo invece di filtrare.

### Cosa è stato fatto
- Home.tsx: cambiato `to="/catalog"` in `to="/catalog?filter=vetro|plastica|accessori"`
- Catalog.tsx: aggiunta logica `?filter=` con raggruppamento custom:
  - `vetro`: `materiale = 'Vetro'` o `categoria` contiene "vetro"
  - `plastica`: set di materiali plastici (PE, PET, PP, SAN, etc.) o `categoria` contiene "plastica"/"pet"
  - `accessori`: set di categorie note (Coperchi, Capsule, Dispenser, Contagocce, Cover)
- Chip visivo attivo con pulsante ✕ per tornare al catalogo completo
- Usato `setSearchParams` per pulizia URL sincronizzata

### Decisioni
- Non usato `?categoria=` perché le categorie DB sono specifiche (es. "Flaconi vetro", "Coperchi"), non broad ("Vetro", "Plastica", "Accessori")
- Scelto raggruppamento frontend con regole invece di creare nuove collezioni DB

### Dati utili
- `attributes.categoria` ha 18 valori specifici (es. "Flaconi vetro", "Vasi plastica", "Coperchi", ecc.) — nessun valore broad
- `attributes.materiale` ha 20 valori tra cui "Vetro", vari plastici (PE, PET, PP, SAN, etc.), "Alluminio", "Resina termoindurente"
- 616 prodotti totali nel DB Supabase `vsqzxudijllpocrbqfbo`
