# Piano Migrazione Supabase — ecommerce-vetronaviglio

> **Stato:** Fase 4 — Backup completato, restore in attesa di esecuzione
> **Data:** 2026-07-15
> **Source:** ecommerceDB (`vsqzxudijllpocrbqfbo`) — ORG: `ccznwmozaiwopuahtgcy`
> **Target:** ecommerceDB-eu (`cgvztkgbzecyregjrtsh`) — ORG: `isbqxskmbqpyivjzmzzv` — eu-west-1

---

## Riepilogo Source

| Campo | Valore |
|---|---|
| Project name | `ecommerceDB` |
| Project ref | `vsqzxudijllpocrbqfbo` |
| URL | `https://vsqzxudijllpocrbqfbo.supabase.co` |
| DB Host | `db.vsqzxudijllpocrbqfbo.supabase.co` |
| Status | **ACTIVE_HEALTHY** |
| Region | eu-west-1 |
| Postgres | 17.6.1.127 |
| Organization | `ccznwmozaiwopuahtgcy` |

---

## 1. Riattivazione Source Project

**Stato:** Il progetto è già `ACTIVE_HEALTHY`. Nessuna azione necessaria.

> ⚠️ NOTA: Durante le prime query MCP il progetto risultava INACTIVE e variasi query davano timeout. Ora è attivo e risponde correttamente.

---

## 2. Creazione / Collegamento Target

### Azione richiesta (PRIMA di procedere)

Il target deve essere fornito dall'utente. Opzioni:

| Opzione | Descrizione |
|---|---|
| **A** | Fornire project_ref di un progetto già esistente sul nuovo account |
| **B** | Creare un nuovo progetto Supabase sull'org target (serve org_id + region) |
| **C** | Usare un branch di sviluppo sullo stesso account (per testing) |

### Prerequisiti target
- Nuova organization Supabase sul target account
- Piano Supabase Free (o superiore) con Postgres 17
- API access token con permessi sul progetto target

---

## 3. Strategia Dump / Backup del Source

### 3.1 Database Schema + Dati (pg_dump)

```bash
# Dump completo schema + dati (via Supabase connection string)
pg_dump \
  "postgresql://postgres.[REF]:[PASSWORD]@db.[REF].supabase.co:5432/postgres" \
  --schema=public \
  --no-owner \
  --no-privileges \
  --verbose \
  -f backup_source_full.sql

# Solo schema (senza dati) per verifica
pg_dump \
  "postgresql://postgres.[REF]:[PASSWORD]@db.[REF].supabase.co:5432/postgres" \
  --schema=public \
  --schema-only \
  --no-owner \
  --no-privileges \
  -f backup_source_schema.sql
```

**Note:**
- Il password del database si trova nel dashboard Supabase → Settings → Database → Connection string → URI
- `pg_dump` preserva: tabelle, RLS policies, funzioni (RPC), triggers, sequences, indici
- NON preserva: Edge Functions, Storage buckets/policies, Auth config, Extensions (gestiti da Supabase)

### 3.2 Auth Users Export

```sql
-- Da eseguire con service_role key via psql o Dashboard SQL Editor
SELECT id, email, raw_user_meta_data, raw_app_meta_data, created_at, last_sign_in_at
FROM auth.users;
```

### 3.3 Storage Export

```bash
# Listare tutti gli oggetti nel bucket
curl -s "https://[REF].supabase.co/storage/v1/object/list/ecommerceBUK" \
  -H "Authorization: Bearer [SERVICE_KEY]" \
  -H "apikey: [SERVICE_KEY]"
```

> ⚠️ Non esiste un dump nativo di Supabase Storage. La migrazione bucket richiede download manuale + re-upload.

### 3.4 Edge Functions

Le 3 Edge Functions devono essere **salvate localmente** prima della migrazione:

```bash
# Salva codice di ogni Edge Function
npx supabase functions download send-order-email
npx supabase functions download admin-create-user
npx supabase functions download admin-delete-user
```

**Edge Functions da migrare:**

| Function | Versione | JWT | Note |
|---|---|---|---|
| `send-order-email` | v22 | No | Invio email ordini |
| `admin-create-user` | v2 | Yes | Crea utenti admin |
| `admin-delete-user` | v1 | Yes | Cancella utenti (auth + profiles) |

