# 验证码模块使用说明

## 功能概述

本模块实现了一个完整的图片验证码系统，包含以下功能：
- 生成四位数字验证码图片（SVG格式）
- 验证用户输入的验证码
- 验证码过期管理（5分钟有效期）
- 一次性使用机制
- 开发调试接口

## 文件结构

```
src/
├── controllers/
│   └── captchaController.js    # 验证码控制器
├── routes/
│   └── captchaRoutes.js        # 验证码路由
└── server.js                   # 主服务器文件（已更新）

test-captcha-simple.js          # 功能测试文件
captcha-demo.html              # 前端演示页面
CAPTCHA_README.md              # 本说明文档
```

## API接口

### 1. 生成验证码
- **接口**: `GET /api/captcha/generate`
- **功能**: 生成四位数字验证码图片
- **返回格式**:
```json
{
  "success": true,
  "data": {
    "captchaId": "uuid-string",
    "image": "data:image/svg+xml;base64,..."
  },
  "message": "验证码生成成功"
}
```

### 2. 验证验证码
- **接口**: `POST /api/captcha/verify`
- **参数**:
```json
{
  "captchaId": "uuid-string",
  "code": "1234"
}
```
- **返回格式**:
```json
{
  "success": true/false,
  "message": "验证结果信息"
}
```

### 3. 获取统计信息（开发调试用）
- **接口**: `GET /api/captcha/stats`
- **功能**: 获取当前存储的验证码统计信息
- **返回格式**:
```json
{
  "success": true,
  "data": {
    "totalCaptchas": 3,
    "captchas": [
      {
        "id": "uuid-string",
        "code": "1234",
        "createdAt": "2023-10-29T10:12:42.000Z",
        "expiresAt": "2023-10-29T10:17:42.000Z"
      }
    ]
  }
}
```

## 前端使用示例

### HTML结构
```html
<div>
  <img id="captcha-image" alt="验证码" width="120" height="40">
  <button onclick="refreshCaptcha()">刷新验证码</button>
  <input type="text" id="captcha-input" placeholder="请输入验证码" maxlength="4">
  <button onclick="verifyCaptcha()">验证</button>
</div>
```

### JavaScript代码
```javascript
let currentCaptchaId = null;

// 生成验证码
async function refreshCaptcha() {
  try {
    const response = await fetch('/api/captcha/generate');
    const data = await response.json();
    
    if (data.success) {
      currentCaptchaId = data.data.captchaId;
      document.getElementById('captcha-image').src = data.data.image;
    }
  } catch (error) {
    console.error('生成验证码失败:', error);
  }
}

// 验证验证码
async function verifyCaptcha() {
  const code = document.getElementById('captcha-input').value;
  
  if (!code || !currentCaptchaId) {
    alert('请先生成验证码并输入');
    return;
  }
  
  try {
    const response = await fetch('/api/captcha/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ captchaId: currentCaptchaId, code })
    });
    
    const data = await response.json();
    
    if (data.success) {
      alert('验证码正确！');
      // 验证成功后的处理逻辑
    } else {
      alert('验证码错误：' + data.message);
      refreshCaptcha(); // 重新生成验证码
    }
  } catch (error) {
    console.error('验证失败:', error);
  }
}

// 页面加载时生成验证码
window.onload = refreshCaptcha;
```

## 特性说明

### 1. 验证码图片特性
- **格式**: SVG矢量图形，支持缩放不失真
- **尺寸**: 120x40像素
- **内容**: 四位随机数字（1000-9999）
- **样式**: 
  - 随机颜色的数字
  - 随机旋转角度（-15°到15°）
  - 随机字体大小（18-22px）
  - 干扰线和干扰点
  - 浅色背景

### 2. 安全特性
- **有效期**: 5分钟自动过期
- **一次性**: 验证成功或失败后自动删除
- **唯一性**: 每个验证码都有唯一的UUID标识
- **不区分大小写**: 验证时自动转换为小写比较

### 3. 存储机制
- **当前实现**: 内存存储（Map对象）
- **生产建议**: 使用Redis等外部缓存
- **自动清理**: 每分钟清理一次过期验证码

## 测试方法

### 1. 运行功能测试
```bash
node test-captcha-simple.js
```

### 2. 启动服务器测试
```bash
# 安装依赖（如果遇到权限问题，可以跳过）
npm install

# 启动服务器
npm start
# 或
node src/server.js
```

### 3. 前端演示
1. 启动后端服务器
2. 在浏览器中打开 `captcha-demo.html`
3. 测试验证码生成和验证功能

## 集成到现有项目

### 1. 在登录表单中使用
```html
<!-- 在登录表单中添加验证码 -->
<form id="login-form">
  <input type="text" name="username" placeholder="用户名" required>
  <input type="password" name="password" placeholder="密码" required>
  
  <!-- 验证码部分 -->
  <div class="captcha-group">
    <img id="captcha-image" alt="验证码" width="120" height="40">
    <button type="button" onclick="refreshCaptcha()">刷新</button>
    <input type="text" name="captcha" placeholder="验证码" maxlength="4" required>
  </div>
  
  <button type="submit">登录</button>
</form>
```

### 2. 在表单提交时验证
```javascript
document.getElementById('login-form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  // 先验证验证码
  const captchaValid = await verifyCaptcha();
  if (!captchaValid) {
    return; // 验证码错误，停止提交
  }
  
  // 验证码正确，继续登录逻辑
  const formData = new FormData(e.target);
  // ... 登录处理
});
```

## 生产环境优化建议

### 1. 使用Redis存储
```javascript
// 替换内存存储为Redis
const redis = require('redis');
const client = redis.createClient();

// 存储验证码
await client.setex(`captcha:${captchaId}`, 300, code); // 5分钟过期

// 验证验证码
const storedCode = await client.get(`captcha:${captchaId}`);
```

### 2. 添加频率限制
```javascript
// 限制同一IP生成验证码的频率
const rateLimit = require('express-rate-limit');

const captchaLimiter = rateLimit({
  windowMs: 60 * 1000, // 1分钟
  max: 10, // 最多10次
  message: '验证码请求过于频繁，请稍后再试'
});

router.get('/generate', captchaLimiter, generateCaptcha);
```

### 3. 增强图片复杂度
- 添加更多干扰元素
- 使用更复杂的字体变形
- 添加背景纹理
- 支持字母+数字组合

## 故障排除

### 1. 服务器启动失败
- 检查端口5000是否被占用
- 确保所有依赖包已安装
- 检查数据库连接配置

### 2. 验证码图片不显示
- 检查浏览器控制台错误信息
- 确认API接口返回正确的base64数据
- 检查CORS配置

### 3. 验证总是失败
- 检查验证码是否过期
- 确认captchaId是否正确传递
- 检查输入的验证码格式

## 更新日志

- **v1.0.0**: 初始版本，支持基本的验证码生成和验证功能
- 支持SVG格式图片生成
- 实现内存存储机制
- 添加自动过期清理
- 提供完整的前端演示