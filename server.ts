import express from "express";
import path from "path";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./src/routes/auth.routes";
import blogRoutes from "./src/routes/blog.routes";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));


// MongoDB connection
const MONGO_URI = process.env.MONGO_URI!;
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Test route 
app.get("/", (req, res) => {
  res.send("Hello World!"); 
});


app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);



// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
