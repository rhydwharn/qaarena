require('dotenv').config();
const nodemailer = require('nodemailer');

async function main() {
  console.log('Using SMTP config:');
  console.log({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    user: process.env.SMTP_USER,
    from: process.env.SMTP_FROM,
  });

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true', // false for STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: process.env.SMTP_TEST_TO || process.env.SMTP_USER, // set a test recipient
    subject: 'SMTP Test from QA Arena backend',
    text: 'This is a test email confirming SMTP credentials work.',
  });

  console.log('Message sent:', info.messageId);
}

main().catch((err) => {
  console.error('SMTP test failed:', err.message);
  console.error(err);
  process.exit(1);
});