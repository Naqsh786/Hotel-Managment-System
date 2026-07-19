import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const sendEmail = async (email, token, type) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const url =
      type === "verify"
        ? `http://localhost:3000/verify/${token}`
        : `http://localhost:3000/reset/${token}`;

    await transporter.sendMail({
      to: email,
      subject: type === "verify" ? "Verify Email" : "Reset Password",
      html: `<h3>Click below:</h3><a href="${url}">${url}</a>`
    });

    console.log("Email sent ✅");
  } catch (err) {
    console.log("Email error ❌", err);
  }
};

export default sendEmail;