### 3.5 Migrations Locali

Le migrations sono 18 (dal 2026-06-16 al 2026-06-18). Verificare che il file `supabase/migrations/` esista nel repo. Se non esiste, ricostruire dalle SQL files in `scripts/`.

**Migrations Supabase (18):**
1. `20260616092058_init_catalog_structure`
2. `20260618065510_m2_governance_triggers_only`
3. `20260618070512_m2_stock_decrement_trigger`
4. `20260618071513_m2_stock_update_full`
5. `20260618093933_recreate_user_roles_table`
6. `20260618093939_enable_admin_delete_profiles_retry`
7. `20260618101324_add_price_tiers_to_products`
8. `20260618102948_create_price_lists_tables_and_add_profile_column`
9. `20260618103408_enable_rls_policies_for_price_lists`
10. `20260618103535_add_read_policy_to_user_roles`
11. `20260618104330_fix_profiles_update_policy`
12. `20260618104512_m2_fix_profiles_rls_and_duplicate_rpc`
13. `20260618105524_flag_accessories_manual_apply`
14. `20260618105848_flag_all_accessories_apply`
15. `20260618121001_create_get_compatible_accessories_function`
16. `20260618122137_update_get_compatible_accessories_stock_filter`
17. `20260618122206_drop_and_recreate_rpc`
18. `20260618123549_limit_compatible_accessories_rpc`
19. `20260618144301_add_discount_to_price_lists`

---

## 4. Strategia Restore

### 4.1 Schema + Dati

```bash
# Restore completo
psql "postgresql://postgres.[TARGET_REF]:[PASSWORD]@db.[TARGET_REF].supabase.co:5432/postgres" \
  -f backup_source_full.sql
```

### 4.2 Ordine di Restore (per dipendenze FK)

1. `categories` (no FK esterne)
2. `products` (FK → categories)
3. `collections`
4. `product_collections` (FK → products + collections)
5. `accessory_rules` (FK → products)
6. `product_accessory_overrides` (FK → products)
7. `price_lists`
8. `price_list_items` (FK → price_lists + products.sku)
9. `profiles` (FK → auth.users + price_lists) — **dopo Auth users**
10. `user_roles` (FK → auth.users) — **dopo Auth users**
11. `orders` (FK → auth.users)
12. `order_items` (FK → orders + products)
13. `sample_requests` (FK → auth.users + products)
14. `settings` (no FK)
15. `legal_pages` (no FK)
16. `attribute_options` (no FK)
17. `audit_logs` (FK → auth.users) — **dopo Auth users**

### 4.3 RLS Policies

Le RLS policies vengono preservate da `pg_dump`. Verificare dopo restore con:

```sql
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

### 4.4 Functions / Triggers

Le funzioni vengono preservate da `pg_dump`. Funzioni identificate:

| Funzione | Tipo | Note |
|---|---|---|
| `audit_trigger_func()` | SECURITY DEFINER, TRIGGER | Audit log automatico |
| `handle_new_user()` | SECURITY DEFINER, TRIGGER | Auto-crea profile al signup |
| `decrement_stock_trigger()` | TRIGGER | Decrementa stock all'ordine |
| `get_compatible_accessories(principal_sku)` | RPC, SECURITY DEFINER | Catalogo accessori compatibili |
| `create_order_atomic(p_items, p_shipping_address)` | RPC, SECURITY DEFINER | Creazione ordine atomica |
| `duplicate_price_list(source_id, new_name)` | RPC, SECURITY DEFINER | Duplica listino |
| `rls_auto_enable()` | SECURITY DEFINER | Utility RLS |

---

## 5. Migrazione Storage Bucket `ecommerceBUK`

### Strategia: Download + Re-upload

Non esiste un dump nativo di Supabase Storage. La procedura è:

```bash
# 1. Listare tutti gli oggetti
# (usare MCP o API REST)

# 2. Scaricare ogni file
curl -o /tmp/ecommerceBUK/[path] \
  "https://[SOURCE_REF].supabase.co/storage/v1/object/public/ecommerceBUK/[path]" \
  -H "apikey: [SOURCE_ANON_KEY]"

# 3. Creare bucket nel target
# (via Dashboard o MCP)

