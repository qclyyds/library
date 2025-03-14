

-- 添加 role 字段到 users 表
ALTER TABLE users
ADD COLUMN role ENUM('user', 'admin') NOT NULL DEFAULT 'user' AFTER password;

-- 更新现有用户的角色为普通用户
UPDATE users SET role = 'user' WHERE role IS NULL; 