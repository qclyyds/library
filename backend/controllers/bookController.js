const Book = require('../models/book');

exports.getAllBooks = async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      title: req.query.title
    };
    
    const books = await Book.getAll(filters);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: '获取图书列表失败', error: error.message });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const book = await Book.getById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: '未找到该图书' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: '获取图书详情失败', error: error.message });
  }
};

exports.getFeaturedBooks = async (req, res) => {
  try {
    const featuredBooks = await Book.getFeatured();
    res.json(featuredBooks);
  } catch (error) {
    res.status(500).json({ message: '获取推荐图书失败', error: error.message });
  }
}; 