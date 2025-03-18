const db = require('../config/db');

class Order {
  static async getByUserId(userId) {
    const [rows] = await db.query(
      `SELECT o.id, o.order_date, o.due_date,
       b.id as book_id, b.title, b.author, b.isbn, b.publisher, b.location,
       CASE 
         WHEN o.due_date < CURDATE() THEN '已逾期'
         ELSE '借阅中'
       END as status
       FROM orders o 
       JOIN order_items oi ON o.id = oi.order_id 
       JOIN books b ON oi.book_id = b.id 
       WHERE o.user_id = ?
       ORDER BY o.order_date DESC`, 
      [userId]
    );
    
    return this.groupOrderItems(rows);
  }

  static async create(userId, items) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 创建借阅记录，设置30天的借阅期限
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, order_date, due_date) VALUES (?, NOW(), DATE_ADD(NOW(), INTERVAL 30 DAY))',
        [userId]
      );
      
      const orderId = orderResult.insertId;
      
      // 添加借阅项
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, book_id, quantity) VALUES (?, ?, 1)',
          [orderId, item.bookId]
        );
      }
      
      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static groupOrderItems(rows) {
    const orders = {};
    
    rows.forEach(row => {
      if (!orders[row.id]) {
        orders[row.id] = {
          id: row.id,
          orderDate: row.order_date,
          dueDate: row.due_date,
          status: row.status,
          items: []
        };
      }
      
      orders[row.id].items.push({
        bookId: row.book_id,
        title: row.title,
        author: row.author,
        isbn: row.isbn,
        publisher: row.publisher,
        location: row.location
      });
    });
    
    return Object.values(orders);
  }

  static async getById(orderId) {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );
    return rows[0];
  }

  // 取消借阅
  static async cancel(orderId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 检查订单是否存在
      const [order] = await connection.query(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );
      
      if (!order || order.length === 0) {
        throw new Error('借阅记录不存在');
      }
      
      // 删除订单项
      await connection.query(
        'DELETE FROM order_items WHERE order_id = ?',
        [orderId]
      );
      
      // 删除订单
      await connection.query(
        'DELETE FROM orders WHERE id = ?',
        [orderId]
      );
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // 归还图书
  static async returnBooks(orderId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 检查订单是否存在
      const [order] = await connection.query(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );
      
      if (!order || order.length === 0) {
        throw new Error('借阅记录不存在');
      }
      
      // 删除订单项
      await connection.query(
        'DELETE FROM order_items WHERE order_id = ?',
        [orderId]
      );
      
      // 删除订单
      await connection.query(
        'DELETE FROM orders WHERE id = ?',
        [orderId]
      );
      
      await connection.commit();
      return true;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // 获取用户当前借阅的图书
  static async getCurrentBorrowings(userId) {
    const [rows] = await db.query(
      `SELECT o.id as order_id, o.order_date, o.due_date,
       b.id as book_id, b.title, b.author, b.isbn, b.publisher, b.location,
       CASE 
         WHEN o.due_date < CURDATE() THEN '已逾期'
         ELSE '借阅中'
       END as status,
       DATEDIFF(o.due_date, CURDATE()) as days_remaining
       FROM orders o 
       JOIN order_items oi ON o.id = oi.order_id 
       JOIN books b ON oi.book_id = b.id 
       WHERE o.user_id = ? 
       ORDER BY o.due_date ASC`,
      [userId]
    );
    return rows;
  }

  // 获取所有借阅记录（管理员用）
  static async getAll() {
    const [rows] = await db.query(
      `SELECT 
         o.id, o.order_date, o.due_date,
         u.username, u.email,
         b.title, b.author, b.isbn, b.location,
         CASE 
           WHEN o.due_date < CURDATE() THEN '已逾期'
           ELSE '借阅中'
         END as status
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN order_items oi ON o.id = oi.order_id
       JOIN books b ON oi.book_id = b.id
       ORDER BY o.order_date DESC`
    );
    return rows;
  }

  // 检查图书是否可借
  static async isBookAvailable(bookId) {
    const [rows] = await db.query(
      `SELECT COUNT(*) as borrowCount 
       FROM orders o 
       JOIN order_items oi ON o.id = oi.order_id 
       WHERE oi.book_id = ?`,
      [bookId]
    );
    return rows[0].borrowCount === 0;
  }

  // 获取逾期未还的借阅记录
  static async getOverdueBooks() {
    const [rows] = await db.query(
      `SELECT 
         o.id, o.order_date, o.due_date,
         u.username, u.email,
         b.title, b.author, b.isbn, b.location,
         DATEDIFF(CURDATE(), o.due_date) as days_overdue
       FROM orders o
       JOIN users u ON o.user_id = u.id
       JOIN order_items oi ON o.id = oi.order_id
       JOIN books b ON oi.book_id = b.id
       WHERE o.due_date < CURDATE()
       ORDER BY o.due_date ASC`
    );
    return rows;
  }
}

module.exports = Order; 