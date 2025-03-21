import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
const app = express();
import authRouter from "./routes/auth.routes.js";

app.use(express.json());

//middlewares
app.use(cors());

app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());


//ROUTES
app.use("/api/auth", authRouter);

export {app}
