import express from "express";
import authRoutes from "./routes/auto.route.js";
import dotenv from "dotenv";
import {connectDB} from "./lib/db.js";

dotenv.config();
const app  = express();

const PORT = process.env.PORT;

app.use(express.json());

app.use("/api/auth",authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    connectDB();
});