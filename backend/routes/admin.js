const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const adminBookController = require('../controllers/adminBookController');
const adminOrderController = require('../controllers/adminOrderController');
const adminUserController = require('../controllers/adminUserController');
const upload = require('../middleware/upload');

// 图书管理路由
router.get('/books', adminAuth, adminBookController.getAllBooks);
router.get('/books/:id', adminAuth, adminBookController.getBook);
router.post('/books', adminAuth, upload.single('cover_image'), adminBookController.addBook);
router.put('/books/:id', adminAuth, upload.single('cover_image'), adminBookController.updateBook);
router.delete('/books/:id', adminAuth, adminBookController.deleteBook);
router.patch('/books/:id/featured', adminAuth, adminBookController.updateFeaturedStatus);

// 借阅管理路由
router.get('/orders', adminAuth, adminOrderController.getAllOrders);
router.get('/orders/:id', adminAuth, adminOrderController.getOrder);
router.post('/orders', adminAuth, adminOrderController.createOrder);
router.put('/orders/:id', adminAuth, adminOrderController.updateOrder);
router.delete('/orders/:id', adminAuth, adminOrderController.deleteOrder);

// 用户管理路由
router.get('/users', adminAuth, adminUserController.getAllUsers);
router.get('/users/:id', adminAuth, adminUserController.getUser);
router.post('/users', adminAuth, adminUserController.createUser);
router.put('/users/:id', adminAuth, adminUserController.updateUser);
router.delete('/users/:id', adminAuth, adminUserController.deleteUser);

module.exports = router; 