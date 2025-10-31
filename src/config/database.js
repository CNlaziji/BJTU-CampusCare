const { Sequelize } = require('sequelize');
require('dotenv').config();

console.log('DEBUG: DB_NAME', process.env.DB_NAME);
console.log('DEBUG: DB_USER', process.env.DB_USER);
console.log('DEBUG: DB_PASSWORD', process.env.DB_PASSWORD);
console.log('DEBUG: DB_HOST', process.env.DB_HOST);
console.log('DEBUG: DB_PORT', process.env.DB_PORT);

// 创建Sequelize实例
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'mysql',
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    logging: false // 禁用SQL查询日志输出
  }
);

// 测试连接
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL连接成功');
    // 同步数据库模型
    await sequelize.sync({ alter: true });
    console.log('数据库模型已同步');
  } catch (error) {
    console.error('MySQL连接失败:', error);
    process.exit(1);
  }
};

module.exports = { sequelize, connectDB };