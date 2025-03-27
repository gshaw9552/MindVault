import mongoose, { model, Schema } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  throw new Error("MONGO_URI is not defined in the environment variables.");
}

mongoose.connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const UserSchema = new Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String,
});

export const UserModel = model("User", UserSchema);
