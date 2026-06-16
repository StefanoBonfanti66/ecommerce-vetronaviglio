import os
import httpx
from dotenv import load_dotenv

# Carica le variabili da scripts/.env
load_dotenv("scripts/.env")

SUPABASE_URL = "https://vsqzxudijllpocrbqfbo.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
BUCKET_NAME = "ecommerceBUK"

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}"
}

def fix_mimetypes():
    # 1. List files in the bucket
    list_url = f"{SUPABASE_URL}/storage/v1/object/list/{BUCKET_NAME}"
    response = httpx.post(list_url, headers=headers, json={"prefix": "products/"})
    files = response.json()
    
    print(f"Files found in bucket: {len(files)}")
    
    for file in files:
        file_path = f"products/{file['name']}"
        print(f"Fixing {file_path}...")
        
        # 2. Get current content
        download_url = f"{SUPABASE_URL}/storage/v1/object/public/{BUCKET_NAME}/{file_path}"
        img_response = httpx.get(download_url)
        
        if img_response.status_code == 200:
            # 3. Re-upload with correct MIME type
            upload_url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET_NAME}/{file_path}"
            upload_headers = {
                **headers, 
                "Content-Type": "image/jpeg",
                "x-upsert": "true" # Force overwrite
            }
            upload_resp = httpx.post(upload_url, headers=upload_headers, content=img_response.content)
            
            if upload_resp.status_code == 200:
                print(f"✅ Fixed {file_path}")
            else:
                print(f"❌ Failed {file_path}: {upload_resp.text}")

if __name__ == "__main__":
    fix_mimetypes()
