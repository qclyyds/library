-- 更新orders表结构
ALTER TABLE orders
DROP COLUMN total_price;

-- 更新order_items表结构
ALTER TABLE order_items
ALTER COLUMN quantity SET DEFAULT 1;

-- 添加借阅日期和归还日期
ALTER TABLE orders
ADD COLUMN due_date DATE AFTER order_date,
ADD COLUMN return_date DATE AFTER cancel_date;

-- 添加注释
ALTER TABLE orders
MODIFY COLUMN order_date DATETIME COMMENT '借阅日期',
MODIFY COLUMN due_date DATE COMMENT '应还日期',
MODIFY COLUMN cancel_date DATETIME COMMENT '取消借阅日期',
MODIFY COLUMN return_date DATE COMMENT '实际归还日期';

-- 更新现有数据
UPDATE orders SET due_date = DATE_ADD(order_date, INTERVAL 30 DAY) WHERE due_date IS NULL;

-- 创建借阅状态视图
CREATE OR REPLACE VIEW vw_borrowing_status AS
SELECT 
    o.id as order_id,
    o.user_id,
    u.username,
    b.id as book_id,
    b.title,
    b.author,
    b.isbn,
    b.location,
    o.order_date as borrow_date,
    o.due_date,
    o.cancel_date,
    o.return_date,
    CASE 
        WHEN o.return_date IS NOT NULL THEN '已归还'
        WHEN o.cancel_date IS NOT NULL THEN '已取消'
        WHEN o.due_date < CURDATE() THEN '已逾期'
        ELSE '借阅中'
    END as status
FROM orders o
JOIN users u ON o.user_id = u.id
JOIN order_items oi ON o.id = oi.order_id
JOIN books b ON oi.book_id = b.id;

-- 删除不再需要的字段
ALTER TABLE orders
DROP COLUMN cancel_date,
DROP COLUMN return_date;

-- 更新现有记录的到期日期
UPDATE orders
SET due_date = DATE_ADD(order_date, INTERVAL 30 DAY)
WHERE due_date IS NULL;

-- 更新图书信息
UPDATE books SET 
isbn = '9787536692930',
publisher = '重庆出版社',
location = 'A-01-01'
WHERE id = 2;

UPDATE books SET 
isbn = '9787229030933',
publisher = '重庆出版社',
location = 'A-01-02'
WHERE id = 3;

UPDATE books SET 
isbn = '9787544766500',
publisher = '译林出版社',
location = 'A-01-03'
WHERE id = 4;

UPDATE books SET 
isbn = '9787115275790',
publisher = '人民邮电出版社',
location = 'B-01-01'
WHERE id = 5;

UPDATE books SET 
isbn = '9787111544937',
publisher = '机械工业出版社',
location = 'B-01-02'
WHERE id = 6;

UPDATE books SET 
isbn = '9787111407010',
publisher = '机械工业出版社',
location = 'B-01-03'
WHERE id = 7;

UPDATE books SET 
isbn = '9787115469335',
publisher = '人民邮电出版社',
location = 'B-02-01'
WHERE id = 8;

UPDATE books SET 
isbn = '9787544291170',
publisher = '南海出版公司',
location = 'C-01-01'
WHERE id = 10;

UPDATE books SET 
isbn = '9787508663289',
publisher = '中信出版社',
location = 'D-01-01'
WHERE id = 11;

UPDATE books SET 
isbn = '9787508095226',
publisher = '华夏出版社',
location = 'E-01-01'
WHERE id = 12;

UPDATE books SET 
isbn = '9787508684031',
publisher = '中信出版社',
location = 'E-01-02'
WHERE id = 13;

UPDATE books SET 
isbn = '9787115519337',
publisher = '人民邮电出版社',
location = 'E-01-03'
WHERE id = 14;

UPDATE books SET 
isbn = '9787559614636',
publisher = '北京联合出版公司',
location = 'F-01-01'
WHERE id = 15;

UPDATE books SET 
isbn = '9787544276177',
publisher = '南海出版公司',
location = 'F-01-02'
WHERE id = 16;

UPDATE books SET 
isbn = '9787549550173',
publisher = '广西师范大学出版社',
location = 'F-01-03'
WHERE id = 17;

UPDATE books SET 
isbn = '9787508689586',
publisher = '中信出版社',
location = 'E-02-01'
WHERE id = 18;

UPDATE books SET 
isbn = '9787508699233',
publisher = '中信出版社',
location = 'E-02-02'
WHERE id = 19;

UPDATE books SET 
isbn = '9787508660752',
publisher = '中信出版社',
location = 'F-02-01'
WHERE id = 20;

UPDATE books SET 
isbn = '9787544775939',
publisher = '译林出版社',
location = 'F-02-02'
WHERE id = 21;

UPDATE books SET 
isbn = '9787020002207',
publisher = '人民文学出版社',
location = 'F-02-03'
WHERE id = 22;

UPDATE books SET 
isbn = '9787020090006',
publisher = '人民文学出版社',
location = 'F-03-01'
WHERE id = 23;

UPDATE books SET 
isbn = '9787544766869',
publisher = '译林出版社',
location = 'F-03-02'
WHERE id = 24;

UPDATE books SET 
isbn = '9787544291224',
publisher = '南海出版公司',
location = 'F-03-03'
WHERE id = 25;

UPDATE books SET 
isbn = '9787544281102',
publisher = '南海出版公司',
location = 'G-01-01'
WHERE id = 26;

UPDATE books SET 
isbn = '9787544280662',
publisher = '南海出版公司',
location = 'G-01-02'
WHERE id = 27;

UPDATE books SET 
isbn = '9787544298995',
publisher = '南海出版公司',
location = 'G-01-03'
WHERE id = 28;

UPDATE books SET 
isbn = '9787229030940',
publisher = '重庆出版社',
location = 'A-01-04'
WHERE id = 29; 