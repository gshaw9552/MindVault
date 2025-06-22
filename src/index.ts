import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signInSchema, userSchema } from "./validationSchema";
import { ContentModel, EmailVerificationModel, LinkModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import { cosineSimilarity, generateOtp, random, sendOTPEmail } from "./utils";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
  const result = userSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({
      message: "Invalid Input",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const { email, password, username } = result.data;

  try {
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      res.status(409).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await EmailVerificationModel.create({
      userId: user._id,
      otp,
      purpose: 'signup',
      expiresAt,
    })

    await sendOTPEmail(email, otp, 'signup');
    
    res.status(201).json({ 
      message: "User created. Please check your email for verification code.", 
      requiresVerification: true
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/verify-signup-otp", async(req, res) => {
  const { email, otp } = req.body;
  
  if(!email || !otp) {
    res.status(400).json({ message: "Email and OTP are required" });
    return;
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    if (user.isVerified) {
      res.status(400).json({ message: "User already verified" });
      return;
    }

    const verification = await EmailVerificationModel.findOne({
      userId: user._id,
      otp,
      purpose: 'signup',
    });

    if (!verification) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    user.isVerified = true;
    await user.save();
    await EmailVerificationModel.deleteOne({ _id: verification._id });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ message: "Email verified successfully", token });
  } catch (err) {
    console.error("Verify signup OTP error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/resend-signup-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user || user.isVerified) {
      res.status(404).json({ message: "User not found or already verified" });
      return;
    }
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await EmailVerificationModel.findOneAndUpdate(
      { userId: user._id, purpose: 'signup' },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otp, 'signup');

    res.json({ message: "Verification code resent" });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/signin", async (req, res) => {
  const result = signInSchema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({
      message: "Invalid Input",
      errors: result.error.flatten().fieldErrors,
    });
    return;
  }

  const { email, username, password } = result.data;

  const query = email ? { email } : { username };

  try {
    const user = await UserModel.findOne(query);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({ 
        message: "Please verify your email before signing in",
        requiresVerification: true,
        email: user.email 
      });
      return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ message: "Incorrect password" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ message: "User signed in", token });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/forgot-password", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: "Email is required" });
    return;
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.json({ message: "If the email exists, a reset code has been sent" });
      return;
    }

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    // Upsert verification record
    await EmailVerificationModel.findOneAndUpdate(
      { userId: user._id, purpose: 'reset' },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    await sendOTPEmail(email, otp, 'reset');

    res.json({ message: "If the email exists, a reset code has been sent" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/verify-reset-otp", async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    res.status(400).json({ message: "Email, OTP, and new password are required" });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ message: "Password must be at least 6 characters" });
    return;
  }

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const verification = await EmailVerificationModel.findOne({
      userId: user._id,
      otp,
      purpose: 'reset',
    });

    if (!verification) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    await EmailVerificationModel.deleteOne({ _id: verification._id });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ message: "Password reset successfully", token });
  } catch (err) {
    console.error("Verify reset OTP error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/change-password", userMiddleware, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    res.status(400).json({ message: "Old password and new password are required" });
    return;
  }

  if (newPassword.length < 6) {
    res.status(400).json({ message: "New password must be at least 6 characters" });
    return;
  }

  try {
    const user = await UserModel.findById(req.userId);
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatch) {
      res.status(400).json({ message: "Current password is incorrect" });
      return;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1h",
    });

    res.json({ message: "Password changed successfully", token });
  } catch (err) {
    console.error("Change password error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  try {
    const { link, type, title, description, embedding } = req.body;

    if (!link || !type || !title || !Array.isArray(embedding)) {
      res.status(400).json({
        message: "Missing required fields",
      });
      return;
    }

    const content = await ContentModel.create({
      link,
      type,
      title,
      userId: req.userId,
      description,
      tags: [],
      embedding,
    });

    res.status(201).json({
      content,
      message: "Content added",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/v1/content", userMiddleware, async (req, res) => {
  const userId = req.userId;
  const content = await ContentModel.find({
    userId: userId,
  }).populate("userId", "username");
  res.json({
    content,
  });
});

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  try {
    const contentId = req.body.contentId;
    if (!contentId) {
      res.status(400).json({ message: "Content ID is required" });
      return;
    }

    await ContentModel.deleteOne({
      _id: contentId,
      userId: req.userId,
    });
    

    res.json({ message: "Content deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  let link = await LinkModel.findOne({ userId: req.userId });
  if (!link) {
    const hash = random(10);
    link = await LinkModel.create({ userId: req.userId, hash });
  }
  const user = await UserModel.findById(req.userId, "username").lean();
  res.json({ hash: link.hash, username: user!.username });
});

app.get("/api/v1/public-brains", async (_, res) => {
  try {
    const links = await LinkModel.find()
      .sort({ createdAt: -1 })
      .populate<{ userId: { username: string } }>("userId", "username")
      .lean();

    const brains = links.map(link => ({
      username: link.userId.username,
      hash:     link.hash,
      createdAt: link.createdAt,
    }));

    res.json({ brains });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/api/v1/brain/me/link", userMiddleware, async (req, res) => {
  const link = await LinkModel.findOne({ userId: req.userId }).lean();
  if (!link) {
    res.status(404).json({ message: "Not shared" });
    return;
  }

  const user = await UserModel.findById(req.userId, "username").lean();
  res.json({ hash: link.hash, username: user!.username });
});


app.delete("/api/v1/brain/me/link", userMiddleware, async (req, res) => {
  await LinkModel.deleteOne({ userId: req.userId });
  res.json({ message: "Unshared" });
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const hash = req.params.shareLink.trim();
  const link = await LinkModel.findOne({ hash });
  if (!link) { 
    res.status(404).json({ message: "Not found" });
    return;
  }

  const content = await ContentModel.find({ userId: link.userId }).lean();
  const user = await UserModel.findById(link.userId, "username").lean();

  res.json({
    username: user!.username,
    content,
  });
});

app.get("/api/v1/me", userMiddleware, async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId).select("username email");
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }
    res.json({ username: user.username, email: user.email });
  } catch (err) {
    console.error("Fetch user profile error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/api/v1/search/semantic", userMiddleware, async (req, res) => {
  const { vector } = req.body;
  if (!Array.isArray(vector)) {
    res.status(400).json({ message: "Missing query vector" });
    return;
  }

  const items = await ContentModel.find({ userId: req.userId, embedding: { $exists: true } });
  const scored = items
    .map(item => ({
      ...item.toObject(),
      score: cosineSimilarity(vector, item.embedding as number[]),
    }))
    .filter((x) => x.score > 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  res.json({ results: scored });
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
