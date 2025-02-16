// Boilerplate for "Voices of Change"
// Technologies: React.js, Node.js with Express, MongoDB, JWT, Tailwind CSS, Vercel (Frontend), Render (Backend)

// Directory structure:
// - frontend/
// - backend/

// ======================= FRONTEND ======================= //
// frontend/package.json
{
  "name": "voices-of-change-frontend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "react": "^18.0.0",
    "react-dom": "^18.0.0",
    "react-router-dom": "^6.0.0",
    "axios": "^1.0.0",
    "@tailwindcss/forms": "^0.5.0"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}

// frontend/tailwind.config.js
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};

// frontend/src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;

// frontend/src/pages/Home.js
import React from "react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <h1 className="text-4xl font-bold">Welcome to Voices of Change</h1>
    </div>
  );
}

// ======================= BACKEND ======================= //
// backend/package.json
{
  "name": "voices-of-change-backend",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "express": "^4.18.0",
    "mongoose": "^7.0.0",
    "jsonwebtoken": "^9.0.0",
    "dotenv": "^16.0.0",
    "cors": "^2.8.5",
    "bcryptjs": "^2.4.3"
  },
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}

// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Routes
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// backend/.env
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/voices_of_change?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_key

// ======================= DEPLOYMENT ======================= //
// Frontend: Deploy the "frontend" folder to Vercel
// Backend: Deploy the "backend" folder to Render

// ======================= NEXT STEPS ======================= //
// - Add user authentication (JWT implementation in backend, login/register forms in frontend).
// - Define additional routes (e.g., for posts, users) in backend.
// - Build modular components (header, footer, blog editor) in frontend.
// - Add third-party services like Cloudinary for image uploads.
// - Ensure responsive design using Tailwind CSS utilities.

// This boilerplate is scalable and modular, designed to grow with your application needs.
