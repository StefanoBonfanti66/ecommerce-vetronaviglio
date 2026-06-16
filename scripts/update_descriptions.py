import pandas as pd
import os
import httpx
from dotenv import load_dotenv
import numpy as np

# Carica le variabili da scripts/.env
load_dotenv("scripts/.env")

SUPABASE_URL = "https://vsqzxudijllpocrbqfbo.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def update_descriptions(file_path):
    df = pd.read_excel(file_path)
    # Sostituisci NaN con None (che diventa null in JSON)
    df = df.replace({np.nan: None})
    
    updated_count = 0
    for _, row in df.iterrows():
        sku = str(row['Codice'])
        data = {
            "description_it": row['Abstract (it)'],
            "description_en": row['Abstract (en)']
        }
        
        # Aggiorna solo se esiste almeno una delle due descrizioni
        if data["description_it"] or data["description_en"]:
            response = httpx.patch(
                f"{SUPABASE_URL}/rest/v1/products?sku=eq.{sku}",
                headers={**headers, "Prefer": "return=minimal"},
                json=data
            )
            
            if response.status_code == 204:
                updated_count += 1
            else:
                print(f"Error updating {sku}: {response.text}")
            
    print(f"Aggiornamento descrizioni completato: {updated_count} prodotti aggiornati.")

if __name__ == "__main__":
    update_descriptions("/home/sbonfanti/Scrivania/Progetti/ecommerce-vetronaviglio/data/imports/raw/catalogo-vetronaviglio-export.xlsx")
