TRUNCATE TABLE settings;
INSERT INTO settings (key, value) VALUES ('order_notification_email', 'sbonfanti@hotmail.com');
INSERT INTO settings (key, value) VALUES ('min_order_amount', '250');
INSERT INTO settings (key, value) VALUES ('max_items_per_order', '3000');
INSERT INTO settings (key, value) VALUES ('shipping_notes', 'Consegna in modalità ex-works. Ritiro presso Vetronaviglio.');
INSERT INTO settings (key, value) VALUES ('shipping_notes_en', 'Ex-works shipment. Pickup at Vetronaviglio.');
SELECT 'settings' as table_name, COUNT(*) as rows_inserted FROM settings;
