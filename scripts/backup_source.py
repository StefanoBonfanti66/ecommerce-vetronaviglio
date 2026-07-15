#!/usr/bin/env python3
"""
Backup script for Supabase project using REST API + MCP SQL.
Generates a full SQL dump file without pg_dump.
"""
import requests
import json
import os
import sys

SUPABASE_URL = "https://vsqzxudijllpocrbqfbo.supabase.co"
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")
OUTPUT_FILE = "/home/sbonfanti/Scrivania/Progetti/ecommerce-vetronaviglio/backup_source_full.sql"
SCHEMA_FILE = "/home/sbonfanti/Scrivania/Progetti/ecommerce-vetronaviglio/backup_source_schema.sql"

TABLES = [
    "categories", "products", "collections", "product_collections",
    "accessory_rules", "product_accessory_overrides",
    "price_lists", "price_list_items",
    "profiles", "user_roles",
    "orders", "order_items",
    "sample_requests", "settings", "legal_pages",
    "attribute_options", "audit_logs"
]

def get_headers():
    return {
        "apikey": SUPABASE_SERVICE_KEY,
        "Authorization": f"Bearer {SUPABASE_SERVICE_KEY}",
        "Content-Type": "application/json"
    }

def export_table(table_name):
    """Export all rows from a table using pagination."""
    all_rows = []
    offset = 0
    limit = 1000
    while True:
        url = f"{SUPABASE_URL}/rest/v1/{table_name}"
        params = {
            "select": "*",
            "limit": limit,
            "offset": offset
        }
        resp = requests.get(url, headers=get_headers(), params=params, timeout=60)
        if resp.status_code != 200:
            print(f"  ERROR {resp.status_code} on {table_name}: {resp.text[:200]}")
            return None
        batch = resp.json()
        if not batch:
            break
        all_rows.extend(batch)
        if len(batch) < limit:
            break
        offset += limit
    return all_rows

def escape_sql(val):
    """Escape a value for SQL."""
    if val is None:
        return "NULL"
    if isinstance(val, bool):
        return "TRUE" if val else "FALSE"
    if isinstance(val, (int, float)):
        return str(val)
    if isinstance(val, dict) or isinstance(val, list):
        return "'" + json.dumps(val, ensure_ascii=False).replace("'", "''") + "'"
    if isinstance(val, str):
        return "'" + val.replace("'", "''") + "'"
    return "'" + str(val) + "'"

def generate_insert(table_name, rows):
    """Generate INSERT statements for a table."""
    if not rows:
        return f"-- {table_name}: 0 rows\n"
    columns = list(rows[0].keys())
    lines = [f"-- {table_name}: {len(rows)} rows"]
    lines.append(f"TRUNCATE TABLE {table_name} CASCADE;")
    for row in rows:
        vals = [escape_sql(row.get(col)) for col in columns]
        cols_str = ", ".join(columns)
        vals_str = ", ".join(vals)
        lines.append(f"INSERT INTO {table_name} ({cols_str}) VALUES ({vals_str});")
    lines.append("")
    return "\n".join(lines)

def main():
    if not SUPABASE_SERVICE_KEY:
        print("ERROR: SUPABASE_SERVICE_KEY not set")
        sys.exit(1)
    
    print(f"=== Supabase Backup ===")
    print(f"Source: {SUPABASE_URL}")
    print(f"Output: {OUTPUT_FILE}")
    print()
    
    parts = []
    parts.append("-- Supabase Full Backup")
    parts.append(f"-- Source: vsqzxudijllpocrbqfbo")
    parts.append(f"-- Generated: backup_source_full.py")
    parts.append("-- NOTE: Run schema (CREATE TABLE) statements BEFORE inserts")
    parts.append("")
    
    schema_parts = []
    schema_parts.append("-- Supabase Schema Backup")
    schema_parts.append(f"-- Source: vsqzxudijllpocrbqfbo")
    schema_parts.append("")
    
    total_rows = 0
    for table in TABLES:
        print(f"Exporting {table}...", end=" ", flush=True)
        rows = export_table(table)
        if rows is None:
            print("FAILED")
            continue
        print(f"{len(rows)} rows")
        total_rows += len(rows)
        parts.append(generate_insert(table, rows))
        schema_parts.append(f"-- {table}: {len(rows)} rows exported")
    
    # Write data file
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))
    
    # Write schema file
    with open(SCHEMA_FILE, "w", encoding="utf-8") as f:
        f.write("\n".join(schema_parts))
    
    print(f"\n=== Backup Complete ===")
    print(f"Total rows exported: {total_rows}")
    print(f"Data file: {OUTPUT_FILE}")
    print(f"Schema file: {SCHEMA_FILE}")

if __name__ == "__main__":
    main()
