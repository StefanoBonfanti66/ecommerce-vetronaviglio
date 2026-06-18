import csv
import os

# Database connection details are managed by the MCP, so I will print the SQL commands
# to be executed.
csv_file = 'data/imports/raw/export_store.csv'

if not os.path.exists(csv_file):
    print(f"File {csv_file} not found.")
    exit(1)

with open(csv_file, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    
    # We will batch updates for efficiency.
    # Actually, generating one giant SQL block is safer.
    
    print("-- Updating stock and box quantities")
    
    for row in reader:
        sku = row['Codice']
        stock = row['Qtà disponibile']
        box = row['Qtà scatola']
        
        # Cleanup
        try:
            stock = int(stock)
            box = int(box)
        except ValueError:
            continue
            
        print(f"UPDATE products SET stock_quantity = {stock}, box_quantity = {box} WHERE sku = '{sku}';")
