# Changelog - Vetronaviglio E-commerce

## [Unreleased]
- **Admin Panel:** Aggiunta Gestione Listini personalizzati.
- **Admin Panel:** Gestione Utenti con creazione, assegnazione listino e eliminazione sicura.
- **Admin Panel:** Pannello impostazioni dinamico (Email, Importo minimo, Note logistica).
- **Frontend:** Ottimizzazione mobile (Layout, Header, Placeholder immagini).
- **Logica Prezzi:** Implementazione sistema di fallback (Listino > Tier > Prezzo Base).
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