# 4. Re-upload ogni file
curl -X POST \
  "https://[TARGET_REF].supabase.co/storage/v1/object/ecommerceBUK/[path]" \
  -H "Authorization: Bearer [TARGET_SERVICE_KEY]" \
  -H "Content-Type: [mime]" \
  --data-binary @[local_file]
```

### Storage Policies da Ricreare

Le storage policies **NON** vengono preservate da `pg_dump`. Devono essere ricreate manualmente.

### Script Consigliato

Creare uno script Python che:
1. Lista tutti gli oggetti nel bucket source
2. Downloada ogni file in locale
3. Uploada ogni file nel target
4. Verifica integrità (SHA256)

> ⚠️ **Da chiedere prima:** quanti file sono nel bucket? Da verificare con MCP o Dashboard.

---

## 6. Migrazione Auth / Users / Ruoli

### 6.1 Auth Users

**Opzione A — Dashboard:** Importa utenti dal pannello Auth del target
**Opzione B — Script:** Usa le Admin API per ricreare gli utenti

```bash
# Per ogni utente dal dump:
curl -X POST "https://[TARGET_REF].supabase.co/auth/v1/admin/users" \
  -H "Authorization: Bearer [TARGET_SERVICE_KEY]" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "[email]",
    "password": "[TEMP_PASSWORD]",
    "email_confirm": true,
    "user_metadata": { ... }
  }'
```

> ⚠️ **Attenzione:** Le password hashate NON sono esportabili. Gli utenti dovranno resettare la password.

### 6.2 Profiles + User Roles

I profili e i ruoli sono tabelle standard nel DB e vengono migrati con `pg_dump`.

**Ruoli supportati:** `admin`, `ceo`, `magazzino`, `acquisti`, `customer`

### 6.3 Auth Configuration

Configurazione da ricreare nel target:

| Setting | Source | Target |
|---|---|---|
| Site URL | (Dashboard) | Verificare redirect URL |
| Email Templates | (Default Supabase) | Ricreare personalizzazioni |
| SMTP | Deferred (Resend) | Da configurare |
| Password Policy | Default | Abilitare leaked password protection |
| JWT Expiry | Default | Verificare |

---

## 7. Verifica Edge Functions

### Dopo restore, re-deploy delle 3 funzioni:

```bash
npx supabase functions deploy send-order-email --project-ref [TARGET_REF]
npx supabase functions deploy admin-create-user --project-ref [TARGET_REF]
npx supabase functions deploy admin-delete-user --project-ref [TARGET_REF]
```

### Verificare secrets:

```bash
# Verificare secrets nel target
npx supabase secrets list --project-ref [TARGET_REF]
```

I secrets delle Edge Functions dipendono dal contesto del progetto target.

---

## 8. Aggiornamento Env nel Repo e su Vercel

### 8.1 File da Aggiornare

| File | Campi | Priorità |
|---|---|---|
| `app/.env` | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` | ALTA |
| `scripts/.env` | `SUPABASE_SERVICE_KEY` | ALTA |
| `scripts/import_catalog.py` | URL hardcoded (righe 7-8), anon key hardcoded | ALTA |
| `scripts/migrate_images_to_storage.py` | URL hardcoded (riga 9) | ALTA |
| `scripts/update_descriptions.py` | URL hardcoded | MEDIA |
| `scripts/update_categories.py` | URL hardcoded | MEDIA |
| `scripts/map_collections.py` | URL hardcoded | MEDIA |
| `scripts/fix_storage_mimetype.py` | URL hardcoded | MEDIA |

### 8.2 Vercel Environment Variables

```
VITE_SUPABASE_URL=https://[TARGET_REF].supabase.co
VITE_SUPABASE_ANON_KEY=[NEW_ANON_KEY]
```

Aggiornare via Dashboard Vercel → Project → Settings → Environment Variables

### 8.3 Nuove Credenziali Target

Dopo creazione del target, servono:
- `anon key` (per frontend)
- `service_role key` (per scripts)
- `project_ref` (per URL)
- `DB password` (per pg_dump/restore)

---

## 9. Checklist Test Post-Migrazione

