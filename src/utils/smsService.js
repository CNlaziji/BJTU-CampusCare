require('dotenv').config();

/**
 * 发送验证码短信
 * @param {string} phone - 接收短信的手机号
 * @param {string} username - 用户名
 * @param {string} code - 验证码
 * @returns {Promise<boolean>} - 是否发送成功
 */
async function sendVerificationSms(phone, username, code) {
  try {
    // 检查是否配置了真实的短信服务，默认使用twilio
    const smsServiceProvider = process.env.SMS_SERVICE_PROVIDER || 'twilio';
    
    // 根据配置选择不同的短信服务提供商
    switch (smsServiceProvider) {
      case 'twilio':
        return await sendTwilioSms(phone, username, code);
      case 'mock':
      default:
        // 模拟短信发送（开发阶段使用）
        console.log(`===== 模拟短信发送 =====`);
        console.log(`收件人: ${phone}`);
        console.log(`用户名: ${username}`);
        console.log(`验证码: ${code}`);
        console.log(`内容: 【医院管理系统】尊敬的${username}，您的密码找回验证码是${code}，有效期5分钟，请勿泄露给他人。`);
        console.log(`===== 短信模拟发送完成 =====`);
        return true;
    }
  } catch (error) {
    console.error('发送短信失败:', error);
    return false;
  }
}

// 仅保留Twilio短信服务，移除阿里云和腾讯云支持

/**
 * 验证短信服务配置是否正确
 * @returns {Promise<boolean>} - 配置是否有效
 */
async function verifySmsConfig() {
  try {
    const smsServiceProvider = process.env.SMS_SERVICE_PROVIDER || 'twilio';
    
    switch (smsServiceProvider) {
      case 'twilio':
        // 验证Twilio短信配置
        const twilioConfig = [
          process.env.TWILIO_ACCOUNT_SID,
          process.env.TWILIO_AUTH_TOKEN,
          process.env.TWILIO_PHONE_NUMBER
        ];
        if (twilioConfig.some(item => !item)) {
          console.log('Twilio短信配置不完整，请检查环境变量');
          return false;
        }
        console.log('Twilio短信配置验证成功');
        return true;
      case 'mock':
      default:
        console.log('短信服务使用模拟模式');
        return true;
    }
  } catch (error) {
    console.error('短信服务配置验证失败:', error);
    return false;
  }
}

/**
 * 使用Twilio发送短信（支持使用个人手机号）
 * @param {string} phone - 接收短信的手机号
 * @param {string} username - 用户名
 * @param {string} code - 验证码
 * @returns {Promise<boolean>} - 是否发送成功
 */
async function sendTwilioSms(phone, username, code) {
  try {
    // 检查必要的配置
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER; // 可以是您验证的个人手机号
    
    if (!accountSid || !authToken || !fromPhoneNumber) {
      console.error('Twilio短信配置不完整');
      return false;
    }
    
    // 注意：在实际使用时，需要安装twilio SDK
    // npm install twilio
    
    // 模拟Twilio短信发送（实际项目中取消注释并使用真实SDK）
    /*
    const twilio = require('twilio');
    const client = twilio(accountSid, authToken);
    
    const message = await client.messages.create({
      body: `【医院管理系统】尊敬的${username}，您的密码找回验证码是${code}，有效期5分钟，请勿泄露给他人。`,
      from: fromPhoneNumber,
      to: phone
    });
    
    return message.sid ? true : false;
    */
    
    // 开发阶段模拟
    console.log(`===== Twilio短信发送模拟 =====`);
    console.log(`配置信息: accountSid=${accountSid}, fromPhoneNumber=${fromPhoneNumber}`);
    console.log(`发送内容: 从 ${fromPhoneNumber} 到 ${phone}, 用户名=${username}, 验证码=${code}`);
    console.log(`内容: 【医院管理系统】尊敬的${username}，您的密码找回验证码是${code}，有效期5分钟，请勿泄露给他人。`);
    console.log(`===== Twilio短信模拟发送成功 =====`);
    return true;
  } catch (error) {
    console.error('Twilio短信发送失败:', error);
    return false;
  }
}

module.exports = {
  sendVerificationSms,
  verifySmsConfig
};