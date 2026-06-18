import csv
import os

csv_file = 'data/imports/raw/export_store.csv'

if not os.path.exists(csv_file):
    print(f"File {csv_file} not found.")
    exit(1)

# Elenco di categorie da flaggare come accessori
accessory_categories = [
    'cover', 
    'capsule', 
    'disctop', 
    'contagocce', 
    'coperchi in urea', 
    'dispenser', 
    'coperchi', 
    'capsule in urea'
]

with open(csv_file, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    print("-- Flagging additional accessories")
    
    for row in reader:
        categoria = row['Categoria']
        sku = row['Codice']
        
        # Check if any of the categories match
        if categoria and any(cat in categoria.lower() for cat in accessory_categories):
            print(f"UPDATE products SET is_accessory = true WHERE sku = '{sku}';")