### 9.1 Database
- [ ] Schema completo: 17 tabelle presenti
- [ ] Dati: conteggio righe uguale su tutte le tabelle
- [ ] RLS: policies attive e corrette
- [ ] Functions: tutte le 7 RPC presenti e funzionanti
- [ ] Triggers: `audit_trigger_func`, `handle_new_user`, `decrement_stock_trigger` attivi

### 9.2 Auth
- [ ] Login funzionante (email + password)
- [ ] Reset password funzionante
- [ ] Ruoli admin/ceo/magazzino/acquisti assegnati correttamente
- [ ] Profile creati per ogni utente

### 9.3 Frontend
- [ ] Home page carica catalogo
- [ ] Catalogo con filtri Vetro/Plastica/Accessori
- [ ] Pagina prodotto con dettagli + prezzi
- [ ] Carrello con validazione minimo €250
- [ ] Checkout + creazione ordine
- [ ] Login/Logout
- [ ] Admin panel: ProductList, ProductEditor, UserManager, CollectionManager, Settings

### 9.4 Storage
- [ ] Bucket `ecommerceBUK` creato nel target
- [ ] Tutte le immagini accessibili via URL pubblico
- [ ] Upload immagini funzionante (ImageUploader)

### 9.5 Edge Functions
- [ ] `send-order-email` risponde
- [ ] `admin-create-user` funziona (richiede JWT admin)
- [ ] `admin-delete-user` funziona (richiede JWT admin)

### 9.6 Scripts
- [ ] `import_catalog.py` funziona con nuovo target
- [ ] `migrate_images_to_storage.py` funziona
- [ ] `update_descriptions.py` funziona
- [ ] `update_categories.py` funziona
- [ ] `map_collections.py` funziona

### 9.7 Vercel
- [ ] Deploy riuscito con nuove env vars
- [ ] Sito accessibile su URL preview
- [ ] Nessun errore in console browser

---

## 10. Rollback Plan

### Se la migrazione fallisce:

1. **Source intatto:** Il source non è mai stato modificato. Riattivare il deployment Vercel con le env vars originali.
2. **Vercel:** Ripristinare `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY` originali.
3. **DNS:** Il dominio `vetronaviglio.eu` non è ancora mappato, quindi non c'è rischio di propagazione.
4. **Database:** Non è stato eseguito nessun destructive operation sul source.

### Se il target è compromesso:
- Eliminare il progetto target
- Il source rimane intatto e funzionante

---

## 11. Remediation Plan (Sicurezza)

### 11.1 MCP Account-Level Non Scoped

**Problema:** L'MCP Supabase è configurato a livello account, non progetto. Può accedere a tutti i 6 progetti.

**Remediation:**
1. **Corto termine:** Aggiungere vincolo nel file di configurazione progetto (regola in `AGENTS.md`) che vieta operazioni MCP su project_ref diversi da quello dichiarato.
2. **Medio termine:** Configurare l'MCP con un token API Supabase a scope ridotto, se Supabase lo supporta.
3. **Lungo termine:** Valutare l'uso di project-scoped API keys o service role keys dedicati.

**Stato:** Documentato. Nessuna modifica al config MCP (Supabase non supporta project-scoped MCP tokens attualmente).

### 11.2 Anon Key Hardcoded in import_catalog.py

**Problema:** `scripts/import_catalog.py` riga 7-8 ha URL e anon key hardcoded.

**Remediation:**
1. Sostituire con `os.getenv("SUPABASE_URL")` e `os.getenv("SUPABASE_ANON_KEY")`
2. Aggiungere le variabili in `scripts/.env`
3. Aggiungere `scripts/.env` al `.gitignore`

**Stato:** Da implementare. Prima della migrazione è il momento ideale.

### 11.3 URL Hardcoded Negli Script Python

**Problema:** 5 script Python hanno l'URL Supabase hardcoded.

**Script interessati:**
- `scripts/import_catalog.py` (riga 7)
- `scripts/migrate_images_to_storage.py` (riga 9)
- `scripts/update_descriptions.py` (riga 10)
- `scripts/update_categories.py` (riga 10)
- `scripts/map_collections.py` (riga 8)
- `scripts/fix_storage_mimetype.py` (riga 8)

