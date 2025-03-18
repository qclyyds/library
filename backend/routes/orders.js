const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

// 获取用户的所有借阅记录
router.get('/', auth, orderController.getUserOrders);

// 获取用户当前借阅的图书
router.get('/current', auth, orderController.getCurrentBorrowings);

// 创建借阅记录
router.post('/', auth, orderController.createOrder);

// 归还图书
router.post('/:orderId/cancel', auth, orderController.cancelOrder);

module.exports = router; 