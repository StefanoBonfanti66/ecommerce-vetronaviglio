-- =============================================
-- SCHEMA BACKUP: ecommerceDB (vsqzxudijllpocrbqfbo)
-- Generated: 2026-07-15
-- NOTE: Run this BEFORE the data inserts
-- =============================================

-- =============================================
-- SEQUENCES
-- =============================================
CREATE SEQUENCE IF NOT EXISTS attribute_options_id_seq;

-- =============================================
-- TABLES
-- =============================================

CREATE TABLE categories (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_it text NOT NULL,
  parent_id uuid,
  CONSTRAINT categories_pkey PRIMARY KEY (id)
);

CREATE TABLE products (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  sku text NOT NULL,
  title_it text NOT NULL,
  title_en text,
  description_it text,
  description_en text,
  price numeric(10,2),
  category_id uuid,
  image_urls jsonb DEFAULT '[]'::jsonb,
  attributes jsonb DEFAULT '{}'::jsonb,
  is_accessory boolean DEFAULT false,
  is_active boolean DEFAULT true,
  stock_quantity integer DEFAULT 0,
  box_quantity integer DEFAULT 1,
  price_tiers jsonb DEFAULT '[]'::jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT products_pkey PRIMARY KEY (id),
  CONSTRAINT products_sku_key UNIQUE (sku),
  CONSTRAINT products_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories(id)
);

CREATE TABLE collections (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_it text NOT NULL,
  slug text NOT NULL,
  image_url text,
  is_active boolean DEFAULT true,
  CONSTRAINT collections_pkey PRIMARY KEY (id),
  CONSTRAINT collections_slug_key UNIQUE (slug)
);

CREATE TABLE product_collections (
  product_id uuid NOT NULL,
  collection_id uuid NOT NULL,
  CONSTRAINT product_collections_pkey PRIMARY KEY (product_id, collection_id),
  CONSTRAINT product_collections_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  CONSTRAINT product_collections_collection_id_fkey FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
);

CREATE TABLE accessory_rules (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  accessory_id uuid,
  required_attributes jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT accessory_rules_pkey PRIMARY KEY (id)
);

CREATE TABLE product_accessory_overrides (
  product_id uuid NOT NULL,
  accessory_id uuid NOT NULL,
  action text,
  CONSTRAINT product_accessory_overrides_pkey PRIMARY KEY (product_id, accessory_id)
);

CREATE TABLE price_lists (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  name text NOT NULL,
  CONSTRAINT price_lists_pkey PRIMARY KEY (id)
);

CREATE TABLE price_list_items (
  price_list_id uuid NOT NULL,
  sku text NOT NULL,
  price numeric NOT NULL,
  CONSTRAINT price_list_items_pkey PRIMARY KEY (price_list_id, sku),
  CONSTRAINT price_list_items_price_list_id_fkey FOREIGN KEY (price_list_id) REFERENCES price_lists(id) ON DELETE CASCADE
);

CREATE TABLE profiles (
  id uuid NOT NULL,
  email text,
  role text DEFAULT 'customer'::text,
  price_list_id uuid,
  CONSTRAINT profiles_pkey PRIMARY KEY (id),
  CONSTRAINT profiles_price_list_id_fkey FOREIGN KEY (price_list_id) REFERENCES price_lists(id)
);

CREATE TABLE user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

