const { connectDB } = require('./src/config/database');

// 简单的数据库连接测试脚本
async function testDatabaseConnection() {
  try {
    console.log('开始测试数据库连接...');
    
    // 调用连接函数
    await connectDB();
    
    console.log('✅ 数据库连接成功！');
    console.log('✅ 数据库模型已同步！');
    console.log('✅ 测试通过！您的应用可以正常连接到MySQL数据库。');
    
    // 连接测试成功后退出进程
    process.exit(0);
  } catch (error) {
    console.error('❌ 数据库连接失败！');
    console.error('错误详情:', error.message);
    console.error('\n请检查以下事项:');
    console.error('1. MySQL服务是否正在运行在localhost:3306');
    console.error('2. 是否存在名为hospital的数据库');
    console.error('3. .env文件中的数据库用户名(root)和密码是否正确');
    console.error('4. 数据库用户是否有权限访问hospital数据库');
    
    // 连接测试失败后退出进程
    process.exit(1);
  }
}

// 运行测试
testDatabaseConnection();