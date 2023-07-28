const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserSchema.js");

const RegisterUser = asyncHandler(async (req, res) => {
	const { username, password, email } = req.body;

	if (!username || !password || !email) {
		res.status(400);
		throw new Error("Please fill in all fields");
	}

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error("User already exists");
	}

	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(password, salt);

	// Create & Save new user
	const user = await User.create({
		username: username,
		email: email,
		password: hashedPassword,
	});

	if (user) {
		res.status(201).json({
			_id: user._id,
			username: user.username,
			email: user.email,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

const LoginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await bcrypt.compare(password, user.password))) {
		res.json({
			_id: user.id,
			username: user.username,
			email: user.email,
			token: generateToken(user.id),
		});
	} else {
		res.status(401).json({ message: "Invalid email or password" });
		throw new Error("Invalid email or password");
	}
});

// Private route
const GetUsers = asyncHandler(async (req, res) => {
	const users = await User.find();

	if (users) {
		res.status(200);
		res.json(users);
	} else {
		res
			.status(500)
			.json({ message: "An error occurred while retrieving users" });
		throw new Error("An error occurred while retrieving users");
	}
});

// Private route
const GetUser = asyncHandler(async (req, res) => {
	const { userId } = req.params;

	const userExists = await User.findById(userId);

	if (userExists) {
		res.status(200).json(userExists);
	} else {
		res.status(404).json({ message: "User not found" });
		throw new Error("User not found");
	}
});

// Private route
const UpdateUser = asyncHandler(async (req, res) => {
	const { user } = req;
	const { username, password, email } = req.body;
	const { userId } = req.params;

	if (user.id !== userId) {
		res.status(401);
		throw new Error("Not authorized");
	}

	let update = {};
	if (username) {
		update.username = username;
	}
	if (password) {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);
		update.password = hashedPassword;
	}
	if (email) {
		update.email = email;
	}

	try {
		const updatedUser = await User.updateOne({ _id: userId }, { $set: update });
		const user = await User.findById(userId);
		res.json(user);
	} catch (err) {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// Private route
const DeleteUser = asyncHandler(async (req, res) => {
	const { user } = req;
	const { userId } = req.params;

	if (user.id !== userId) {
		res.status(401);
		throw new Error("Not authorized");
	}

	const removedUser = await User.findOneAndRemove({ _id: userId });

	if (removedUser) {
		res.status(200).json(removedUser);
	} else {
		res.status(400);
		throw new Error("Invalid user data");
	}
});

// Private route
const getMe = asyncHandler(async (req, res) => {
	const { user } = req;

	if (!user) {
		res.status(401);
		throw new Error("Not authorized");
	}

	res.status(200).json(user);
});

// Generate JWT token for browser cookie
function generateToken(id) {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
}

module.exports = {
	RegisterUser,
	LoginUser,
	GetUsers,
	GetUser,
	UpdateUser,
	DeleteUser,
	getMe,
};
