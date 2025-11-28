const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email service error:', error);
  } else {
    console.log('✅ Email service ready');
    console.log(`📧 Using: ${process.env.SMTP_HOST || 'smtp.ethereal.email'}`);
  }
});

/**
 * Send OTP verification email
 */
const sendOTPEmail = async (email, firstName, otp) => {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"Test Automation Arena" <noreply@qaarena.com>',
    to: email,
    subject: '🔐 Your OTP for Test Automation Arena',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-box { background: white; border: 3px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
          .otp { font-size: 48px; font-weight: bold; color: #667eea; letter-spacing: 12px; font-family: 'Courier New', monospace; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Test Automation Arena!</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName}! 👋</h2>
            <p>Thank you for signing up! You're one step away from mastering test automation.</p>
            
            <p><strong>Your One-Time Password (OTP) is:</strong></p>
            <div class="otp-box">
              <div class="otp">${otp}</div>
            </div>
            
            <p>📝 <strong>Instructions:</strong></p>
            <ol>
              <li>Copy the 6-digit OTP above</li>
              <li>Return to the verification page</li>
              <li>Paste the OTP and click "Verify"</li>
            </ol>
            
            <p><strong>⏰ This OTP expires in 10 minutes.</strong></p>
            
            <div class="footer">
              <p>This is a simulator for learning test automation.</p>
              <p>If you didn't sign up, please ignore this email.</p>
              <p>© 2024 Test Automation Arena - QA ARENA</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent:', info.messageId);
    
    // Log preview URL for Ethereal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Preview URL:', previewUrl);
      console.log('🔑 OTP Code:', otp);
    }
    
    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('❌ OTP email sending failed:', error);
    throw new Error('Failed to send OTP email');
  }
};

/**
 * Send Authorization Token verification email
 */
const sendTokenEmail = async (email, firstName, token) => {
  const verificationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/arena/auth-simulator?verify=${token}`;
  
  const mailOptions = {
    from: process.env.SMTP_FROM || '"Test Automation Arena" <noreply@qaarena.com>',
    to: email,
    subject: '🔐 Verify Your Test Automation Arena Account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .token-box { background: white; border: 2px solid #667eea; padding: 20px; margin: 20px 0; border-radius: 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; margin: 20px 0; font-weight: bold; }
          .token { font-size: 14px; color: #666; word-break: break-all; margin-top: 10px; }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Welcome to Test Automation Arena!</h1>
          </div>
          <div class="content">
            <h2>Hi ${firstName}! 👋</h2>
            <p>Thank you for signing up! Click the button below to verify your account and access the dashboard.</p>
            
            <div style="text-align: center;">
              <a href="${verificationLink}" class="button">
                ✅ Verify My Account
              </a>
            </div>
            
            <div class="token-box">
              <p><strong>📝 Alternative Method:</strong></p>
              <p>If the button doesn't work, copy and paste this link into your browser:</p>
              <div class="token">${verificationLink}</div>
            </div>
            
            <p><strong>⏰ This link expires in 24 hours.</strong></p>
            
            <p>🎯 <strong>What happens next?</strong></p>
            <ul>
              <li>Click the verification link</li>
              <li>You'll be automatically logged in</li>
              <li>Access your simulator dashboard</li>
              <li>Start learning test automation!</li>
            </ul>
            
            <div class="footer">
              <p>This is a simulator for learning test automation.</p>
              <p>If you didn't sign up, please ignore this email.</p>
              <p>© 2024 Test Automation Arena - QA ARENA</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Token email sent:', info.messageId);
    
    // Log preview URL for Ethereal
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log('📧 Preview URL:', previewUrl);
      console.log('🔗 Verification Link:', verificationLink);
    }
    
    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('❌ Token email sending failed:', error);
    throw new Error('Failed to send verification email');
  }
};

module.exports = {
  sendOTPEmail,
  sendTokenEmail
};
