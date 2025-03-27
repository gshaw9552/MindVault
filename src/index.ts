import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { signInSchema, userSchema } from "./validationSchema";
import { UserModel } from "./db";

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

app.post("/api/v1/content", (req, res) => {

})

app.get("/api/v1/content", (req, res) => {

})

app.delete("/api/v1/content", (req, res) => {

})

app.post("/api/v1/brain/share", (req, res) => {

})

app.post("/api/v1/brain/:shareLink", (req, res) => {

})

app.listen(3000, () => {
    console.log("Server started on port 3000");
});  