CREATE TABLE orders (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  shipping_address jsonb NOT NULL,
  billing_details jsonb,
  status text DEFAULT 'pending_payment'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT orders_pkey PRIMARY KEY (id),
  CONSTRAINT orders_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

CREATE TABLE order_items (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL,
  product_id uuid NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  price_at_time numeric NOT NULL,
  item_type text,
  CONSTRAINT order_items_pkey PRIMARY KEY (id),
  CONSTRAINT order_items_order_id_fkey FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
  CONSTRAINT order_items_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE sample_requests (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  product_id uuid NOT NULL,
  shipping_address jsonb,
  status text DEFAULT 'pending'::text,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT sample_requests_pkey PRIMARY KEY (id),
  CONSTRAINT sample_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id),
  CONSTRAINT sample_requests_product_id_fkey FOREIGN KEY (product_id) REFERENCES products(id)
);

CREATE TABLE settings (
  key text NOT NULL,
  value text NOT NULL,
  CONSTRAINT settings_pkey PRIMARY KEY (key)
);

CREATE TABLE legal_pages (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  slug text NOT NULL,
  title_en text NOT NULL,
  title_it text NOT NULL,
  content_en text NOT NULL,
  content_it text NOT NULL,
  updated_at timestamp with time zone DEFAULT now(),
  CONSTRAINT legal_pages_pkey PRIMARY KEY (id),
  CONSTRAINT legal_pages_slug_key UNIQUE (slug)
);

CREATE TABLE attribute_options (
  id integer NOT NULL DEFAULT nextval('attribute_options_id_seq'::regclass),
  attribute_key text NOT NULL,
  value text NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT attribute_options_pkey PRIMARY KEY (id)
);

CREATE TABLE audit_logs (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  user_id uuid,
  action text,
  table_name text,
  record_id uuid,
  old_data jsonb,
  new_data jsonb,
  created_at timestamp with time zone DEFAULT now(),
  CONSTRAINT audit_logs_pkey PRIMARY KEY (id)
);

-- =============================================
-- INDEXES
-- =============================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_is_accessory ON products(is_accessory);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- =============================================
-- FUNCTIONS
-- =============================================

-- 1. Audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_func()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data)
    VALUES (auth.uid(), 'DELETE', TG_TABLE_NAME, OLD.id, to_jsonb(OLD));
    RETURN OLD;
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, old_data, new_data)
    VALUES (auth.uid(), 'UPDATE', TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW));
    RETURN NEW;
  ELSIF (TG_OP = 'INSERT') THEN
    INSERT INTO audit_logs (user_id, action, table_name, record_id, new_data)
    VALUES (auth.uid(), 'INSERT', TG_TABLE_NAME, NEW.id, to_jsonb(NEW));
    RETURN NEW;
  END IF;
  RETURN NULL;
END;
$function$;

-- 2. Handle new user (auto-create profile)
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$function$;

-- 3. Decrement stock trigger function
CREATE OR REPLACE FUNCTION decrement_stock_trigger()
RETURNS trigger
LANGUAGE plpgsql
INVOKER
AS $function$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity - NEW.quantity
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$function$;

-- 4. Get compatible accessories RPC
CREATE OR REPLACE FUNCTION get_compatible_accessories(principal_sku text)
RETURNS TABLE(sku text, title_it text, id uuid, image_urls jsonb)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    target_imboccatura TEXT;
BEGIN
    SELECT attributes->>'imboccatura' INTO target_imboccatura
    FROM public.products
    WHERE public.products.sku = principal_sku;

    RETURN QUERY
    SELECT p.sku, p.title_it, p.id, p.image_urls
    FROM public.products p
    WHERE p.is_accessory = true
    AND p.attributes->>'imboccatura' = target_imboccatura
    AND p.sku != principal_sku
    AND p.stock_quantity > 0
    LIMIT 6;
END;
$function$;

-- 5. Create order atomic RPC
CREATE OR REPLACE FUNCTION create_order_atomic(p_items jsonb, p_shipping_address jsonb)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    v_order_id uuid;
    v_user_id uuid;
    v_agg_item record;
    v_db_price numeric;
    v_stock_quantity integer;
    v_price_list_id uuid;
    v_list_price numeric;
    v_tier_price numeric;
