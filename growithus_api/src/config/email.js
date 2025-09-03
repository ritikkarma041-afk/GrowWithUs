const nodemailer = require('nodemailer');
require('dotenv').config();

// For production, use a transactional email service like SendGrid, Mailgun, or AWS SES
// For development, you can use a service like Ethereal or your own SMTP server.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = transporter;
