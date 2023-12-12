import express from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv"

dotenv.config({ path: '.env' });

const app = express();

app.use(cors({
    origin: "*",
    credentials: true
}));

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())


import { connectDB } from "./db/index.js";

connectDB();

import componentRouter from "./routes/component.js";

app.use("/component", componentRouter);

app.listen(3000, () => {
    console.log("Listening on port 3000");
});
