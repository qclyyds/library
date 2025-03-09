const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

router.get('/', bookController.getAllBooks);
router.get('/featured', bookController.getFeaturedBooks);
router.get('/:id', bookController.getBookById);

module.exports = router; 