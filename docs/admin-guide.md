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

## 3. Strumenti Catalogo
- Accedi alla sezione **Strumenti Catalogo** per:
  - **Esportare il catalogo** in formato CSV (utile per analisi o bulk update esterni).
  - Consultare le istruzioni per l'importazione massiva tramite script (operazione tecnica lato server).