BEGIN
    IF p_items IS NULL THEN RAISE EXCEPTION 'Payload is null'; END IF;
    IF jsonb_typeof(p_items) != 'array' THEN RAISE EXCEPTION 'Payload must be an array'; END IF;
    IF jsonb_array_length(p_items) = 0 THEN RAISE EXCEPTION 'Payload is empty'; END IF;

    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;

    INSERT INTO public.orders (user_id, shipping_address, status)
    VALUES (v_user_id, p_shipping_address, 'pending_payment')
    RETURNING id INTO v_order_id;

    SELECT price_list_id INTO v_price_list_id FROM public.profiles WHERE id = v_user_id;

    FOR v_agg_item IN 
        SELECT 
            (item->>'product_id')::uuid as pid,
            sum((item->>'quantity')::integer) as total_qty,
            count(DISTINCT (item->>'unit_price')::numeric) as price_count,
            max((item->>'unit_price')::numeric) as sent_price
        FROM jsonb_array_elements(p_items) AS item
        GROUP BY (item->>'product_id')::uuid
    LOOP
        v_db_price := NULL; v_list_price := NULL; v_tier_price := NULL;

        IF v_agg_item.price_count > 1 THEN RAISE EXCEPTION 'Inconsistent price for product %', v_agg_item.pid; END IF;
        IF v_agg_item.total_qty <= 0 THEN RAISE EXCEPTION 'Invalid quantity for product %', v_agg_item.pid; END IF;

        SELECT price INTO v_db_price FROM public.products WHERE id = v_agg_item.pid;
        IF v_db_price IS NULL THEN RAISE EXCEPTION 'Product % not found', v_agg_item.pid; END IF;

        IF v_price_list_id IS NOT NULL THEN
            SELECT pli.price INTO v_list_price
            FROM public.price_list_items pli
            JOIN public.products p ON pli.sku = p.sku
            WHERE pli.price_list_id = v_price_list_id AND p.id = v_agg_item.pid;
            IF FOUND THEN v_db_price := v_list_price; END IF;
        END IF;

        IF v_list_price IS NULL THEN
            SELECT (t->>'price')::numeric INTO v_tier_price
            FROM public.products p, 
                 jsonb_array_elements(CASE WHEN jsonb_typeof(p.price_tiers) = 'array' THEN p.price_tiers ELSE '[]'::jsonb END) t
            WHERE p.id = v_agg_item.pid
            AND (t->>'min_qty')::integer <= v_agg_item.total_qty
            ORDER BY (t->>'min_qty')::integer DESC LIMIT 1;
            IF v_tier_price IS NOT NULL THEN v_db_price := v_tier_price; END IF;
        END IF;

        IF v_db_price IS NULL OR abs(v_agg_item.sent_price - v_db_price) > 0.01 THEN
            RAISE EXCEPTION 'Price manipulation detected for product %', v_agg_item.pid;
        END IF;

        SELECT stock_quantity INTO v_stock_quantity
        FROM public.products WHERE id = v_agg_item.pid FOR NO KEY UPDATE;

        IF v_stock_quantity IS NULL OR v_stock_quantity < v_agg_item.total_qty THEN
            RAISE EXCEPTION 'Insufficient stock for product %', v_agg_item.pid;
        END IF;

        UPDATE public.products SET stock_quantity = stock_quantity - v_agg_item.total_qty WHERE id = v_agg_item.pid;
        INSERT INTO public.order_items (order_id, product_id, quantity, price_at_time)
        VALUES (v_order_id, v_agg_item.pid, v_agg_item.total_qty, v_db_price);
    END LOOP;

    RETURN v_order_id;
END;
$function$;

-- 6. Duplicate price list RPC
CREATE OR REPLACE FUNCTION duplicate_price_list(source_id uuid, new_name text)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    new_id UUID;
BEGIN
    INSERT INTO public.price_lists (name) VALUES (new_name) RETURNING id INTO new_id;
    INSERT INTO public.price_list_items (price_list_id, sku, price)
    SELECT new_id, sku, price FROM public.price_list_items WHERE price_list_id = source_id;
    RETURN new_id;
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Errore durante la duplicazione del listino: %', SQLERRM;
END;
$function$;

