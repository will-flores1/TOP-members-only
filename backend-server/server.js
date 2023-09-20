// Import the express module
const express = require("express");
const connectDB = require("./config/db.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("colors");
require("dotenv").config();
const UserRoutes = require("./routes/UserRoutes");
const PostRoutes = require("./routes/PostRoutes");
const AuthRoutes = require("./routes/AuthRoutes");

const { errorHandler } = require("./middleware/ErrorMiddleware.js");

const port = process.env.PORT || 5000;
connectDB();

const app = express();

const corsOptions = {
	origin: "http://localhost:4001",
	credentials: true,
};

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded
app.use(errorHandler); // Error handler middleware

// on every request, print out the method and url
app.use((req, res, next) => {
	console.log(`${req.method} ${req.url}`);
	next();
});
// on every request, check for a cookie

app.use("/api/users", UserRoutes);
app.use("/api/posts", PostRoutes);
app.use("/api/auth", AuthRoutes);

// Start the server
app.listen(port, () => {
	console.log(`Server running on:`, `http://localhost:${port}`.yellow.bold);
});
