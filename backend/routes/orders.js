const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.get('/', auth, orderController.getUserOrders);
router.post('/', auth, orderController.createOrder);
router.post('/:orderId/cancel', auth, orderController.cancelOrder);

module.exports = router; 