const Order = require('../models/order');

// 获取所有订单
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAll();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: '获取订单失败', error: error.message });
  }
};

// 获取单个订单详情
exports.getOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.getById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    // 获取订单项
    const orderItems = await Order.getOrderItems(orderId);
    
    res.json({
      ...order,
      items: orderItems
    });
  } catch (error) {
    res.status(500).json({ message: '获取订单失败', error: error.message });
  }
};

// 创建订单
exports.createOrder = async (req, res) => {
  try {
    const { userId, items } = req.body;
    
    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: '请提供有效的订单信息' });
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

// 更新订单
exports.updateOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const { items } = req.body;
    
    const order = await Order.getById(orderId);
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    if (items && (!Array.isArray(items) || items.length === 0)) {
      return res.status(400).json({ message: '请提供有效的订单项' });
    }
    
    await Order.update(orderId, items);
    
    res.json({ message: '订单更新成功' });
  } catch (error) {
    res.status(500).json({ message: '更新订单失败', error: error.message });
  }
};

// 删除订单
exports.deleteOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    
    const order = await Order.getById(orderId);
    if (!order) {
      return res.status(404).json({ message: '订单不存在' });
    }
    
    await Order.cancel(orderId);
    
    res.json({ message: '订单删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除订单失败', error: error.message });
  }
}; 