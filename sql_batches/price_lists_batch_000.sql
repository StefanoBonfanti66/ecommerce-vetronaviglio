TRUNCATE TABLE price_lists;
INSERT INTO price_lists (id, name, discount_percentage) VALUES ('d5e7baaa-796f-421f-990b-1e2568ab8777', 'Vetronaviglio', 0);
SELECT 'price_lists' as table_name, COUNT(*) as rows_inserted FROM price_lists;
