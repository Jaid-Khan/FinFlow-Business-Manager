const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendPasswordResetEmail = async (email, resetUrl) => {
  await transporter.sendMail({
    from: `"FinFlow" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Reset your FinFlow password",
    text: `You requested a password reset. Use this link to reset your password: ${resetUrl}. This link expires in 15 minutes.`,
    html: `
      <h2>Reset your FinFlow password</h2>
      <p>You requested a password reset.</p>
      <p>
        <a href="${resetUrl}">
          Reset Password
        </a>
      </p>
      <p>This link expires in 15 minutes.</p>
      <p>If you did not request this, you can safely ignore this email.</p>
    `,
  });
};

module.exports = {
  sendPasswordResetEmail,
};