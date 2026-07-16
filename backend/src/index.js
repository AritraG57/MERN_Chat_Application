import express from "express";
import authRoutes from "./routes/auto.route.js";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";
import cookieParser from "cookie-parser";
import messageRoutes from "./routes/message.route.js";
import cors from "cors";
import { app,server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;

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

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});