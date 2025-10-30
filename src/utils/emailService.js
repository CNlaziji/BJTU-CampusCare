const nodemailer = require('nodemailer');
require('dotenv').config();

// 创建邮件传输器
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.example.com',
  port: process.env.EMAIL_PORT || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'your-email@example.com',
    pass: process.env.EMAIL_PASS || 'your-email-password'
  }
});

/**
 * 发送验证码邮件
 * @param {string} to - 收件人邮箱
 * @param {string} username - 用户名
 * @param {string} code - 验证码
 * @returns {Promise<boolean>} - 是否发送成功
 */
async function sendVerificationEmail(to, username, code) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@example.com',
      to,
      subject: '医院管理系统 - 密码找回验证码',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">医院管理系统 - 密码找回</h2>
          <p>尊敬的用户 ${username}，您好！</p>
          <p>您正在尝试重置密码，以下是您的验证码：</p>
          <div style="background-color: #f4f4f4; padding: 15px; text-align: center; margin: 20px 0;">
            <span style="font-size: 24px; font-weight: bold; color: #2c3e50;">${code}</span>
          </div>
          <p>此验证码有效期为5分钟，请尽快使用。</p>
          <p>如果您没有请求重置密码，请忽略此邮件。</p>
          <p>此致<br>医院管理系统团队</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('邮件发送成功:', info.messageId);
    return true;
  } catch (error) {
    console.error('发送邮件失败:', error);
    // 在实际应用中，可能需要记录错误或尝试重试
    return false;
  }
}

/**
 * 验证邮箱传输器配置是否正确
 * @returns {Promise<boolean>} - 配置是否有效
 */
async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('邮件传输器配置验证成功');
    return true;
  } catch (error) {
    console.error('邮件传输器配置验证失败:', error);
    console.log('请确保在.env文件中正确配置了邮箱设置');
    return false;
  }
}

module.exports = {
  sendVerificationEmail,
  verifyEmailConfig
};