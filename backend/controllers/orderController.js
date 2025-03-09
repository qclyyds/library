const Order = require('../models/order');

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId; // 从认证中间件获取
    const orders = await Order.getByUserId(userId);
    
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: '获取订单失败', error: error.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const userId = req.userId; // 从认证中间件获取
    const { items } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: '订单项不能为空' });
    }
    
    const orderId = await Order.create(userId, items);
    
    res.status(201).json({ 
      message: '订单创建成功', 
      orderId 
    });
  } catch (error) {
    res.status(500).json({ message: '创建订单失败', error: error.message });
  }
}; 