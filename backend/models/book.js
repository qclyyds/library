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
}

module.exports = Book; 