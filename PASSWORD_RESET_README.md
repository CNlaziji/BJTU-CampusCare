# 基于邮箱的忘记密码功能实现说明

本文档详细介绍了BJTU-CampusCare系统中基于邮箱的忘记密码功能的实现细节、配置方法和使用指南。

## 功能概述

忘记密码功能通过以下三步流程实现用户身份验证和密码重置：
1. **获取验证码**：用户输入用户名和邮箱，系统发送验证码到邮箱
2. **验证验证码**：用户输入收到的验证码，系统验证其有效性
3. **重置密码**：验证通过后，用户设置新密码完成重置

## 技术实现

### 1. 数据模型更新

在User模型中添加了email字段以支持邮箱验证功能：

- **文件**：`src/models/User.js`
- **更新内容**：
  - 保留phone字段，修改注释为"手机号码"
  - 新增email字段，用于找回密码，具有唯一性约束

```javascript
// User模型中的email字段定义
eemail: {
  type: DataTypes.STRING(100),
  allowNull: true,
  unique: true,
  comment: '邮箱地址，用于找回密码'
}
```

### 2. 控制器实现

在userController中实现了完整的忘记密码流程：

- **文件**：`src/controllers/userController.js`
- **核心函数**：
  - `sendVerificationCode`：发送验证码到用户邮箱
  - `verifyCode`：验证用户输入的验证码
  - `resetPassword`：重置用户密码
  - `createUser`：更新用户创建功能，支持email参数

### 3. 邮件服务

创建了独立的邮件服务模块，使用nodemailer实现邮件发送：

- **文件**：`src/utils/emailService.js`
- **功能**：
  - 配置SMTP邮件传输器
  - 提供发送验证码邮件的函数
  - 提供验证邮箱配置的函数

### 4. 路由配置

系统路由已配置忘记密码相关的三个API端点：

- **文件**：`src/routes/userRoutes.js`
- **路由**：
  - `POST /api/users/send-code`：发送验证码
  - `POST /api/users/verify-code`：验证验证码
  - `POST /api/users/reset-password`：重置密码

## 环境配置

### 1. 安装依赖

已添加nodemailer依赖以支持邮件发送功能：

```
nodemailer: ^6.9.8
```

### 2. 环境变量配置

在`.env`文件中添加了邮件服务配置：

```dotenv
# 邮件服务配置
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASS=your-email-password
EMAIL_FROM=noreply@example.com
```

### 3. 常用邮件服务配置指南

- **Gmail**：
  - 主机：smtp.gmail.com
  - 端口：465（SSL）或587（TLS）
  - 需要启用"不太安全的应用访问"或使用应用专用密码

- **QQ邮箱**：
  - 主机：smtp.qq.com
  - 端口：465（SSL）
  - 需要使用授权码而非登录密码

- **163邮箱**：
  - 主机：smtp.163.com
  - 端口：465（SSL）
  - 需要使用授权码而非登录密码

## 使用说明

### 1. 创建用户时添加邮箱

创建新用户时可以同时提供邮箱信息：

```javascript
// 创建用户的请求体示例
{
  "username": "example_user",
  "password": "password123",
  "email": "user@example.com"
}
```

### 2. 忘记密码流程

#### 第一步：发送验证码
- **请求路径**：`POST /api/users/send-code`
- **请求体**：
  ```json
  {
    "username": "example_user",
    "email": "user@example.com"
  }
  ```
- **响应**：
  - 成功：`{"message": "验证码已发送到您的邮箱"}`
  - 失败：`{"error": "错误信息"}`

#### 第二步：验证验证码
- **请求路径**：`POST /api/users/verify-code`
- **请求体**：
  ```json
  {
    "username": "example_user",
    "email": "user@example.com",
    "code": "123456"
  }
  ```
- **响应**：
  - 成功：`{"message": "验证码验证成功"}`
  - 失败：`{"error": "验证码不正确或已过期"}`

#### 第三步：重置密码
- **请求路径**：`POST /api/users/reset-password`
- **请求体**：
  ```json
  {
    "username": "example_user",
    "email": "user@example.com",
    "code": "123456",
    "newPassword": "new_password123"
  }
  ```
- **响应**：
  - 成功：`{"message": "密码重置成功"}`
  - 失败：`{"error": "错误信息"}`

## 安全性说明

1. **验证码有效期**：验证码设置了5分钟的有效期，过期后需要重新获取
2. **双重验证**：要求同时验证用户名和邮箱，增加安全性
3. **密码加密**：重置后的密码使用bcrypt进行加密存储
4. **防止暴力破解**：系统实现了基本的验证码验证逻辑，可进一步扩展为限制错误尝试次数

## 注意事项

1. **邮箱配置**：使用前必须在`.env`文件中配置正确的SMTP服务器信息
2. **数据库连接**：确保MySQL数据库服务正常运行，且配置正确
3. **用户数据**：用户必须同时具有用户名和邮箱信息才能使用忘记密码功能
4. **邮件接收**：验证码发送到用户提供的邮箱，确保邮箱可正常接收邮件

## 故障排查

1. **邮件发送失败**：
   - 检查SMTP服务器配置是否正确
   - 验证邮箱账号和密码/授权码是否有效
   - 确认服务器是否允许发送邮件（防火墙、安全设置等）

2. **验证码验证失败**：
   - 检查验证码是否过期（超过5分钟）
   - 确认输入的验证码是否正确
   - 验证用户名和邮箱是否与发送验证码时一致

3. **密码重置失败**：
   - 检查验证码是否已验证成功
   - 确认新密码是否满足强度要求

如有其他问题，请检查系统日志获取详细错误信息。