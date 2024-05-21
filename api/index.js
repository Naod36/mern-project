import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Import the cors package

import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";
import caseRoutes from "./routes/case.route.js";
import cookieParser from "cookie-parser";

// socket.io
import http from "http";
import { Server } from "socket.io";
import Answer from "./models/case.model.js"; // Adjust the path as needed
// socket.io

dotenv.config();

mongoose
  .connect(process.env.MONGO, {
    connectTimeoutMS: 30000, // Increase the connection timeout
    serverSelectionTimeoutMS: 30000,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log(err));

mongoose.connection.on("error", (err) => {
  console.log("Mongoose connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Mongoose disconnected from DB");
});

const app = express();
app.use(cors());

// socket.io

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: " http://localhost:5173", // Adjust as necessary for your environment
    methods: ["GET", "POST"],
  },
});
// socket.io

app.use(express.json());
app.use(cookieParser());

// socket.io

// app.listen(3000, () => {
//   console.log("Server is running on port 3000!");
// });

// socket.io
// io.on("connection", (socket) => {
//   console.log("A user connected:", socket.id);
// });
// socket.io

app.use("/api/case", caseRoutes);
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/case", postRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// socket.io

// Listen for changes in the Answer model
const answerChangeStream = Answer.watch();
answerChangeStream.on("change", (change) => {
  if (
    change.operationType === "update" &&
    change.updateDescription.updatedFields.state
  ) {
    Answer.findById(change.documentKey._id).then((updatedAnswer) => {
      io.emit("stateUpdated", updatedAnswer);
    });
  }
});
io.on("connection", (socket) => {
  socket.on("joinRoom", (userId) => {
    socket.join(userId);
  });
});

// Middleware to make io accessible in routes
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Start the server
server.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

export default io;
