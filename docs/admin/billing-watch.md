# /billing-watch (Workflow Locale)

## Nota bene
Il comando master `/billing-watch` è definito nel repository globale `opencode-config`.
Questa documentazione descrive esclusivamente l'integrazione e il workflow locale di questo progetto.

## Descrizione
Strumento operativo per il monitoraggio dello stato di fatturazione e incassi. Legge i dati dai repository di progetto (`docs/admin/`, `docs/invoices/`) per identificare scadenze, ritardi o anomalie e verifica la coerenza tra `docs/invoices/` e i dati consolidati aziendali.

## Utilizzo
Utilizza il comando globale:
```bash
/billing-watch
```
*(Lo script locale `scripts/monitor_billing.py` è richiamato internamente se necessario per logiche di progetto specifiche).*

## Output atteso
- Elenco sintetico fatture (scadenze, stati).
- Rilevazione anomalie o incoerenze tra fatturato operativo e `docs/admin/summary-globale.md`.
- Note sintetiche e TODO operativi per [[Agente - Amministrazione]] e il CEO.

## Collegamenti
- [[Processo - Fatturazione & Ledger]]
- [[Agente - Amministrazione]]
- [[Agente - Fatturazione]]

## Sicurezza e Responsabilità
- Il comando opera in sola lettura (`read-only`) sui dati reali.
- NON aggiorna automaticamente ledger o file di fatturazione.
- Genera esclusivamente proposte operative e TODO per le azioni di aggiornamento che devono essere validate da [[Agente - Amministrazione]] e confermate dal CEO.

## Requisiti
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`
(Configurabili come variabili d'ambiente).
