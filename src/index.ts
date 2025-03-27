import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signInSchema, userSchema } from "./validationSchema";
import { ContentModel, UserModel } from "./db";
import { userMiddleware } from "./middleware";

const app = express();
app.use(express.json());


app.post("/api/v1/signup", async (req, res) => {
    const result = userSchema.safeParse(req.body);
  
    if (!result.success) {
        res.status(400).json({
            message: "Invalid Input",
            errors: result.error.flatten().fieldErrors
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
            password: hashedPassword
        });
  
        res.json({ message: "User signed up" });
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
    const link = req.body.link;
    const type = req.body.type;
    await ContentModel.create({
        link,
        type,
        title: req.body.title,
        userId: req.userId,
        tags: []
    })

    res.json({
        message: "Content added"
    })
})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    const userId = req.userId;
    const content = await ContentModel.find({
        userId: userId
    }).populate("userId", "username")
    res.json({
        content
    })
})

app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;
    
    await ContentModel.deleteMany({
        contentId,
        userId: req.userId
    })

    res.json({
        message: "Deleted"
    })
})

app.post("/api/v1/brain/share", (req, res) => {

})

app.post("/api/v1/brain/:shareLink", (req, res) => {

})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});  