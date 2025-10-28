const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// JWT相关配置

// JWT密钥，实际项目中应存储在环境变量中
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = '24h'; // Token过期时间

// 获取所有用户
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: '获取用户失败', error: error.message });
  }
};

// 创建新用户
exports.createUser = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    // 基本验证
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '请填写必填字段',
        data: null
      });
    }
    
    // 密码加密
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 手动生成user_id - 获取当前最大ID值
    const maxIdResult = await User.max('userId');
    const newUserId = maxIdResult ? maxIdResult + 1 : 1;
    
    // 创建用户
    const user = await User.create({
      userId: newUserId,
      username,
      password: hashedPassword,
      role: role || 'patient'
      // verifyStatus有默认值'unverified'
    });
    
    // 返回符合要求的格式
    res.status(201).json({
      code: 201,
      message: '注册成功，请完成身份核验。',
      data: {
        userId: user.userId,
        username: user.username,
        role: user.role,
        verifyStatus: user.verifyStatus
      }
    });
  } catch (error) {
    // 检查是否为唯一约束错误
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        code: 409,
        message: '用户名已存在',
        data: null
      });
    }
    
    // 添加详细错误日志以帮助调试
    console.error('注册失败错误详情:', error);
    res.status(500).json({
      code: 500,
      message: '注册失败',
      data: null,
      error: error.message // 在开发环境显示错误信息帮助调试
    });
  }
};

// 用户登录
exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 基本验证
    if (!username || !password) {
      return res.status(400).json({
        code: 400,
        message: '请输入用户名和密码',
        data: null
      });
    }
    
    // 查找用户
    const user = await User.findOne({ where: { username } });
    
    if (!user) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
        data: null
      });
    }
    
    // 验证密码 - 支持明文密码（数据库中密码未哈希的情况）
    let isPasswordValid = false;
    
    try {
      // 尝试使用bcrypt验证（如果密码是哈希过的）
      isPasswordValid = await bcrypt.compare(password, user.password);
    } catch (error) {
      // bcrypt验证失败，可能是明文密码
      console.log('Bcrypt验证失败，尝试直接比较明文密码');
    }
    
    // 如果bcrypt验证失败，尝试直接比较明文密码
    if (!isPasswordValid) {
      isPasswordValid = (password === user.password);
    }
    
    if (!isPasswordValid) {
      return res.status(401).json({
        code: 401,
        message: '用户名或密码错误',
        data: null
      });
    }
    
    // 生成JWT token
    const token = jwt.sign(
      {
        userId: user.userId,
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );
    
    // 返回符合要求的格式
    res.status(200).json({
      code: 200,
      message: '登录成功。',
      data: {
        token,
        user: {
          userId: user.userId,
          username: user.username,
          role: user.role,
          verifyStatus: user.verifyStatus
        }
      }
    });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({
      code: 500,
      message: '登录失败',
      data: null
    });
  }
};

// 用户身份核验
exports.verifyUser = async (req, res) => {
  try {
    // 从JWT中间件获取用户ID
    const { userId } = req.user;
     
    // 查找用户
    const user = await User.findByPk(userId);
    
    if (!user) {
      return res.status(404).json({
        code: 404,
        message: '用户不存在',
        data: null
      });
    }
    
    // 检查用户当前状态
    if (user.verifyStatus === 'verified') {
      return res.status(200).json({
        code: 200,
        message: '您已完成身份核验！',
        data: {
          verifyStatus: user.verifyStatus
        }
      });
    }
    
    // 简化的身份核验逻辑，直接更新用户状态
    // 在实际应用中，可以根据业务需求添加适当的验证步骤
    await user.update({
      verifyStatus: 'verified'
    });
    
    // 返回成功响应
    return res.status(200).json({
      code: 200,
      message: '身份核验成功！',
      data: {
        verifyStatus: 'verified'
      }
    });
  } catch (error) {
    console.error('身份核验失败:', error);
    res.status(500).json({
      code: 500,
      message: '身份核验过程中发生错误',
      data: null
    });
  }
};