**Remediation:**
1. Sostituire tutti gli URL hardcoded con `os.getenv("SUPABASE_URL")`
2. centralizzare la configurazione in `scripts/.env`

**Stato:** Da implementare. Miglioramento post-migrazione.

---

## 12. Issues di Sicurezza Rilevate (Security Advisors)

Il Supabase Security Advisor ha rilevato le seguenti issue:

### WARN (da correggere post-migrazione)

1. **RLS Enabled No Policy** — Tabelle con RLS abilitato ma nessuna policy:
   - `accessory_rules`
   - `audit_logs`
   - `categories`
   
   > Le policy potrebbero essere state create via Dashboard e non catturate da migrations.

2. **Function Search Path Mutable** — Funzioni con search_path mutabile:
   - `audit_trigger_func`, `handle_new_user`, `decrement_stock_trigger`, `duplicate_price_list`, `get_compatible_accessories`

3. **RLS Policy Always True** — Policy troppo permissiva:
   - `attribute_options` — policy `Allow write for authenticated users` su ALL (bypassa RLS)

4. **SECURITY DEFINER callable by anon** — Funzioni eseguibili da ruolo anon:
   - `audit_trigger_func`, `duplicate_price_list`, `get_compatible_accessories`, `handle_new_user`, `rls_auto_enable`

5. **Leaked Password Protection** — Non abilitato.

**Remediation post-migrazione:** Correggere tutti questi issue nel target come parte del "fresh start".

---

## 13. Cronoprogramma

| Fase | Azione | Stato |
|---|---|---|
| 1 | Audit source | COMPLETATO |
| 2 | Pianificazione (questo doc) | COMPLETATO |
| 3 | Fornire target (project_ref o creazione) | COMPLETATO |
| 4 | Backup source (data + schema + edge functions) | **COMPLETATO** |
| 5 | Restore su target | DA FARE |
| 6 | Migrazione Auth users | DA FARE |
| 7 | Migrazione Storage (610 files) | DA FARE |
| 8 | Deploy Edge Functions | DA FARE |
| 9 | Update env vars (repo + Vercel) | DA FARE |
| 10 | Remediation sicurezza | DA FARE |
| 11 | Test completo | DA FARE |
| 12 | Go-live target | DA FARE |

---

## 14. Backup — Stato Completato

### File di Backup

| File | Contenuto | Righe |
|---|---|---|
| `backup_source_full.sql` | Dati INSERT (tutte le tabelle) | 2477 |
| `backup_source_schema.sql` | DDL schema (tabelle, FK, RLS, funzioni) | 557 |
| `backup_edge_functions/` | 3 Edge Functions | - |
| `scripts/backup_source.py` | Script di backup custom | - |

### Auth Users (4)

| Email | Role | Primo Accesso |
|---|---|---|
| s.bonfanti@vetronaviglio.it | CEO | 2026-06-24 |
| sbonfanti@hotmail.com | - | - |
| b.solitodesolis@vetronaviglio.it | CEO | 2026-06-22 |
| f.rosi@vetronaviglio.it | CEO | - |

### Storage (ecommerceBUK)

- **610 files** nel bucket `ecommerceBUK`
- Tutti in sottocartella `products/`
- Tutti `image/jpeg`
- Bucket è PUBLIC

### Note Critiche per Restore

1. **`send-order-email-trigger`** — contiene service_role JWT hardcoded e URL sorgente. Aggiornare al restore.
2. **`create_order_atomic`** — fa riferimento a `order_items.price_at_time` ma la colonna non esiste nello schema DDL. Investigare prima del restore.
3. Le 610 immagini storage NON vengono preservate da pg_dump. Serve migration separata (download + re-upload).

---

## 15. Prossimo Step

> **Stato:** Backup completato. Pronto per restore.
> 
> **Prossime azioni:**
> 1. Verificare se `order_items.price_at_time` è necessario (probabilmente è un refactoring incompleto)
> 2. Procedere con restore dello schema + dati sul target `cgvztkgbzecyregjrtsh`
> 3. Creare bucket `ecommerceBUK` sul target
> 4. Migration delle 610 immagini (download + re-upload)
> 5. Deploy delle 3 Edge Functions
> 6. Configurare auth (reset password per 4 utenti)
> 7. Aggiornare env vars (repo + Vercel)
