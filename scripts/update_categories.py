import pandas as pd
import httpx
import os
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

def update_categories(file_path):
    df = pd.read_excel(file_path)
    df = df.where(pd.notnull(df), None)
    
    updated_count = 0
    
    # 1. Fetch all products to get their current attributes and IDs
    prod_resp = httpx.get(f"{SUPABASE_URL}/rest/v1/products?select=id,sku,attributes", headers=headers)
    products = {p['sku']: p for p in prod_resp.json()}
    
    for _, row in df.iterrows():
        sku = str(row['Codice'])
        if sku not in products:
            continue
            
        prod = products[sku]
        attrs = prod.get('attributes', {})
        
        # Aggiorna la categoria
        new_cat = row['Categoria']
        if attrs.get('categoria') != new_cat:
            attrs['categoria'] = new_cat
            
            # Update DB
            response = httpx.patch(
                f"{SUPABASE_URL}/rest/v1/products?sku=eq.{sku}",
                headers={**headers, "Prefer": "return=minimal"},
                json={"attributes": attrs}
            )
            
            if response.status_code == 204:
                updated_count += 1
            else:
                print(f"Error updating {sku}: {response.text}")
            
    print(f"Aggiornamento categorie completato: {updated_count} prodotti aggiornati.")

if __name__ == "__main__":
    update_categories("/home/sbonfanti/Scrivania/Progetti/ecommerce-vetronaviglio/data/imports/raw/catalogo-vetronaviglio-export.xlsx")
