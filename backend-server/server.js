// Import the express module
const express = require("express");
const connectDB = require("./config/db.js");
require("colors");
require("dotenv").config();
const UserRoutes = require("./routes/UserRoutes");
const PostRoutes = require("./routes/PostRoutes");
const GoogleAuthRoutes = require("./routes/GoogleAuthRoutes");
const { errorHandler } = require("./middleware/ErrorMiddleware.js");

const port = process.env.PORT || 5000;
connectDB();

const app = express();

app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: false })); // for parsing application/x-www-form-urlencoded

app.use("/api/users", UserRoutes);
app.use("/api/posts", PostRoutes);
app.use("/api/auth", GoogleAuthRoutes);

const cors = require("cors");
const cookieParser = require("cookie-parser");
const User = require("./models/UserSchema");

const corsOptions = {
	origin: "http://localhost:4001",
	credentials: true,
};
app.use(cookieParser());
app.use(cors(corsOptions));

app.get("/logout", (req, res) => {
	// Clear the authentication cookie
	res.clearCookie("user");

	// Send a success response
	res.json({ message: "Logged out successfully" });
});

app.get("/me", async (req, res) => {
	const userCookie = req.cookies["user"];
	const userId = JSON.parse(userCookie);
	console.log("id", userId["_id"]);
	console.log("user", userId["token"]);

	const user = await User.findOne({ _id: userId["_id"] });
	const userInfo = {
		name: user.username,
		email: user.email,
	};
	res.json(userInfo);
});

// function auth() {
// 	return (req, res, next) => {
// 		console.log("Auth middleware");
// 		const userInfo = req.cookies.user;

// 		if (userInfo) {
// 			next();
// 		} else {
// 			res.status(401).json({ message: "Not authorized" });
// 		}
// 	};
// }

app.use(errorHandler); // Error handler middleware

// Start the server
app.listen(port, () => {
	console.log(`Server running on:`, `http://localhost:${port}`.yellow.bold);
});
