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
  const share = req.body.share;
  if (share) {
    const existingLink = await LinkModel.findOne({
      userId: req.userId,
    });

    if (existingLink) {
      res.json({
        hash: existingLink.hash,
      });
      return;
    }
    const hash = random(10);
    await LinkModel.create({
      userId: req.userId,
      hash: hash,
    });

    res.json({
      hash,
    });
  } else {
    await LinkModel.deleteOne({
      userId: req.userId,
    });

    res.json({
      message: "Removed link",
    });
  }
});

app.get("/api/v1/brain/:shareLink", async (req, res) => {
  try {
    // Log the incoming shareLink parameter for debugging
    const hash = req.params.shareLink.trim();
    console.log("Received shareLink hash:", hash);

    const link = await LinkModel.findOne({ hash });
    if (!link) {
      console.error("Link not found for hash:", hash);
      res.status(404).json({
        message: "Link not found",
      });
      return;
    }
    
    // Log the found link document
    console.log("Found link:", link);

    const content = await ContentModel.find({
      userId: link.userId,
    });
    console.log("Found content for user:", content);

    const user = await UserModel.findOne({
      _id: link.userId,
    });
    if (!user) {
      console.error("User not found for id:", link.userId);
      res.status(404).json({
        message: "User not found",
      });
      return;
    }

    res.json({
      username: user.username,
      content: content,
    });
  } catch (error) {
    console.error("Error in /api/v1/brain/:shareLink:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
