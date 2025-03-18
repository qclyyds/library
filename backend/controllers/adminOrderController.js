const Order = require('../models/order');

// 获取所有借阅记录
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: '获取借阅记录失败', error: error.message });
  }
};

// 获取单个借阅记录详情
exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.getById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: '借阅记录不存在' });
    }
    
    // 获取借阅项
    const orderItems = await Order.getOrderItems(orderId);
    
    res.json({
      ...order,
      items: orderItems
    });
  } catch (error) {
    res.status(500).json({ message: '获取借阅记录失败', error: error.message });
  }
};

// 创建借阅记录
exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;
    
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: '请提供有效的借阅信息' });
    }

    // 检查每本书是否可借
    for (const item of items) {
      const isAvailable = await Order.isBookAvailable(item.bookId);
      if (!isAvailable) {
        return res.status(400).json({ 
          message: '部分图书已被借出，请重新选择',
          bookId: item.bookId
        });
      }
    }
    
    const orderId = await Order.create(userId, items);
    
    res.status(201).json({ 
      message: '借阅记录创建成功', 
      orderId 
    });
  } catch (error) {
    res.status(500).json({ message: '创建借阅记录失败', error: error.message });
  }
};

// 更新借阅记录
exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { items } = req.body;
    
    const order = await Order.getById(orderId);
    if (!order) {
      return res.status(404).json({ message: '借阅记录不存在' });
    }
    
    if (items && (!Array.isArray(items) || items.length === 0)) {
      return res.status(400).json({ message: '请提供有效的借阅项' });
    }
    
    await Order.update(orderId, items);
    
    res.json({ message: '借阅记录更新成功' });
  } catch (error) {
    res.status(500).json({ message: '更新借阅记录失败', error: error.message });
  }
};

// 取消借阅
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    const order = await Order.getById(orderId);
    if (!order) {
      return res.status(404).json({ message: '借阅记录不存在' });
    }
    
    await Order.cancel(orderId);
    
    res.json({ message: '已成功归还图书' });
  } catch (error) {
    res.status(500).json({ message: '归还图书失败', error: error.message });
  }
}; 