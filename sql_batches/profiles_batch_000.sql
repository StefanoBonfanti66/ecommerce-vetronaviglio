TRUNCATE TABLE profiles;
INSERT INTO profiles (id, email, role, price_list_id) VALUES ('ecb0d6ad-8d5b-4c7c-875f-6be1ef6b02dd', 's.bonfanti@vetronaviglio.it', 'admin', NULL);
INSERT INTO profiles (id, email, role, price_list_id) VALUES ('7f9d580e-423a-4ebf-9777-ac8cd41d6633', 'sbonfanti@hotmail.com', 'customer', NULL);
INSERT INTO profiles (id, email, role, price_list_id) VALUES ('90968f2d-ef92-480b-8cf6-803c110e59b4', 'b.solitodesolis@vetronaviglio.it', 'ceo', NULL);
INSERT INTO profiles (id, email, role, price_list_id) VALUES ('fffefaf1-a2b9-4d43-869b-c1ec7fec1d4b', 'f.rosi@vetronaviglio.it', 'ceo', NULL);
SELECT 'profiles' as table_name, COUNT(*) as rows_inserted FROM profiles;
