import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./lib/db.js"; // Import your new connectDB function

import authRoute from "./routes/auth.route.js";
import testRoute from "./routes/test.route.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import chatRoute from "./routes/chat.route.js";
import messageRoute from "./routes/message.route.js";

const app = express();

// Middlewares
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// A simple test route (can be removed if not needed)
app.use("/api/test", (req, res) => {
    res.send("<h1>Test route is working</h1>");
});

// Start the server and connect to the database
app.listen(5173, () => {
    connectDB(); // Connect to MongoDB when the server starts
    console.log("Server is running on port 5173");
});