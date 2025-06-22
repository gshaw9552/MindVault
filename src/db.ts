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
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false}
});

const ContentSchema = new Schema(
  {
    title: String,
    link: String,
    tags: [{type: mongoose.Types.ObjectId, ref: 'Tag'}],
    type: String,
    description: { type: String, required: false},
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true },
    embedding: { type: [Number], default: [] },
  },
  {
    timestamps: true,
  }
)

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
  },
  {
    timestamps: true,
  }
)

const emailVerificationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  otp: { type: String, required: true },
  purpose: { type: String, enum: ['signup', 'reset'], required: true},
  expiresAt: { type: Date,   required: true, expires: 0 },
}, {
  timestamps: true,
});

export const UserModel = model("User", UserSchema);
export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);
export const EmailVerificationModel = model("EmailVerification",  emailVerificationSchema);