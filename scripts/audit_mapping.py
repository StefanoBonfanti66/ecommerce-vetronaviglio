import pandas as pd
import json

# Definizione del mapping desiderato (Excel Column -> DB Field Name, Type)
# Mappiamo tutte le 25 colonne rilevate.
mapping = {
    'ID': ('original_id', 'INTEGER'),
    'Codice': ('sku', 'TEXT UNIQUE'),
    'Titolo': ('title_it', 'TEXT'),
    'Categoria': ('categoria', 'TEXT'), # Potrebbe essere una foreign key in futuro
    'Sottocategoria': ('sottocategoria', 'TEXT'),
    'Sottocategoria (ID)': ('sottocategoria_id', 'INTEGER'),
    'Tipologia': ('tipologia', 'TEXT'),
    'Prezzo': ('price', 'DECIMAL(10,2)'),
    'Qtà scatola': ('box_quantity', 'INTEGER'),
    'Qtà disponibile': ('stock_quantity', 'INTEGER'),
    'ML': ('ml', 'INTEGER'),
    'Capacità': ('capacita_ml', 'INTEGER'),
    'Capacità (ID)': ('capacita_id', 'INTEGER'),
    'Colore': ('colore', 'TEXT'),
    'Color': ('color_en', 'TEXT'),
    'Finitura': ('finitura', 'TEXT'),
    'Materiale': ('materiale', 'TEXT'),
    'Materiale (ID)': ('materiale_id', 'INTEGER'),
    'Imboccatura': ('neck_type', 'TEXT'),
    'Materiale *': ('materiale_note', 'TEXT'),
    'Immagine': ('image_urls', 'JSONB'),
    'Abstract (it)': ('description_it', 'TEXT'),
    'Abstract (en)': ('description_en', 'TEXT'),
    'Nota fitting (it)': ('fitting_note_it', 'TEXT'),
    'Nota fitting en)': ('fitting_note_en', 'TEXT')
}

def generate_audit_report(file_path):
    df = pd.read_excel(file_path)
    excel_cols = df.columns.tolist()
    
    print("| Colonna Excel | Campo DB | Tipo DB | Stato |")
    print("|---|---|---|---|")
    
    for col in excel_cols:
        if col in mapping:
            field, db_type = mapping[col]
            print(f"| {col} | {field} | {db_type} | ✅ Mappato |")
        else:
            print(f"| {col} | N/A | N/A | ❌ MANCANTE |")

if __name__ == "__main__":
    file_path = "/home/sbonfanti/Scrivania/Progetti/ecommerce-vetronaviglio/data/imports/raw/catalogo-vetronaviglio-export.xlsx"
    generate_audit_report(file_path)
