-- 删除价格和库存字段
ALTER TABLE books
DROP COLUMN price,
DROP COLUMN stock;

-- 添加新字段
ALTER TABLE books
ADD COLUMN isbn VARCHAR(20) AFTER description,
ADD COLUMN publisher VARCHAR(100) AFTER isbn,
ADD COLUMN location VARCHAR(100) AFTER publisher;

-- 添加注释
ALTER TABLE books
MODIFY COLUMN isbn VARCHAR(20) COMMENT 'ISBN号',
MODIFY COLUMN publisher VARCHAR(100) COMMENT '出版商',
MODIFY COLUMN location VARCHAR(100) COMMENT '图书位置';

-- 更新现有记录
UPDATE books SET isbn = NULL WHERE isbn = '';
UPDATE books SET publisher = NULL WHERE publisher = '';
UPDATE books SET location = NULL WHERE location = '';