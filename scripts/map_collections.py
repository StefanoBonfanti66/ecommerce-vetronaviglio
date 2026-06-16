import os
import httpx
from dotenv import load_dotenv

# Carica le variabili da scripts/.env
load_dotenv("scripts/.env")

SUPABASE_URL = "https://vsqzxudijllpocrbqfbo.supabase.co"
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")

headers = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json"
}

def map_collections():
    # 1. Fetch collections
    coll_resp = httpx.get(f"{SUPABASE_URL}/rest/v1/collections?select=id,slug", headers=headers)
    collections = {c['slug']: c['id'] for c in coll_resp.json()}
    
    # 2. Fetch products
    prod_resp = httpx.get(f"{SUPABASE_URL}/rest/v1/products?select=id,title_it", headers=headers)
    products = prod_resp.json()
    
    print(f"Products: {len(products)}, Collections: {len(collections)}")
    
    # Mapping logica
    # Normalizziamo i titoli per il confronto
    for product in products:
        title = product['title_it'] or ""
        slug = None
        
        # Logica di matching: "New Cristal" prima di "Cristal" per evitare match parziali errati
        if "New Cristal" in title: slug = "new-cristal"
        elif "Cristal" in title: slug = "cristal"
        elif "Ambra" in title: slug = "ambra"
        elif "Charme" in title: slug = "charme"
        elif "Double" in title: slug = "double"
        elif "Etoile" in title: slug = "etoile"
        elif "Flora" in title: slug = "flora"
        elif "Giada" in title: slug = "giada"
        elif "Juliet" in title: slug = "juliet"
        elif "Kappa" in title: slug = "kappa"
        elif "Mabel" in title: slug = "mabel"
        elif "Reve" in title: slug = "reve"
        elif "Venus" in title: slug = "venus"
        elif "Royal" in title: slug = "royal"
        elif "Ecoglass" in title: slug = "ecoglass"
        elif "Glossy" in title: slug = "glossy"
        elif "Bambù" in title: slug = "bambu"
        elif "Boston" in title: slug = "boston"
        elif "Denver" in title: slug = "denver"
        elif "Dolly" in title: slug = "dolly"
        elif "Dune" in title: slug = "dune"
        elif "Clio" in title: slug = "clio"

        if slug and slug in collections:
            print(f"Assegno {title} a {slug}")
            # Insert relationship
            httpx.post(
                f"{SUPABASE_URL}/rest/v1/product_collections",
                headers=headers,
                json={"product_id": product['id'], "collection_id": collections[slug]}
            )

if __name__ == "__main__":
    map_collections()
