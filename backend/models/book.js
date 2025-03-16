const db = require('../config/db');

class Book {
  static async getAll(filters = {}) {
    let query = 'SELECT * FROM books WHERE 1=1';
    const params = [];

    if (filters.category) {
      query += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters.title) {
      query += ' AND title LIKE ?';
      params.push(`%${filters.title}%`);
    }

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async getById(id) {
    const [rows] = await db.query('SELECT * FROM books WHERE id = ?', [id]);
    return rows[0];
  }

  static async getFeatured() {
    const [rows] = await db.query('SELECT * FROM books WHERE featured = 1 LIMIT 10');
    return rows;
  }
  
  static async create(bookData) {
    const { title, author, description, price, stock, category, cover_image, featured } = bookData;
    
    const [result] = await db.query(
      'INSERT INTO books (title, author, description, price, stock, category, cover_image, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [title, author, description, price, stock, category || null, cover_image || null, featured ? 1 : 0]
    );
    
    return result.insertId;
  }
  
  static async update(id, bookData) {
    const { title, author, description, price, stock, category, cover_image, featured } = bookData;
    
    // 构建更新语句
    let query = 'UPDATE books SET ';
    const params = [];
    const updateFields = [];
    
    if (title !== undefined) {
      updateFields.push('title = ?');
      params.push(title);
    }
    
    if (author !== undefined) {
      updateFields.push('author = ?');
      params.push(author);
    }
    
    if (description !== undefined) {
      updateFields.push('description = ?');
      params.push(description);
    }
    
    if (price !== undefined) {
      updateFields.push('price = ?');
      params.push(price);
    }
    
    if (stock !== undefined) {
      updateFields.push('stock = ?');
      params.push(stock);
    }
    
    if (category !== undefined) {
      updateFields.push('category = ?');
      params.push(category);
    }
    
    if (cover_image !== undefined) {
      updateFields.push('cover_image = ?');
      params.push(cover_image);
    }
    
    if (featured !== undefined) {
      updateFields.push('featured = ?');
      params.push(featured ? 1 : 0);
    }
    
    // 如果没有要更新的字段，则返回
    if (updateFields.length === 0) {
      return true;
    }
    
    query += updateFields.join(', ') + ' WHERE id = ?';
    params.push(id);
    
    await db.query(query, params);
    return true;
  }
  
  static async delete(id) {
    await db.query('DELETE FROM books WHERE id = ?', [id]);
    return true;
  }

  // 专门更新图书的推荐状态
  static async updateFeatured(id, featured) {
    await db.query('UPDATE books SET featured = ? WHERE id = ?', [featured ? 1 : 0, id]);
    return true;
  }
}

module.exports = Book; 