import csv
import os

csv_file = 'data/imports/raw/export_store.csv'

if not os.path.exists(csv_file):
    print(f"File {csv_file} not found.")
    exit(1)

with open(csv_file, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    print("-- Flagging accessories based on 'Cover' in Categoria")
    
    for row in reader:
        categoria = row['Categoria']
        sku = row['Codice']
        
        # Check if 'cover' is in the category name (case-insensitive)
        if categoria and 'cover' in categoria.lower():
            print(f"UPDATE products SET is_accessory = true WHERE sku = '{sku}';")
