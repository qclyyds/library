const User = require('../models/user');
const bcrypt = require('bcryptjs');

// 获取所有用户
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error('获取用户列表错误:', error);
    res.status(500).json({ message: '获取用户列表失败' });
  }
};

// 获取单个用户
exports.getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 不返回密码等敏感信息
    delete user.password;
    
    res.json(user);
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ message: '获取用户信息失败' });
  }
};

// 创建新用户
exports.createUser = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // 验证必填字段
    if (!username || !email || !password) {
      return res.status(400).json({ message: '用户名、邮箱和密码为必填项' });
    }

    // 检查用户名是否已存在
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: '用户名已存在' });
    }

    // 检查邮箱是否已存在
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: '邮箱已被使用' });
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10);

    // 创建用户
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role: role || 'user'
    });

    // 移除密码后返回用户信息
    const userResponse = { ...user };
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (error) {
    console.error('创建用户错误:', error);
    res.status(500).json({ message: '创建用户失败' });
  }
};

// 更新用户
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, role } = req.body;

    // 验证用户是否存在
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 如果更新用户名，检查是否已存在
    if (username && username !== user.username) {
      const existingUser = await User.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: '用户名已存在' });
      }
    }

    // 如果更新邮箱，检查是否已存在
    if (email && email !== user.email) {
      const existingEmail = await User.findByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: '邮箱已被使用' });
      }
    }

    // 准备更新数据
    const updateData = {
      username: username || user.username,
      email: email || user.email,
      role: role || user.role
    };

    // 如果提供了新密码，则更新密码
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    // 更新用户
    await User.update(id, updateData);

    // 获取更新后的用户信息
    const updatedUser = await User.findById(id);
    delete updatedUser.password;

    res.json(updatedUser);
  } catch (error) {
    console.error('更新用户错误:', error);
    res.status(500).json({ message: '更新用户失败' });
  }
};

// 删除用户
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // 验证用户是否存在
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }

    // 不允许删除管理员用户
    if (user.role === 'admin') {
      return res.status(403).json({ message: '不能删除管理员用户' });
    }

    // 删除用户
    await User.delete(id);

    res.json({ message: '用户删除成功' });
  } catch (error) {
    console.error('删除用户错误:', error);
    res.status(500).json({ message: '删除用户失败' });
  }
}; 