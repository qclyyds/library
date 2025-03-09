const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config();

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'library_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 转换为Promise方式使用
const promisePool = pool.promise();

module.exports = promisePool; 