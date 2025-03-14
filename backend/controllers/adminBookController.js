const Book = require('../models/book');

// 获取所有图书
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.getAll();
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: '获取图书失败', error: error.message });
  }
};

// 获取单本图书
exports.getBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const book = await Book.getById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: '图书不存在' });
    }
    
    res.json(book);
  } catch (error) {
    res.status(500).json({ message: '获取图书失败', error: error.message });
  }
};

// 添加图书
exports.addBook = async (req, res) => {
  try {
    const { title, author, description, price, stock, cover_url } = req.body;
    
    if (!title || !author || !price || price <= 0) {
      return res.status(400).json({ message: '请提供有效的图书信息' });
    }
    
    const bookId = await Book.create({
      title,
      author,
      description: description || '',
      price,
      stock: stock || 0,
      cover_url: cover_url || ''
    });
    
    res.status(201).json({ 
      message: '图书添加成功', 
      bookId 
    });
  } catch (error) {
    res.status(500).json({ message: '添加图书失败', error: error.message });
  }
};

// 更新图书
exports.updateBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { title, author, description, price, stock, cover_url } = req.body;
    
    const book = await Book.getById(bookId);
    if (!book) {
      return res.status(404).json({ message: '图书不存在' });
    }
    
    if (price && price <= 0) {
      return res.status(400).json({ message: '价格必须大于0' });
    }
    
    await Book.update(bookId, {
      title,
      author,
      description,
      price,
      stock,
      cover_url
    });
    
    res.json({ message: '图书更新成功' });
  } catch (error) {
    res.status(500).json({ message: '更新图书失败', error: error.message });
  }
};

// 删除图书
exports.deleteBook = async (req, res) => {
  try {
    const bookId = req.params.id;
    
    const book = await Book.getById(bookId);
    if (!book) {
      return res.status(404).json({ message: '图书不存在' });
    }
    
    await Book.delete(bookId);
    
    res.json({ message: '图书删除成功' });
  } catch (error) {
    res.status(500).json({ message: '删除图书失败', error: error.message });
  }
}; 