-- 7. RLS auto-enable event trigger
CREATE OR REPLACE FUNCTION rls_auto_enable()
RETURNS event_trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     END IF;
  END LOOP;
END;
$function$;

-- =============================================
-- TRIGGERS
-- =============================================

-- Audit triggers
CREATE TRIGGER audit_categories
  AFTER INSERT OR UPDATE OR DELETE ON categories
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_collections
  AFTER INSERT OR UPDATE OR DELETE ON collections
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

CREATE TRIGGER audit_products
  AFTER INSERT OR UPDATE OR DELETE ON products
  FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();

-- Auto-create profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Decrement stock on order item insert
CREATE TRIGGER decrement_stock_on_order
  AFTER INSERT ON order_items
  FOR EACH ROW EXECUTE FUNCTION decrement_stock_trigger();

-- Send order email on status change
CREATE TRIGGER send-order-email-trigger
  AFTER UPDATE ON orders
  FOR EACH ROW
  WHEN (NEW.status = 'confirmed')
  EXECUTE FUNCTION supabase_functions.http_request(
    'https://vsqzxudijllpocrbqfbo.supabase.co/functions/v1/send-order-email',
    'POST',
    '{"Content-type":"application/json","Authorization":"Bearer SERVICE_ROLE_KEY"}',
    '{}',
    '5000'
  );

-- =============================================
-- ROW LEVEL SECURITY POLICIES
-- =============================================

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessory_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_accessory_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE sample_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Products
CREATE POLICY "Public Read Products" ON products FOR SELECT USING (true);

-- Collections
CREATE POLICY "Public Read Collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Allow update for admins" ON collections FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Product Collections
CREATE POLICY "Public Read ProductCollections" ON product_collections FOR SELECT USING (true);

-- Product Accessory Overrides
CREATE POLICY "Public Read Accessory Overrides" ON product_accessory_overrides FOR SELECT USING (true);

-- Legal Pages
CREATE POLICY "Allow public read access" ON legal_pages FOR SELECT USING (true);

-- Profiles
CREATE POLICY "Public Read Profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Allow admin/ceo to update profiles" ON profiles FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'ceo')))
  WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'ceo')));
CREATE POLICY "Admins can delete profiles" ON profiles FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'ceo')));

-- User Roles
CREATE POLICY "Allow read for authenticated users" ON user_roles FOR SELECT
  TO authenticated USING (true);

-- Orders
CREATE POLICY "Users can read own orders" ON orders FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders" ON orders FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own orders" ON orders FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can read all orders" ON orders FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Order Items
CREATE POLICY "Users can read own order items" ON order_items FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));
CREATE POLICY "Users can create order items" ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Sample Requests
CREATE POLICY "Users can read own requests" ON sample_requests FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can create requests" ON sample_requests FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage all requests" ON sample_requests FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Settings
CREATE POLICY "Allow read for admins" ON settings FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));
CREATE POLICY "Allow update for admins" ON settings FOR UPDATE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin'));

-- Price Lists
CREATE POLICY "Allow read for authenticated users" ON price_lists FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "Allow admin/ceo to manage price_lists" ON price_lists FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'ceo')))
  WITH CHECK (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'ceo')));

-- Price List Items
CREATE POLICY "Allow read for authenticated users" ON price_list_items FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "Allow admin/ceo to manage price_list_items" ON price_list_items FOR ALL
  TO authenticated
  USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role IN ('admin', 'ceo')));

-- Attribute Options
CREATE POLICY "Allow read for authenticated users" ON attribute_options FOR SELECT
  TO authenticated USING (true);
CREATE POLICY "Allow write for authenticated users" ON attribute_options FOR ALL
  TO authenticated USING (true);

-- =============================================
-- END OF SCHEMA BACKUP
-- =============================================
