const nodemailer = require("nodemailer");

const send_email = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.MAIL_EMAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Dev Tester" <dev@example.com>',
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) return res.status(500).json({ message: "Server error" });
    console.log("Preview URL:", nodemailer.getTestMessageUrl(info));
  });
};
module.exports = {
  send_email,
};
