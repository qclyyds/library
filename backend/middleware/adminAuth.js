const jwt = require('jsonwebtoken');
const db = require('../config/db');

module.exports = async (req, res, next) => {
  try {
    // 获取token
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: '未授权，请先登录' });
    }
    
    // 验证token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    // 检查用户是否是管理员
    const [rows] = await db.query(
      'SELECT role FROM users WHERE id = ?',
      [req.userId]
    );
    
    if (rows.length === 0) {
      return res.status(401).json({ message: '用户不存在' });
    }
    
    if (rows[0].role !== 'admin') {
      return res.status(403).json({ message: '无权访问管理员功能' });
    }
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: '无效的令牌' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: '令牌已过期' });
    }
    res.status(500).json({ message: '服务器错误', error: error.message });
  }
}; 