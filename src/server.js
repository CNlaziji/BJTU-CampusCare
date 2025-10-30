const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { connectDB } = require('./config/database');
const corsOptions = require('./config/cors');
const userRoutes = require('./routes/userRoutes');
const captchaRoutes = require('./routes/captchaRoutes');
const { verifySmsConfig } = require('./utils/smsService');

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 中间件
app.use(cors(corsOptions));
app.use(express.json());

// 路由
app.use('/api/users', userRoutes);
app.use('/api/captcha', captchaRoutes);

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
    // 验证短信服务配置
    console.log('验证短信服务配置...');
    const smsConfigValid = await verifySmsConfig();
    if (!smsConfigValid) {
      console.warn('警告：短信服务配置可能不完整，请检查环境变量配置');
    }
    
    // 连接数据库
    await connectDB();
    
    // 启动服务器
    app.listen(PORT, () => {
      console.log(`服务器运行在 http://localhost:${PORT}`);
      console.log(`短信服务模式: ${process.env.SMS_SERVICE_PROVIDER || 'mock'}`);
    });
  } catch (error) {
    console.error('启动服务器失败:', error);
  }
};

startServer();
