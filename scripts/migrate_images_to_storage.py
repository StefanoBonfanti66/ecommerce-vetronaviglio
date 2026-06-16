import os
import httpx
from dotenv import load_dotenv
import json

# Carica le variabili da scripts/.env
load_dotenv("scripts/.env")

SUPABASE_URL = "https://vsqzxudijllpocrbqfbo.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
BUCKET_NAME = "ecommerceBUK"

if not SUPABASE_KEY:
    print("Errore: SUPABASE_SERVICE_KEY non trovata in scripts/.env")
    exit(1)

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def migrate_all_images():
    # 1. Fetch all products
    response = httpx.get(f"{SUPABASE_URL}/rest/v1/products?select=sku,image_urls", headers=headers)
    products = response.json()
    
    print(f"Prodotti trovati: {len(products)}")
    
    for product in products:
        sku = product['sku']
        old_url = product['image_urls'][0] if isinstance(product['image_urls'], list) and len(product['image_urls']) > 0 else None
        
        # Check if already migrated
        if old_url and BUCKET_NAME in old_url:
            print(f"⏭️ {sku} già migrato, saltato.")
            continue
            
        if not old_url or "vetronaviglio.eu" not in old_url:
            continue
            
        print(f"Migrating {sku}...")
        
        try:
            # Download
            img_response = httpx.get(old_url, timeout=15)
            if img_response.status_code != 200:
                print(f"❌ Download failed for {sku}")
                continue
            
            # Upload
            file_path = f"products/{sku}.jpg"
            upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{file_path}"
            
            upload_headers = {**headers, "Content-Type": "image/jpeg"}
            upload_resp = httpx.post(upload_url, headers=upload_headers, content=img_response.content)
            
            if upload_resp.status_code == 200:
                # Update DB
                new_public_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{file_path}"
                update_resp = httpx.patch(
                    f"{SUPABASE_URL}/rest/v1/products?sku=eq.{sku}",
                    headers={**headers, "Prefer": "return=representation"},
                    json={"image_urls": [new_public_url]}
                )
                print(f"✅ {sku} migrated.")
            else:
                print(f"❌ Upload failed for {sku}: {upload_resp.text}")
                
        except Exception as e:
            print(f"❌ Error {sku}: {e}")

if __name__ == "__main__":
    migrate_all_images()
