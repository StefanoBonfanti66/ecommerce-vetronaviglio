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
