import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import connectDB from "./lib/db.js";
import authRoute from "./routes/auth.router.js";

dotenv.config();    
const app = express();

app.use(express.json());
app.use(cookieParser());

const PORT = process.env.PORT;

app.use("/api/v1/auth", authRoute);

app.get('/', (req, res) => {
    res.send("this is a test");
})

app.listen(PORT, () => {
    console.log("Server is listening on port: ", PORT);
    connectDB();
})