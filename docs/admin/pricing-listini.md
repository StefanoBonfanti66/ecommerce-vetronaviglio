# Gestione Listini & Prezzi Personalizzati

## Scopo

Questo documento descrive come funziona il sistema di listini e prezzi personalizzati dell’ecommerce e come devono usarlo CEO e Admin.

L’obiettivo è:
- permettere prezzi diversi per diversi clienti/gruppi;
- mantenere il sistema semplice da gestire;
- garantire coerenza tra admin, frontend e database.

## Concetti chiave

- **Listino base**: prezzo standard del prodotto (campo price in products, più eventuali price_tiers).
- **Listino personalizzato**: tabella price_lists + price_list_items con override di prezzo per alcuni SKU.
- **Profilo utente (profiles)**: contiene, tra le altre cose, il campo price_list_id associato al cliente.
- **Trigger auth -> profiles**: quando viene creato un utente in auth.users, il trigger on_auth_user_created chiama handle_new_user per creare automaticamente il record in public.profiles.
- **Trigger stock**: il trigger DB trg_decrement_stock gestisce il decremento dello stock quando viene confermato un ordine.

## Ruoli e responsabilità

- **CEO**
  - Decide la strategia prezzi per cliente/gruppo.
  - Decide la creazione di nuovi listini speciali (es. “Cliente ACME 2026”).
  - Approva i cambi di prezzo importanti.

- **Admin**
  - Crea i listini e li duplica quando serve.
  - Assegna il listino corretto a ogni cliente (profile).
  - Inserisce o aggiorna i prezzi specifici per SKU nei listini.
  - Controlla che i prezzi visti dal cliente siano coerenti con le regole decise.

## Come funzionano i listini (alto livello)

1. Quando un utente si registra, Supabase crea un record in auth.users.
2. Il trigger on_auth_user_created esegue la funzione handle_new_user che inserisce il record corrispondente in public.profiles.
3. In admin, tramite UserManager, si può assegnare a quel profilo un price_list_id.
4. Ogni listino (price_lists) contiene eventuali override di prezzo per singoli SKU (price_list_items).
5. Sul sito, ProductPage calcola il prezzo finale usando una gerarchia chiara:
   - prezzo da listino personalizzato (se esiste per quello SKU),
   - altrimenti prezzo da price_tiers (sconti per quantità),
   - altrimenti prezzo base del prodotto.

## Flusso operativo – Admin

### 1. Creare un nuovo listino

1. Accedi al pannello Admin.
2. Vai in **Gestione Listini**.
3. Crea un nuovo listino, assegnandogli un nome chiaro (es. “Rivenditori Nord 2026”).
4. (Opzionale ma consigliato) Duplica un listino esistente con il pulsante **Duplica** per partire da qualcosa di già configurato.

### 2. Aggiungere prodotti a un listino

1. Nella pagina **Gestione Listini**, clicca su **Gestisci Prodotti** sul listino desiderato.
2. Usa il campo di ricerca per trovare il prodotto per SKU o titolo.
3. Seleziona lo SKU e imposta il prezzo specifico per quel listino.
4. Salva. Il record viene scritto in price_list_items con { price_list_id, sku, price }.

Nota: se il prezzo base del prodotto cambia, il prezzo custom nel listino NON si aggiorna automaticamente. È un override esplicito: va rivisto manualmente quando necessario.

### 3. Assegnare un listino a un utente

1. Vai in **User Manager** nel pannello Admin.
2. Trova l’utente nella lista.
3. Usa la select del listino per assegnargli il listino corretto (o lascia “Listino Base” se non serve un listino dedicato).
4. Le modifiche vengono salvate nel campo price_list_id della tabella profiles.

Le policy RLS permettono solo ad Admin/CEO di modificare questi dati.

## Come viene calcolato il prezzo sul sito

In ProductPage esiste una funzione centralizzata:

- `resolvePrice(product, quantity, customPrice)` applica questa logica:
  1. se esiste un prezzo specifico nel listino (customPrice), usa quello;
  2. se non esiste, controlla le price_tiers del prodotto in base alla quantità;
  3. se non ci sono tier applicabili, usa il prezzo base prodotto.

Quando l’utente aggiunge al carrello:
- ProductPage calcola il prezzo con resolvePrice;
- passa prezzo e quantità al carrello;
- Checkout calcola il totale come sum(item.price * item.quantity).

In questo modo:
- il prezzo mostrato in ProductPage,
- il prezzo nel carrello,
- e il totale in Checkout
sono sempre coerenti.

## Comportamento dello stock

- Lo stock reale viene gestito da un trigger DB (trg_decrement_stock) quando l’ordine viene registrato.
- La pagina prodotto non forza lo stock in locale dopo l’add-to-cart per evitare desincronizzazioni.
- È normale che la UI mostri lo stesso stock finché la pagina non viene ricaricata o finché non verrà implementata una logica realtime.

## Casi da testare periodicamente

Quando riapri il progetto o dopo modifiche importanti, verifica:

1. Utente con listino e SKU override:
   - assegna un listino con prezzo speciale per una SKU;
   - loggati come quell’utente e controlla che il prezzo sia quello del listino.

2. Utente con listino senza override su quella SKU:
   - controlla che veda il prezzo in base ai price_tiers o al prezzo base.

3. Utente senza listino:
   - rimuovi il price_list_id dal profilo (o crea un nuovo utente);
   - controlla che veda solo tiers/base.

4. Coerenza carrello/checkout:
   - aggiungi un prodotto al carrello;
   - verifica che il prezzo unitario e il totale in Checkout siano corretti e coerenti con ProductPage.

5. Trigger profili:
   - crea un nuovo utente;
   - verifica che esista il record in public.profiles collegato a auth.users.

Se tutti questi punti sono ok, il sistema listini è considerato in salute.

## Evoluzioni possibili (fase 2)

Non sono necessarie per la produzione, ma possibili step futuri:

- date di validità dei listini (es. “Contratto 2026” con inizio/fine);
- note interne per ogni listino (es. condizioni commerciali);
- livelli di sconto aggiuntivi per categoria di prodotto;
- aggiornamento in tempo reale di stock e prezzi tramite subscriptions.
