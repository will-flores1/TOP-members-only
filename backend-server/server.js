// Import the express module
const express = require("express");
const connectDB = require("./config/db.js");
require("colors");
require("dotenv").config();
const UserRoutes = require("./routes/UserRoutes");
const PostRoutes = require("./routes/PostRoutes");
const { errorHandler } = require("./middleware/ErrorMiddleware.js");

const port = process.env.PORT || 5000;
connectDB();

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.use("/api/users", UserRoutes);
app.use("/api/posts", PostRoutes);

app.use(errorHandler); // Error handler middleware

// Start the server
app.listen(port, () => {
	console.log(`Server running on:`, `http://localhost:${port}`.yellow.bold);
});
