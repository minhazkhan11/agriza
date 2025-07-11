const nodemailer = require("nodemailer");

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email (set in .env)
    pass: process.env.EMAIL_PASS  // Your password or app password
  }
});


const sendEmail = async ({ to, subject, text, html, attachments }) => {
  try {
    const mailOptions = {
      from: `"Your Company" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
      attachments // e.g. [{ filename: 'file.pdf', path: '/path/to/file.pdf' }]
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = sendEmail;
