TRUNCATE TABLE user_roles;
INSERT INTO user_roles (id, user_id, role, created_at) VALUES ('cc339138-a51d-48d6-a6ea-b0ca044db8b0', 'ecb0d6ad-8d5b-4c7c-875f-6be1ef6b02dd', 'admin', '2026-06-18T09:40:46.668034+00:00');
SELECT 'user_roles' as table_name, COUNT(*) as rows_inserted FROM user_roles;
