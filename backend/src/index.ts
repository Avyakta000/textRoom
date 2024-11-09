import express, {Express} from "express";
import cookieParser from "cookie-parser";
import path from "path";

import authRoutes from "./routes/auth.route.js"
import messageRoutes from "./routes/message.route.js"
import {notFound, errorHandler} from "./middleware/errorHandler.js";

import { configDotenv } from "dotenv";
import { app, server } from "./socket/socket.js";
configDotenv();

const __dirname = path.resolve();

// const app = express()


app.use(cookieParser()) // parse cookies
app.use(express.json()); // parse application/json

app.use("/api/auth", authRoutes)
app.use("/api/messages", messageRoutes)

app.use(notFound); // unhandled routes (which are not defined)
app.use(errorHandler); // error middleware should be the last middleware 

const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV !=="development"){
  app.use(express.static(path.join(__dirname, "/frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
  });

}

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});