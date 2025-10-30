# 短信服务配置指南

本文档详细介绍如何在项目中配置和使用短信服务，支持开发测试和生产环境部署。

## 支持的短信服务提供商

系统目前支持以下短信服务提供商：

1. **Mock模式**：默认模式，无需真实短信服务，验证码输出到控制台
2. **阿里云短信服务**：企业级短信服务
3. **腾讯云短信服务**：企业级短信服务

## 配置步骤

### 1. 选择短信服务模式

在 `.env` 文件中设置短信服务提供商：

```
SMS_SERVICE_PROVIDER=mock  # 可选值: mock, aliyun, tencent
```

### 2. 配置对应服务的参数

根据选择的服务提供商，取消注释并填写相应的配置参数。

#### Mock模式（默认）

无需额外配置，验证码会输出到控制台。

```
SMS_SERVICE_PROVIDER=mock
```

#### 阿里云短信服务配置

1. **申请阿里云账号**：前往 [阿里云官网](https://www.aliyun.com/) 注册账号
2. **开通短信服务**：在阿里云控制台开通短信服务
3. **获取访问密钥**：在 [阿里云访问控制](https://ram.console.aliyun.com/) 创建AccessKey
4. **申请短信签名**：在短信服务控制台申请短信签名
5. **创建短信模板**：创建验证码短信模板

```
# 取消注释并填写实际值
ALIYUN_ACCESS_KEY_ID=your-access-key-id
ALIYUN_ACCESS_KEY_SECRET=your-access-key-secret
ALIYUN_SMS_SIGN_NAME=您的短信签名  # 如：医院管理系统
ALIYUN_SMS_TEMPLATE_CODE=SMS_XXXXXXXXX  # 您申请的模板CODE
```

**注意**：阿里云短信模板变量需包含 `code` 和 `username` 两个参数。

#### 腾讯云短信服务配置

1. **申请腾讯云账号**：前往 [腾讯云官网](https://cloud.tencent.com/) 注册账号
2. **开通短信服务**：在腾讯云控制台开通短信服务
3. **创建应用**：在短信服务控制台创建应用，获取SDK AppID
4. **获取访问密钥**：在 [API密钥管理](https://console.cloud.tencent.com/cam/capi) 获取SecretID和SecretKey
5. **申请短信签名**：申请短信签名
6. **创建短信模板**：创建验证码短信模板

```
# 取消注释并填写实际值
TENCENT_SECRET_ID=your-secret-id
TENCENT_SECRET_KEY=your-secret-key
TENCENT_SMS_SDK_APP_ID=140XXXXXXXX  # 您的应用ID
TENCENT_SMS_SIGN_NAME=您的短信签名  # 如：医院管理系统
TENCENT_SMS_TEMPLATE_ID=XXXXXXXXX  # 您的模板ID
```

**注意**：腾讯云短信模板需包含验证码和有效期两个参数。

## 开发环境设置

在开发环境中，推荐使用Mock模式：

1. 确保 `SMS_SERVICE_PROVIDER=mock`
2. 运行应用时，验证码会显示在控制台中
3. 直接使用控制台中显示的验证码进行测试

## 生产环境部署

### 1. 安装必要的依赖

根据选择的短信服务提供商，安装相应的SDK：

#### 阿里云短信
```bash
npm install @alicloud/pop-core
```

#### 腾讯云短信
```bash
npm install tencentcloud-sdk-nodejs
```

### 2. 启用真实短信服务

1. 在生产环境的 `.env` 文件中设置正确的服务提供商
2. 填写所有必要的配置参数
3. 取消 `smsService.js` 中对应提供商代码块的注释

### 3. 安全注意事项

- **密钥保护**：确保访问密钥不会被提交到代码仓库
- **环境变量**：在生产环境中使用环境变量存储敏感信息
- **权限控制**：为短信服务API密钥设置最小权限

## 测试短信服务

系统启动时会自动验证短信配置。您也可以通过密码找回流程测试短信发送功能：

1. 调用 `/api/users/send-code` 接口发送验证码
2. 检查控制台输出（Mock模式）或手机短信（真实服务）
3. 使用收到的验证码完成密码重置流程

## 常见问题

### 1. 配置正确但短信发送失败
- 检查短信签名和模板是否已通过审核
- 确认AccessKey权限是否足够
- 查看控制台错误日志获取详细信息

### 2. 验证码不显示在控制台
- 确保 `SMS_SERVICE_PROVIDER=mock`
- 检查日志输出位置

### 3. 生产环境切换到真实短信服务
- 确保已安装对应SDK
- 取消代码中SDK相关代码的注释
- 配置所有必要的环境变量