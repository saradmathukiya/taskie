const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const taskRoutes = require("./router/task");
const locationRoutes = require("./router/location");
const authRoutes = require("./router/authRoutes");
const adminRoutes = require("./router/adminRoutes");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Define routes
app.use("/api/v1", authRoutes);
app.use("/api/v1", taskRoutes);
app.use("/api/v1", locationRoutes);
app.use("/api/v1/admin", adminRoutes);

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
