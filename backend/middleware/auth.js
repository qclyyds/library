const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    // 从请求头获取令牌
    const token = req.headers.authorization.split(' ')[1];
    
    // 验证令牌
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    
    next();
  } catch (error) {
    return res.status(401).json({ message: '认证失败' });
  }
}; 