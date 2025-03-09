const db = require('../config/db');

class Order {
  static async getByUserId(userId) {
    const [rows] = await db.query(
      `SELECT o.id, o.order_date, o.total_price, 
       b.id as book_id, b.title, b.author, b.price 
       FROM orders o 
       JOIN order_items oi ON o.id = oi.order_id 
       JOIN books b ON oi.book_id = b.id 
       WHERE o.user_id = ?`, 
      [userId]
    );
    
    return this.groupOrderItems(rows);
  }

  static async create(userId, items) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 创建订单
      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, order_date, total_price) VALUES (?, NOW(), ?)',
        [userId, this.calculateTotal(items)]
      );
      
      const orderId = orderResult.insertId;
      
      // 添加订单项
      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, book_id, quantity) VALUES (?, ?, ?)',
          [orderId, item.bookId, item.quantity]
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

  static calculateTotal(items) {
    // 实际实现时需要从数据库获取实际价格
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  static groupOrderItems(rows) {
    const orders = {};
    
    rows.forEach(row => {
      if (!orders[row.id]) {
        orders[row.id] = {
          id: row.id,
          orderDate: row.order_date,
          totalPrice: row.total_price,
          items: []
        };
      }
      
      orders[row.id].items.push({
        bookId: row.book_id,
        title: row.title,
        author: row.author,
        price: row.price
      });
    });
    
    return Object.values(orders);
  }
}

module.exports = Order; 