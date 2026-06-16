-- 1. Categorie (Gerarchiche)
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id UUID REFERENCES categories(id),
  name_it TEXT NOT NULL,
  name_en TEXT NOT NULL
);
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- 2. Prodotti (Struttura flessibile con JSONB per attributi)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sku TEXT UNIQUE NOT NULL,
  title_it TEXT NOT NULL,
  title_en TEXT,
  category_id UUID REFERENCES categories(id),
  price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  box_quantity INTEGER DEFAULT 1,
  description_it TEXT,
  description_en TEXT,
  image_urls JSONB DEFAULT '[]'::jsonb,
  is_accessory BOOLEAN DEFAULT FALSE,
  -- Attributi dinamici (Colore, Capacità, Materiale, ecc.)
  attributes JSONB DEFAULT '{}'::jsonb, 
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 3. Regole di compatibilità accessori (Dynamic Rules)
CREATE TABLE accessory_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  accessory_id UUID REFERENCES products(id) ON DELETE CASCADE,
  -- Condizioni basate su attributi JSONB del prodotto contenitore
  required_attributes JSONB DEFAULT '{}'::jsonb
);
ALTER TABLE accessory_rules ENABLE ROW LEVEL SECURITY;

-- 4. Overrides manuali (Gestione Anomalie)
CREATE TABLE product_accessory_overrides (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  accessory_id UUID REFERENCES products(id) ON DELETE CASCADE,
  action TEXT CHECK (action IN ('FORCE_INCLUDE', 'FORCE_EXCLUDE')),
  PRIMARY KEY (product_id, accessory_id)
);
ALTER TABLE product_accessory_overrides ENABLE ROW LEVEL SECURITY;

-- 5. Collezioni
CREATE TABLE collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_it TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL
);
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;

CREATE TABLE product_collections (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID REFERENCES collections(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, collection_id)
);
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
