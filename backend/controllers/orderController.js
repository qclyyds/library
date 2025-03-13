const Order = require('../models/order');

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
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

exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const orderId = req.params.orderId;
    
    const order = await Order.getById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    if (parseInt(order.user_id) !== parseInt(userId)) {
      return res.status(403).json({ message: '无权操作此订单' });
    }
    
    await Order.cancel(orderId);
    
    res.json({ message: '订单删除成功' });
  } catch (error) {
    console.error('删除订单时发生错误:', error);
    res.status(500).json({ 
      message: '删除订单失败', 
      error: error.message 
    });
  }
}; 