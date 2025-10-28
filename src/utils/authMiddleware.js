const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// JWT验证中间件
const authenticateJWT = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({
      code: 401,
      message: '缺少认证令牌',
      data: null
    });
  }
  
  // 检查Bearer前缀
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({
      code: 401,
      message: '认证令牌格式错误',
      data: null
    });
  }
  
  const token = parts[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 查找用户是否存在
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户不存在或令牌已失效',
        data: null
      });
    }
    
    // 将用户信息存储在请求对象中，使用userId代替id
    req.user = {
      userId: user.userId,
      username: user.username,
      role: user.role
    };
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        code: 401,
        message: '认证令牌已过期',
        data: null
      });
    }
    return res.status(401).json({
      code: 401,
      message: '认证令牌无效',
      data: null
    });
  }
};

module.exports = authenticateJWT;