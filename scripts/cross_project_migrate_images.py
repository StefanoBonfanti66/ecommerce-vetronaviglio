"""
Cross-project storage migration: vsqzxudijllpocrbqfbo → cgvztkgbzecyregjrtsh

Downloads images from source Supabase storage, uploads to target, updates image_urls in target DB.
"""

import os
import httpx
import json
import time
from dotenv import load_dotenv

load_dotenv("scripts/.env")

# Source project (download from)
SOURCE_URL = "https://vsqzxudijllpocrbqfbo.supabase.co"
SOURCE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
BUCKET_NAME = "ecommerceBUK"

# Target project (upload to)
TARGET_URL = "https://cgvztkgbzecyregjrtsh.supabase.co"
TARGET_KEY = os.getenv("TARGET_ANON_KEY")

if not SOURCE_KEY:
    print("Errore: SUPABASE_SERVICE_KEY non trovata in scripts/.env")
    exit(1)
if not TARGET_KEY:
    print("Errore: TARGET_ANON_KEY non trovata in scripts/.env")
    exit(1)

source_headers = {
    "apikey": SOURCE_KEY,
    "Authorization": f"Bearer {SOURCE_KEY}",
}

target_headers = {
    "apikey": TARGET_KEY,
    "Authorization": f"Bearer {TARGET_KEY}",
    "Content-Type": "application/json",
}


def list_source_files():
    """List all files in source bucket products/ folder."""
    print("📋 Listing source files...")
    resp = httpx.post(
        f"{SOURCE_URL}/storage/v1/object/list/{BUCKET_NAME}",
        headers=source_headers,
        json={"prefix": "products/", "limit": 1000},
        timeout=30,
    )
    if resp.status_code != 200:
        print(f"❌ List failed: {resp.status_code} {resp.text}")
        return []

    files = resp.json()
    # Filter to .jpg files only
    jpgs = [f["name"] for f in files if f["name"].endswith(".jpg")]
    print(f"✅ Found {len(jpgs)} .jpg files in source")
    return jpgs


def download_from_source(filename):
    """Download a file from source bucket."""
    url = f"{SOURCE_URL}/storage/v1/object/public/{BUCKET_NAME}/products/{filename}"
    resp = httpx.get(url, timeout=30)
    if resp.status_code == 200:
        return resp.content
    return None


def upload_to_target(filename, content):
    """Upload file to target bucket."""
    url = f"{TARGET_URL}/storage/v1/object/{BUCKET_NAME}/products/{filename}"
    headers = {**target_headers, "Content-Type": "image/jpeg"}
    resp = httpx.post(url, headers=headers, content=content, timeout=30)
    return resp.status_code in (200, 201)


def update_target_db(sku, new_url):
    """Update image_urls in target DB."""
    url = f"{TARGET_URL}/rest/v1/products?sku=eq.{sku}"
    headers = {**target_headers, "Prefer": "return=minimal"}
    resp = httpx.patch(url, headers=headers, json={"image_urls": [new_url]}, timeout=15)
    return resp.status_code in (200, 204)


def get_target_products():
    """Get all products from target DB with SKU and image_urls."""
    url = f"{TARGET_URL}/rest/v1/products?select=sku,image_urls&limit=1000"
    resp = httpx.get(url, headers=target_headers, timeout=30)
    if resp.status_code == 200:
        return resp.json()
    print(f"❌ Failed to fetch target products: {resp.status_code} {resp.text}")
    return []


def main():
    # Step 1: List source files
    source_files = list_source_files()
    if not source_files:
        print("No files to migrate")
        return

    # Step 2: Get target products (SKU → image_urls mapping)
    print("\n📋 Fetching target products...")
    target_products = get_target_products()
    print(f"✅ Found {len(target_products)} products in target")

    # Build SKU → image_urls mapping
    sku_to_images = {}
    for p in target_products:
        sku = p["sku"]
        images = p.get("image_urls") or []
        sku_to_images[sku] = images

    # Step 3: Migrate each file
    success = 0
    failed = 0
    skipped = 0

    print(f"\n🚀 Starting migration of {len(source_files)} files...\n")

    for i, filename in enumerate(source_files):
        sku = filename.replace(".jpg", "")

        # Check if already migrated
        existing = sku_to_images.get(sku, [])
        if existing and any("cgvztkgbzecyregjrtsh" in url for url in existing):
            skipped += 1
            continue

        # Download
        content = download_from_source(filename)
        if not content:
            print(f"  ❌ [{i+1}/{len(source_files)}] Download failed: {filename}")
            failed += 1
            continue

        # Upload
        if not upload_to_target(filename, content):
            print(f"  ❌ [{i+1}/{len(source_files)}] Upload failed: {filename}")
            failed += 1
            continue

        # Update DB
        new_url = f"{TARGET_URL}/storage/v1/object/public/{BUCKET_NAME}/products/{filename}"
        if update_target_db(sku, new_url):
            success += 1
            if (success % 50) == 0:
                print(f"  ✅ [{i+1}/{len(source_files)}] Progress: {success} uploaded, {skipped} skipped, {failed} failed")
        else:
            print(f"  ⚠️ [{i+1}/{len(source_files)}] Upload OK but DB update failed: {sku}")
            failed += 1

        # Small delay to avoid rate limiting
        if (i + 1) % 100 == 0:
            time.sleep(0.5)

    print(f"\n📊 Migration complete:")
    print(f"   ✅ Success: {success}")
    print(f"   ⏭️ Skipped (already migrated): {skipped}")
    print(f"   ❌ Failed: {failed}")
    print(f"   📁 Total source files: {len(source_files)}")


if __name__ == "__main__":
    main()
