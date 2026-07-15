TRUNCATE TABLE price_list_items;
INSERT INTO price_list_items (price_list_id, sku, price) VALUES ('d5e7baaa-796f-421f-990b-1e2568ab8777', 'AC003.0002', 0.5);
SELECT 'price_list_items' as table_name, COUNT(*) as rows_inserted FROM price_list_items;
