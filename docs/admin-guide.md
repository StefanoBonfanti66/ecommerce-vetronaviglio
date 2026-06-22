# Guida Utente Admin - Vetronaviglio

Questa guida descrive come gestire il catalogo prodotti tramite la dashboard amministrativa.

## 1. Accesso
- Naviga su `/login` ed effettua l'accesso con le credenziali Admin.
- Una volta loggato, avrai accesso alla rotta `/admin`.

## 2. Gestione Prodotti
- Accedi alla sezione **Gestione Prodotti** per visualizzare la lista del catalogo (ordinata per SKU).
- Clicca su **Modifica** per aprire il **Product Editor**.
  - **Editor Testo:** Utilizza l'interfaccia visuale (pulsanti Bold/Italic) per formattare la descrizione. Usa "Anteprima visuale" per verificare il risultato.
  - **Immagini:** Carica nuove immagini tramite il modulo in fondo all'editor (vengono salvate direttamente in Supabase Storage).
   - **Attributi Dinamici:** Puoi aggiungere attributi personalizzati (es. "Finitura", "Materiale") cliccando su "+ Aggiungi".
   - **Campo `is_accessory`:** Se spuntato, la sezione "Accessori compatibili" viene automaticamente nascosta nella scheda prodotto. Usato per tutti i componenti tecnici (pompe, tappi, contagocce).

## 4. Gestione Utenti
- Accedi alla sezione **Gestione Utenti** per visualizzare, modificare i ruoli o eliminare account.
- **Creazione Utente:** Clicca "Aggiungi Utente" per creare un nuovo profilo. Usa l'Edge Function `admin-create-user` (v2 con CORS).
- **Ruoli:** Assegna un ruolo (admin, ceo, magazzino, acquisti, customer) per controllare i permessi. Il ruolo `ceo` ha accesso completo all'admin panel come `admin`.
- **Eliminazione Utente:** Clicca "Elimina" per rimuovere un account. L'operazione usa l'Edge Function `admin-delete-user` che cancella sia il record in `profiles` che l'utente in `auth.users`. **Prerequisito:** l'utente non deve avere ordini attivi.

## 5. Gestione Listini
- Accedi alla sezione **Gestione Listini** per creare listini prezzi personalizzati (es. "Listino VIP").
- **Assegnazione:** Nell'area "Gestione Utenti", associa un listino specifico a un utente tramite il menu a tendina.
- **Editor Listino:** Gestisci i prezzi personalizzati per SKU all'interno di ogni listino. Il prezzo definito qui ha la priorità su quello base e sui tier di sconto globali.

## 6. Impostazioni Generali
- Accedi a **Impostazioni** per modificare:
  - Email per notifiche ordini.
  - Importo minimo fatturabile (l'importo sotto il quale il checkout è bloccato).
  - Massimo pezzi per ordine.
  - Note spedizione (visualizzate nella scheda prodotto).

## 7. Logica Fasce di Prezzo (Quantità)

Il sistema applica prezzi dinamici in base alla quantità acquistata, calcolati come `Prezzo Base × 2 + X%`.

| Fascia (Pezzi) | Calcolo | Esempio (Base 0,63 €) |
| :--- | :--- | :--- |
| < 100 | Prezzo base standard | 0,63 € |
| 100 – 999 | Prezzo Doppio + 40% | 1,76 € |
| 1000 – 2999 | Prezzo Doppio + 30% | 1,64 € |
| 3000 – 4999 | Prezzo Doppio + 20% | 1,51 € |
| 5000+ | Prezzo Doppio + 10% | 1,39 € |

**Nota importante:** Questa logica comporta un *aumento* del prezzo unitario all'aumentare della quantità. Il comportamento è stato implementato su indicazione commerciale ed è in attesa di validazione CEO. In caso di modifica, aggiornare la funzione `resolvePrice()` in `app/src/utils/pricing.ts` e in `app/src/pages/ProductPage.tsx`.

## 8. Import Catalogo (Script)
- Lo script `scripts/import_catalog.py` importa il catalogo da file Excel.
- **Modalità:** Single-pass upsert con `Prefer: resolution=merge-duplicates`.
- **Campi importati:** SKU, titolo IT/EN, descrizione IT/EN, prezzo, stock_quantity, box_quantity, categoria, immagini, materiale, finitura, capacità, collo, collezione.
- **Esecuzione:** `python scripts/import_catalog.py <file.xlsx>`

## 9. Traduzione Colori (Attributo colore)

Il colore del prodotto (`attributes.colore`) viene tradotto in inglese dinamicamente con questa logica:

1. **Match esatto** — se l'intera stringa colore esiste in `translations.ts`, viene usata direttamente (es. `Grigio Scuro satinato` → `Dark Grey Satin`).
2. **Parola per parola** — altrimenti ogni parola viene tradotta singolarmente con ricerca case-insensitive e riassemblata con la punteggiatura preservata (es. `Ghiera e bulbo nero` → `Collar and Bulb Black`).

Per aggiungere una traduzione mancante, modificare `app/src/constants/translations.ts` nelle sezioni colori (IT e EN).
