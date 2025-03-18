const Order = require('../models/order');

// 获取用户的所有借阅记录
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.getByUserId(userId);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: '获取借阅记录失败', error: error.message });
  }
};

// 创建借阅记录
exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: '请选择要借阅的图书' });
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
      message: '借阅成功', 
      orderId 
    });
  } catch (error) {
    res.status(500).json({ message: '借阅失败', error: error.message });
  }
};

// 取消借阅
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const orderId = req.params.orderId;
    
    const order = await Order.getById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: '借阅记录不存在' });
    }
    
    if (parseInt(order.user_id) !== parseInt(userId)) {
      return res.status(403).json({ message: '无权操作此借阅记录' });
    }
    
    await Order.cancel(orderId);
    
    res.json({ message: '已成功归还图书' });
  } catch (error) {
    console.error('归还图书时发生错误:', error);
    res.status(500).json({ 
      message: '归还图书失败', 
      error: error.message 
    });
  }
};

// 获取当前借阅的图书
exports.getCurrentBorrowings = async (req, res) => {
  try {
    const userId = req.userId;
    const borrowings = await Order.getCurrentBorrowings(userId);
    res.json(borrowings);
  } catch (error) {
    res.status(500).json({ 
      message: '获取当前借阅记录失败', 
      error: error.message 
    });
  }
}; 