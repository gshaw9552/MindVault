import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

// Pull these from your .env—ensure you’ve set them correctly
const { USER, PASS, FROM_EMAIL } = process.env;
if (!USER || !PASS || !FROM_EMAIL) {
  throw new Error(
    "Missing one of USER, PASS or FROM_EMAIL in your .env file"
  );
}

// Random alphanumeric helper (if you still need it elsewhere)
export function random(len: number): string {
  const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  let result = "";
  for (let i = 0; i < len; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

// Numeric 6‑digit OTP generator
export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Create a reusable transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER,
    pass: PASS,
  },
});

/**
 * Send an OTP email for either signup verification or password reset.
 *
 * @param email   Recipient’s email address
 * @param otp     The one‑time code
 * @param purpose "signup" | "reset"
 */
export async function sendOTPEmail(
  email: string,
  otp: string,
  purpose: "signup" | "reset"
): Promise<void> {
  console.log(`📧 Sending ${purpose} OTP to ${email}: ${otp}`);

  const subject =
    purpose === "signup"
      ? "Verify Your MindVault Account"
      : "Reset Your MindVault Password";

  const message =
    purpose === "signup"
      ? `Your verification code is: ${otp}. It expires in 15 minutes.`
      : `Your password reset code is: ${otp}. It expires in 15 minutes.`;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject,
    text: message,
    html: `<p>${message}</p>`,
  });
}
