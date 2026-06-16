import pandas as pd
import json
import httpx
import numpy as np

# Supabase Config
SUPABASE_URL = "https://vsqzxudijllpocrbqfbo.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZzcXp4dWRpamxscG9jcmJxZmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE1OTA3NTQsImV4cCI6MjA5NzE2Njc1NH0.iLe3OnMpOmxfT1zYD8nC-PQ78AktPMyZN4hWNm3zjW4"

def import_data(file_path):
    df = pd.read_excel(file_path)
    # Sostituisci NaN con None (che diventa null in JSON)
    df = df.replace({np.nan: None})
    
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    
    count = 0
    for _, row in df.iterrows():
        # Costruzione attributi JSONB con pulizia
        attrs = {
            "ml": row['ML'] if row['ML'] is not None else None,
            "colore": row['Colore'] if row['Colore'] is not None else None,
            "materiale": row['Materiale'] if row['Materiale'] is not None else None,
            "finitura": row['Finitura'] if row['Finitura'] is not None else None,
            "imboccatura": row['Imboccatura'] if row['Imboccatura'] is not None else None
        }
        
        data = {
            "sku": str(row['Codice']),
            "title_it": str(row['Titolo']),
            "price": float(row['Prezzo']) if row['Prezzo'] is not None else 0.0,
            "attributes": attrs,
            "image_urls": json.dumps([row['Immagine']]) if row['Immagine'] is not None else "[]"
        }
        
        response = httpx.post(f"{SUPABASE_URL}/rest/v1/products", headers=headers, json=data)
        
        if response.status_code == 201:
            count += 1
        else:
            print(f"Error importing {data['sku']}: {response.text}")
            
    print(f"Import completato: {count} prodotti caricati.")

if __name__ == "__main__":
    import_data("/home/sbonfanti/Scrivania/Progetti/ecommerce-vetronaviglio/data/imports/raw/catalogo-vetronaviglio-export.xlsx")
