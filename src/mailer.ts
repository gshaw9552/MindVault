import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export async function sendOtpEmail(to: string, otp: string) {
  await transporter.sendMail({
    from: `"MindVault" <${process.env.MAIL_USER}>`,
    to,
    subject: "Your MindVault OTP Code",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`
  });
}