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
    const { title, author, description, isbn, publisher, location, category, featured } = req.body;
    
    if (!title || !author) {
      return res.status(400).json({ message: '请提供有效的图书信息' });
    }
    
    // 处理封面图片
    let cover_image = '';
    if (req.file) {
      cover_image = `/uploads/covers/${req.file.filename}`;
      console.log('上传了封面图片:', cover_image);
    }
    
    // 只有当featured明确设置为true时才设置为true
    const featuredValue = featured === 'true' || featured === true;
    console.log('添加图书信息:', {
      title,
      cover_image: cover_image ? '有图片' : '无图片',
      featured: featuredValue
    });
    
    const bookId = await Book.create({
      title,
      author,
      description: description || '',
      isbn: isbn || '',
      publisher: publisher || '',
      location: location || '',
      cover_image,
      category: category || '',
      featured: featuredValue
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
    const { title, author, description, isbn, publisher, location, category, featured } = req.body;
    
    const book = await Book.getById(bookId);
    if (!book) {
      return res.status(404).json({ message: '图书不存在' });
    }
    
    // 处理封面图片
    let cover_image = book.cover_image;
    if (req.file) {
      cover_image = `/uploads/covers/${req.file.filename}`;
      console.log('更新了封面图片:', cover_image);
    } else {
      console.log('保留原有封面图片:', cover_image);
    }
    
    // 只有当featured明确设置为true时才更新为true
    const featuredValue = featured === 'true' || featured === true ? true : 
                          featured === 'false' || featured === false ? false : 
                          book.featured; // 如果未提供，保持原来的值
    
    console.log('更新图书信息:', {
      id: bookId,
      title,
      cover_image: cover_image ? '有图片' : '无图片',
      featured: featuredValue
    });
    
    await Book.update(bookId, {
      title,
      author,
      description,
      isbn,
      publisher,
      location,
      cover_image,
      category,
      featured: featuredValue
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

// 更新图书推荐状态
exports.updateFeaturedStatus = async (req, res) => {
  try {
    const bookId = req.params.id;
    const { featured } = req.body;
    
    // 验证输入
    if (featured !== true && featured !== false && featured !== 'true' && featured !== 'false') {
      return res.status(400).json({ message: '无效的featured值，必须为true或false' });
    }
    
    // 确保图书存在
    const book = await Book.getById(bookId);
    if (!book) {
      return res.status(404).json({ message: '图书不存在' });
    }
    
    // 转换为布尔值
    const featuredBoolean = featured === true || featured === 'true';
    
    // 更新图书推荐状态
    await Book.updateFeatured(bookId, featuredBoolean);
    
    // 返回响应
    const statusText = featuredBoolean ? '推荐' : '取消推荐';
    console.log(`图书[${bookId}] ${statusText}状态更新成功`);
    res.json({ 
      message: `图书${statusText}状态更新成功`,
      book: {
        id: bookId,
        featured: featuredBoolean
      }
    });
  } catch (error) {
    console.error('更新推荐状态失败:', error);
    res.status(500).json({ message: '更新推荐状态失败', error: error.message });
  }
}; 