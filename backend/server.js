const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
const authRoutes = require('./routes/auth');
const booksRoutes = require('./routes/books');
const ordersRoutes = require('./routes/orders');

app.use('/api/auth', authRoutes);
app.use('/api/books', booksRoutes);
app.use('/api/orders', ordersRoutes);

// 基础路由
app.get('/', (req, res) => {
  res.send('图书馆管理系统 API 正在运行');
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
}); 