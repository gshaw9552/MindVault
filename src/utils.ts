import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const { USER, PASS, FROM_EMAIL } = process.env;
if (!USER || !PASS || !FROM_EMAIL) {
  throw new Error("Missing one of USER, PASS or FROM_EMAIL in your .env file");
}

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

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: USER,
    pass: PASS,
  },
});

export async function sendOTPEmail(
  email: string,
  otp: string,
  purpose: "signup" | "reset"
): Promise<void> {
  const subject =
    purpose === "signup"
      ? "Verify Your MindVault Account"
      : "Reset Your MindVault Password";

  const html = `
  <html>
    <body style="font-family: sans-serif; line-height: 1.5; padding: 20px;">
      <h2 style="color: #4F46E5;">
        ${purpose === "signup" ? "Verify Your Account" : "Reset Your Password"}
      </h2>
      <p>
        ${purpose === "signup"
      ? "Thanks for signing up! Use the code below to verify your email."
      : "We received a password reset request. Use the code below to continue."
    }
      </p>
      <p style="
          font-size: 28px;
          font-weight: bold;
          letter-spacing: 4px;
          margin: 20px 0;
        ">
        ${otp}
      </p>
      <p style="color: #666; font-size: 14px;">
        This code expires in 5 minutes. If you didn’t request this, just ignore.
      </p>
      <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
      <p style="font-size: 12px; color: #999;">
        MindVault • <a href="https://yourdomain.com">yourdomain.com</a>
      </p>
    </body>
  </html>
  `;

  await transporter.sendMail({
    from: FROM_EMAIL,
    to: email,
    subject,
    html,
  });
}

export function cosineSimilarity(vecA: number[], vecB: number[]): number {
  const dot = vecA.reduce((sum, a, i) => sum + a * vecB[i], 0);
  const normA = Math.sqrt(vecA.reduce((sum, a) => sum + a * a, 0));
  const normB = Math.sqrt(vecB.reduce((sum, b) => sum + b * b, 0));
  return dot / (normA * normB);
}
