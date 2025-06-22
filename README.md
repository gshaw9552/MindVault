# 🧠 MindVault

MindVault is your personal knowledge organizer — a modern, intuitive web app that lets you save, search, and share content from various platforms like YouTube, Twitter, Instagram, links, music, and your own notes.

> 🚀 Live Demo: [https://mindvault-xpay.onrender.com](https://mindvault-xpay.onrender.com)

---

## 🌟 Features

- 🔐 Secure user authentication (Sign up, Login, Email Verification, Password Reset)
- 🧠 "Brains" — user-curated collections of content
- 📎 Supports YouTube videos, Tweets, Instagram posts, music links, articles, and notes
- 🔍 Semantic search using Universal Sentence Encoder
- 📤 Shareable public brains
- 🧾 Saved history & edit/delete support
- 📬 OTP email verification system
- ⚙️ Responsive & clean Tailwind UI

---

## 🛠 Tech Stack

### Frontend

- React + Vite + TypeScript
- Tailwind CSS
- React Router, Axios
- Toast notifications

### Backend

- Node.js + Express + TypeScript
- MongoDB (Mongoose ODM)
- Zod for validation
- JWT authentication
- Nodemailer for email OTPs
- TensorFlow Universal Sentence Encoder (via `@tensorflow-models/universal-sentence-encoder`)

---

## 📁 Project Structure

```
/
├── src/                 # Backend source (Express + TypeScript)
├── frontend/            # Frontend source (React + Vite + TS)
├── dist/                # Backend compiled output
├── package.json         # Backend scripts & deps
├── tsconfig.json        # TypeScript config
└── README.md
```

---

## 🧑‍💻 Local Development Setup

### ✅ Backend

```bash
npm install
# Create .env in root with:
# MONGO_URI=...
# JWT_SECRET=...
# USER=your_email
# PASS=app_password
# FROM_EMAIL=no-reply@mindvault.com

npm run build
npm start
# Runs on http://localhost:3000
```

### ✅ Frontend

```bash
cd frontend
npm install
# Create .env.local (for local-only use)
# VITE_API_BASE=http://localhost:3000/api/v1

npm run dev     # http://localhost:5173
npm run preview # http://localhost:4173
```

---

## ☁️ Render Deployment Guide

### 🔹 Backend (Web Service)

- **Root Directory**: `/`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Env Vars**:
  ```env
  MONGO_URI=your_mongo_uri
  JWT_SECRET=your_secret
  USER=your_email
  PASS=your_app_password
  FROM_EMAIL=no-reply@mindvault.com
  ```

### 🔸 Frontend (Static Site)

- **Root Directory**: `frontend/`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Env Vars**:
  ```env
  VITE_API_BASE=https://mindvault-backend-xxxxx.onrender.com/api/v1
  ```


---


## 📄 License

MIT License © 2025 MindVault Contributors
