const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const { connectDB } = require('./config/database');
const corsOptions = require('./config/cors');
const userRoutes = require('./routes/userRoutes');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors(corsOptions));
app.use(express.json());

// 路由
app.use('/api/users', userRoutes);

// 静态站点：患者前端（不改动其内容，直接作为静态资源挂载）
const patientStaticDir = path.join(__dirname, '../../BJTU-CampusCare-Patient');
app.use('/patient', express.static(patientStaticDir));
// 便于无斜杠访问 /patient 直接返回首页
app.get('/patient', (req, res) => {
  res.sendFile(path.join(patientStaticDir, 'index.html'));
});
// 兼容患者页面中使用的 src/style.css 路径（不修改患者文件）
app.get('/patient/src/style.css', (req, res) => {
  res.sendFile(path.join(patientStaticDir, 'style.css'));
});

app.get('/', (req, res) => {
  res.send('医院管理系统后端API');
});

// 全局错误处理中间件 - 移到这里
app.use((err, req, res, next) => {
  // 处理CORS错误
  if (err.message === '不允许的跨域请求') {
    return res.status(403).json({
      success: false,
      message: 'CORS错误：不允许的跨域请求',
      error: err.message
    });
  }
  
  // 处理其他错误
  res.status(500).json({
    success: false,
    message: '服务器内部错误',
    error: err.message
  });
});

// 连接数据库并启动服务器 - 最后调用
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
  }
};

startServer();
