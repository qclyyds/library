const User = require('../models/user');

// 获取所有用户
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: '获取用户列表失败', error: error.message });
  }
};

// 获取单个用户
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.getById(userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 不返回密码等敏感信息
    delete user.password;
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: '获取用户信息失败', error: error.message });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    
    // 不允许删除管理员
    const user = await User.getById(userId);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: '不能删除管理员账户' });
    }
    
    await User.delete(userId);
    
    res.json({ message: '用户删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除用户失败', error: error.message });
  }
}; 