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
    // 检查是否配置了真实的短信服务
    const smsServiceProvider = process.env.SMS_SERVICE_PROVIDER || 'mock';
    
    // 根据配置选择不同的短信服务提供商
    switch (smsServiceProvider) {
      case 'aliyun':
        return await sendAliyunSms(phone, username, code);
      case 'tencent':
        return await sendTencentSms(phone, username, code);
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

/**
 * 发送阿里云短信
 * @param {string} phone - 手机号
 * @param {string} username - 用户名
 * @param {string} code - 验证码
 * @returns {Promise<boolean>} - 是否发送成功
 */
async function sendAliyunSms(phone, username, code) {
  try {
    // 检查必要的配置
    const accessKeyId = process.env.ALIYUN_ACCESS_KEY_ID;
    const accessKeySecret = process.env.ALIYUN_ACCESS_KEY_SECRET;
    const signName = process.env.ALIYUN_SMS_SIGN_NAME;
    const templateCode = process.env.ALIYUN_SMS_TEMPLATE_CODE;
    
    if (!accessKeyId || !accessKeySecret || !signName || !templateCode) {
      console.error('阿里云短信配置不完整');
      return false;
    }
    
    // 注意：在实际使用时，需要安装aliyun-sdk
    // npm install aliyun-sdk
    
    // 模拟阿里云短信发送（实际项目中取消注释并使用真实SDK）
    /*
    const Core = require('@alicloud/pop-core');
    
    const client = new Core({
      accessKeyId: accessKeyId,
      accessKeySecret: accessKeySecret,
      endpoint: 'https://dysmsapi.aliyuncs.com',
      apiVersion: '2017-05-25'
    });
    
    const params = {
      'PhoneNumbers': phone,
      'SignName': signName,
      'TemplateCode': templateCode,
      'TemplateParam': JSON.stringify({
        'code': code,
        'username': username
      })
    };
    
    const requestOption = {
      method: 'POST'
    };
    
    const result = await client.request('SendSms', params, requestOption);
    return result.Code === 'OK';
    */
    
    // 开发阶段模拟
    console.log(`===== 阿里云短信发送模拟 =====`);
    console.log(`配置信息: accessKeyId=${accessKeyId}, signName=${signName}, templateCode=${templateCode}`);
    console.log(`发送内容: 手机号=${phone}, 用户名=${username}, 验证码=${code}`);
    console.log(`===== 阿里云短信模拟发送成功 =====`);
    return true;
  } catch (error) {
    console.error('阿里云短信发送失败:', error);
    return false;
  }
}

/**
 * 发送腾讯云短信
 * @param {string} phone - 手机号
 * @param {string} username - 用户名
 * @param {string} code - 验证码
 * @returns {Promise<boolean>} - 是否发送成功
 */
async function sendTencentSms(phone, username, code) {
  try {
    // 检查必要的配置
    const secretId = process.env.TENCENT_SECRET_ID;
    const secretKey = process.env.TENCENT_SECRET_KEY;
    const sdkAppId = process.env.TENCENT_SMS_SDK_APP_ID;
    const signName = process.env.TENCENT_SMS_SIGN_NAME;
    const templateId = process.env.TENCENT_SMS_TEMPLATE_ID;
    
    if (!secretId || !secretKey || !sdkAppId || !signName || !templateId) {
      console.error('腾讯云短信配置不完整');
      return false;
    }
    
    // 注意：在实际使用时，需要安装腾讯云SDK
    // npm install tencentcloud-sdk-nodejs
    
    // 模拟腾讯云短信发送（实际项目中取消注释并使用真实SDK）
    /*
    const tencentcloud = require('tencentcloud-sdk-nodejs');
    const smsClient = tencentcloud.sms.v20210111.Client;
    
    const client = new smsClient({
      credential: {
        secretId: secretId,
        secretKey: secretKey,
      },
      region: 'ap-guangzhou',
      profile: {
        httpProfile: {
          endpoint: 'sms.tencentcloudapi.com',
        },
      },
    });
    
    const params = {
      "SmsSdkAppId": sdkAppId,
      "SignName": signName,
      "TemplateId": templateId,
      "PhoneNumberSet": [phone],
      "TemplateParamSet": [code, '5'] // 验证码和有效期
    };
    
    const result = await client.SendSms(params);
    return result.SendStatusSet[0].Code === 'Ok';
    */
    
    // 开发阶段模拟
    console.log(`===== 腾讯云短信发送模拟 =====`);
    console.log(`配置信息: secretId=${secretId}, sdkAppId=${sdkAppId}, signName=${signName}, templateId=${templateId}`);
    console.log(`发送内容: 手机号=${phone}, 用户名=${username}, 验证码=${code}`);
    console.log(`===== 腾讯云短信模拟发送成功 =====`);
    return true;
  } catch (error) {
    console.error('腾讯云短信发送失败:', error);
    return false;
  }
}

/**
 * 验证短信服务配置是否正确
 * @returns {Promise<boolean>} - 配置是否有效
 */
async function verifySmsConfig() {
  try {
    const smsServiceProvider = process.env.SMS_SERVICE_PROVIDER || 'mock';
    
    switch (smsServiceProvider) {
      case 'aliyun':
        // 验证阿里云短信配置
        const aliyunConfig = [
          process.env.ALIYUN_ACCESS_KEY_ID,
          process.env.ALIYUN_ACCESS_KEY_SECRET,
          process.env.ALIYUN_SMS_SIGN_NAME,
          process.env.ALIYUN_SMS_TEMPLATE_CODE
        ];
        if (aliyunConfig.some(item => !item)) {
          console.log('阿里云短信配置不完整，请检查环境变量');
          return false;
        }
        console.log('阿里云短信配置验证成功');
        return true;
      
      case 'tencent':
        // 验证腾讯云短信配置
        const tencentConfig = [
          process.env.TENCENT_SECRET_ID,
          process.env.TENCENT_SECRET_KEY,
          process.env.TENCENT_SMS_SDK_APP_ID,
          process.env.TENCENT_SMS_SIGN_NAME,
          process.env.TENCENT_SMS_TEMPLATE_ID
        ];
        if (tencentConfig.some(item => !item)) {
          console.log('腾讯云短信配置不完整，请检查环境变量');
          return false;
        }
        console.log('腾讯云短信配置验证成功');
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

module.exports = {
  sendVerificationSms,
  verifySmsConfig
};