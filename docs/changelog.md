# Changelog - Vetronaviglio E-commerce

## [Unreleased]
- **i18n:** Traduzione colore — implementata funzione `translateColor()` con match esatto, fallback parola per parola case-insensitive e gestione punteggiatura.
- **i18n:** Aggiunte ~60 parole colore IT/EN in `translations.ts` (colori base, materiali, componenti tecnici).
- **Frontend:** Sezione "Accessori compatibili" ora nascosta per prodotti con `is_accessory = true` (non mostrare accessori su un accessorio).
- **Admin Panel:** Aggiunta Gestione Listini personalizzati.
- **Admin Panel:** Gestione Utenti con creazione, assegnazione listino e eliminazione sicura.
- **Admin Panel:** Pannello impostazioni dinamico (Email, Importo minimo, Note logistica).
- **Frontend:** Ottimizzazione mobile (Layout, Header, Placeholder immagini).
- **Logica Prezzi:** Implementazione sistema di fallback (Listino > Tier > Prezzo Base).
- **Logica Prezzi:** Implementata logica di prezzo dinamico basata su quantità (fasce 100-999, 1000-2999, 3000-4999, 5000+).
- **Logica Stock:** Automazione scarico stock tramite trigger SQL.
- **Admin UX:** AdminWrapper + AdminLayout per navigazione admin coerente.
- **Admin Gestione:** UserManager migrato a Edge Function `admin-create-user`.
- **i18n:** Persistenza lingua in localStorage, toggle lingua nell'Header.
- **DB:** Audit copertura bilingue (551/616 prodotti IT+EN), fix AC050.0845.
- **Auth:** Flusso reset password (Forgot password → email → `/update-password`).
- **Admin Route:** Ruolo `ceo` abilitato all'accesso admin panel.
- **Admin Eliminazione Utenti:** Migrato a Edge Function `admin-delete-user` (pulisce `profiles` + `auth.users`).
- **Admin Creazione Utenti:** Fix CORS Edge Function (v2 con handler OPTIONS).
- **Pagina About:** Riscritta con contenuto completo da vetronaviglio.it/chi-siamo (introduzione, blockquote, certificazioni, timeline 1991→2022, customizzazione).
- **Pagina Contatti:** Aggiunta foto sede + mappa Google Maps.
- **Footer:** Anno fondazione corretto (1966 → 1991).
- **Carrello / Checkout:** Layout responsive mobile (righe impilate, target tattili più grandi).
- **Accessori prodotto:** Scrollbar nativa ripristinata (rimosso `scrollbar-hide`).
- **Import catalogo:** Upsert in unico passaggio con `stock_quantity` e `box_quantity` da Excel.
