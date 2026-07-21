import express from "express";
import authRoutes from "./routes/auto.route.js";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app,server } from "./lib/socket.js";
import path from "path";
import friendRoutes from "./routes/friend.route.js";
import groupRoutes from "./routes/group.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

//Fixed for large size image upload
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}))

app.use("/api/auth",authRoutes);
app.use("/api/messages",messageRoutes);
app.use("/api/friends",friendRoutes);
app.use("/api/group",groupRoutes);
app.use("/api/user",userRoutes);

if(process.env.NODE_ENV==="production") {
    app.use(express.static(path.join(__dirname, "../frontend/dist")));

    app.get("/{*splat}", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
    });
}

server.listen(PORT, () => {
    console.log("server is running on PORT:" + PORT);
    connectDB();
});