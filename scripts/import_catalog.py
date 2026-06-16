import pandas as pd
import os

def dry_run_import(file_path):
    if not os.path.exists(file_path):
        print(f"File not found: {file_path}")
        return

    print(f"Reading {file_path}...")
    df = pd.read_excel(file_path)
    
    print("\n--- Columns Detected ---")
    print(df.columns.tolist())
    
    print("\n--- Preview (First 5 records) ---")
    print(df.head(5).to_string())
    
    # Check for empty/missing values in critical fields (example)
    print("\n--- Basic Quality Check (Missing Values) ---")
    print(df.isnull().sum())

if __name__ == "__main__":
    file_path = "/home/sbonfanti/Scrivania/Progetti/ecommerce-vetronaviglio/data/imports/raw/catalogo-vetronaviglio-export.xlsx"
    dry_run_import(file_path)
