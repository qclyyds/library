const express = require('express');
const router = express.Router();
const adminBookController = require('../controllers/adminBookController');
const adminUserController = require('../controllers/adminUserController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

// 图书管理路由
router.get('/books', authenticateToken, isAdmin, adminBookController.getAllBooks);
router.post('/books', authenticateToken, isAdmin, adminBookController.createBook);
router.put('/books/:id', authenticateToken, isAdmin, adminBookController.updateBook);
router.delete('/books/:id', authenticateToken, isAdmin, adminBookController.deleteBook);

// 用户管理路由
router.get('/users', authenticateToken, isAdmin, adminUserController.getAllUsers);
router.post('/users', authenticateToken, isAdmin, adminUserController.createUser);
router.put('/users/:id', authenticateToken, isAdmin, adminUserController.updateUser);
router.delete('/users/:id', authenticateToken, isAdmin, adminUserController.deleteUser);

module.exports = router; 