const db = require('../config/db');

class Order {
  static async getByUserId(userId) {
    const [rows] = await db.query(
      `SELECT o.id, o.order_date, o.total_price,
       b.id as book_id, b.title, b.author, b.price 
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

  static async getById(orderId) {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [orderId]
    );
    return rows[0];
  }

  static async cancel(orderId) {
    const connection = await db.getConnection();
    
    try {
      await connection.beginTransaction();
      
      // 检查订单是否存在
      const [orderCheck] = await connection.query(
        'SELECT id FROM orders WHERE id = ?',
        [orderId]
      );
      
      if (orderCheck.length === 0) {
        throw new Error('订单不存在');
      }
      
      // 先删除订单项
      await connection.query(
        'DELETE FROM order_items WHERE order_id = ?',
        [orderId]
      );
      
      // 再删除订单
      const [deleteResult] = await connection.query(
        'DELETE FROM orders WHERE id = ?',
        [orderId]
      );
      
      if (deleteResult.affectedRows === 0) {
        throw new Error('订单删除失败');
      }
      
      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }
}

module.exports = Order; 