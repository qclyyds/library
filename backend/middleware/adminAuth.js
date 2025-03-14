const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    // 获取请求头中的授权令牌
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: '未提供授权令牌' });
    }

    // 提取令牌
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: '令牌格式不正确' });
    }

    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // 确认用户存在
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ message: '用户不存在' });
    }
    
    // 确认用户具有管理员权限
    if (user.role !== 'admin') {
      return res.status(403).json({ message: '需要管理员权限' });
    }
    
    // 将用户对象添加到请求中
    req.user = user;
    next();
  } catch (error) {
    console.error('管理员授权错误:', error);
    res.status(401).json({ message: '授权验证失败' });
  }
}; 