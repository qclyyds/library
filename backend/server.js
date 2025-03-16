const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 确保uploads目录存在
const uploadsDir = path.join(__dirname, 'uploads');
const coversDir = path.join(uploadsDir, 'covers');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('创建uploads目录:', uploadsDir);
}
if (!fs.existsSync(coversDir)) {
  fs.mkdirSync(coversDir, { recursive: true });
  console.log('创建covers目录:', coversDir);
}

// 列出现有文件
if (fs.existsSync(coversDir)) {
  console.log('covers目录中的文件:');
  const files = fs.readdirSync(coversDir);
  files.forEach(file => {
    console.log(' - ' + file);
  });
}

// 静态文件服务 - 修复路径问题
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('静态文件路径:', path.join(__dirname, 'uploads'));
console.log('当前工作目录:', process.cwd());

// 路由
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const ordersRoutes = require('./routes/orders');
const adminRoutes = require('./routes/admin');

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/admin', adminRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.send('图书馆管理系统 API 正在运行');
});

// 测试静态文件访问
app.get('/test-static', (req, res) => {
  res.send(`
    <h1>静态文件测试</h1>
    <p>静态文件路径: ${path.join(__dirname, 'uploads')}</p>
    <p>当前工作目录: ${process.cwd()}</p>
    <p>访问地址示例: http://localhost:${PORT}/uploads/covers/1742111976329-20841175.jpg</p>
    <div>测试三体封面图片: <img src="/uploads/covers/1742111976329-20841175.jpg" height="100" /></div>
    <div>测试白夜行封面图片: <img src="/uploads/covers/1742111864030-122553879.jpg" height="100" /></div>
  `);
});

// 添加图片文件列表路由
app.get('/api/images-list', (req, res) => {
  try {
    const coverDir = path.join(__dirname, 'uploads', 'covers');
    if (fs.existsSync(coverDir)) {
      const files = fs.readdirSync(coverDir);
      res.json({
        success: true,
        path: coverDir,
        baseUrl: `http://localhost:${PORT}/uploads/covers/`,
        files: files
      });
    } else {
      res.json({
        success: false,
        message: '封面目录不存在',
        path: coverDir
      });
    }
  } catch (error) {
    res.json({
      success: false,
      message: '获取图片列表失败',
      error: error.message
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
  console.log(`测试静态文件: http://localhost:${PORT}/test-static`);
  console.log(`查看图片列表: http://localhost:${PORT}/api/images-list`);
}); 