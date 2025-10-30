# 短信服务配置指南

本文档详细介绍如何在项目中配置和使用短信服务，支持开发测试和生产环境部署。

## 支持的短信服务提供商

系统目前支持以下短信服务提供商：

1. **Mock模式**：默认模式，无需真实短信服务，验证码输出到控制台
2. **Twilio短信服务**：支持使用个人手机号（包括中国联通）发送短信的国际短信服务

## 配置步骤

### 1. 选择短信服务模式

在 `.env` 文件中设置短信服务提供商：

```
SMS_SERVICE_PROVIDER=mock  # 可选值: mock, twilio
```

### 2. 配置对应服务的参数

根据选择的服务提供商，取消注释并填写相应的配置参数。

#### Mock模式（默认）

无需额外配置，验证码会输出到控制台。

```
SMS_SERVICE_PROVIDER=mock
```

## 开发环境设置

在开发环境中，推荐使用Mock模式：

1. 确保 `SMS_SERVICE_PROVIDER=mock`
2. 运行应用时，验证码会显示在控制台中
3. 直接使用控制台中显示的验证码进行测试

## Twilio短信服务配置（支持个人手机号）

Twilio是一个国际短信服务提供商，特别适合希望使用自己的个人手机号（包括中国联通）发送短信的场景。

### 配置步骤

1. **注册Twilio账户**：
   - 访问 [Twilio官网](https://www.twilio.com/)
   - 注册并创建一个账户
   - 登录Twilio控制台

2. **获取必要的凭证**：
   - 在Twilio控制台获取您的 `ACCOUNT SID` 和 `AUTH TOKEN`
   
3. **验证您的中国联通手机号**：
   - 在Twilio控制台中，导航到 "Phone Numbers" > "Verified Caller IDs"
   - 点击 "Verify a new Caller ID"
   - 输入您的中国联通手机号
   - 选择接收验证码的方式（短信或语音）
   - 输入收到的验证码完成验证

4. **在 `.env` 文件中配置**：

```
# 将服务提供商设置为twilio
SMS_SERVICE_PROVIDER=twilio

# 取消注释并填写实际值
TWILIO_ACCOUNT_SID=您的Twilio账户SID
TWILIO_AUTH_TOKEN=您的Twilio认证令牌
TWILIO_PHONE_NUMBER=您已验证的中国联通手机号（格式：+86130XXXXXXXX）
```

5. **安装Twilio SDK**：

```bash
npm install twilio
```

6. **修改代码中的注释**：
   - 打开 `src/utils/smsService.js` 文件
   - 找到 `sendTwilioSms` 函数
   - 取消注释使用Twilio真实SDK的代码部分，并注释掉模拟发送的代码

### 注意事项

1. **手机号格式**：确保您的中国联通手机号格式正确，需要包含国家代码，例如 `+86130XXXXXXXX`

2. **发送限制**：Twilio免费账户对验证过的个人手机号有发送数量限制

3. **国际短信费用**：向中国手机号发送短信可能会产生国际短信费用

4. **短信内容**：Twilio对短信内容有一定限制，请确保内容合规

## 生产环境部署

### 1. 安装必要的依赖

根据选择的短信服务提供商，安装相应的SDK：

#### Twilio短信
```bash
npm install twilio
```

### 2. 启用真实短信服务

1. 在生产环境的 `.env` 文件中设置正确的服务提供商：
   - 使用Twilio：`SMS_SERVICE_PROVIDER=twilio`
2. 填写所有必要的配置参数
3. 取消注释Twilio服务的SDK调用代码部分
4. 取消 `smsService.js` 中对应提供商代码块的注释

### 3. 安全注意事项

- **密钥保护**：确保Twilio账户的SID和Token不会被提交到代码仓库
- **环境变量**：在生产环境中使用环境变量存储敏感信息
- **权限控制**：为Twilio账户设置适当的权限控制

## 测试短信服务

系统启动时会自动验证短信配置。您也可以通过密码找回流程测试短信发送功能：

1. 调用 `/api/users/send-code` 接口发送验证码
2. 检查控制台输出（Mock模式）或手机短信（Twilio服务）
3. 使用收到的验证码完成密码重置流程

## 常见问题

### 1. 配置正确但短信发送失败
- 检查Twilio账户是否有足够余额
- 确认目标手机号是否已通过验证
- 查看控制台错误日志获取详细信息

### 2. 验证码不显示在控制台
- 确保 `SMS_SERVICE_PROVIDER=mock`
- 检查日志输出位置

### 3. 生产环境切换到真实短信服务
- 确保已安装Twilio SDK
- 取消代码中SDK相关代码的注释
- 配置所有必要的环境变量