import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signInSchema, userSchema } from "./validationSchema";
import { ContentModel, LinkModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
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
    await UserModel.create({
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User signed up" });
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

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  try {
    const { link, type, title, description } = req.body;

    if (!link || !type || !title) {
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

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
