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

## 4. Gestione Utenti
- Accedi alla sezione **Gestione Utenti** per visualizzare, modificare i ruoli o eliminare account.
- **Creazione Utente:** Clicca "Aggiungi Utente" per creare un nuovo profilo.
- **Ruoli:** Assegna un ruolo (admin, ceo, magazzino, acquisti, customer) per controllare i permessi.

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
