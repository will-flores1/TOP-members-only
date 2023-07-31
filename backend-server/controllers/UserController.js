const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserSchema.js");
const {
	registerNewUser,
	findUserOrInsert,
	createUserAccessToken,
	sendUserCredentials,
} = require("../services/userService.js");
const { findUserById } = require("../services/middlewareService.js");
require("dotenv").config();

const RegisterUser = asyncHandler(async (req, res) => {
	const { username, email, password } = req.body;
	const user = await registerNewUser(username, email, password);
	const userCredentials = sendUserCredentials(res, user._id);
	res.status(201).json(userCredentials);
	// res.redirect(`${process.env.CLIENT_URL}/home`);
});

const LoginUser = asyncHandler(async (req, res) => {
	const userCredentials = sendUserCredentials(res, req.user._id);
	res.status(200).json(userCredentials);
	// res.redirect(`${process.env.CLIENT_URL}/home`);
});

const GoogleSignInHandler = asyncHandler(async (req, res) => {
	const user = await findUserOrInsert(
		req.googleUser.name,
		req.googleUser.email
	);
	const userCredentials = sendUserCredentials(res, user._id);
	// res.status(201).json(userCredentials);
	res.redirect(`${process.env.CLIENT_URL}/home`);
});

const LogoutUser = asyncHandler(async (req, res) => {
	console.log("Logging out");
	res.clearCookie("user");
	res.redirect(`${process.env.CLIENT_URL}/login`);
	// res.json({ message: "Logged out successfully" });
});

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

const getMe = asyncHandler(async (req, res) => {
	const user = await findUserById(req.user._id);
	res.status(200).json(user);
});

module.exports = {
	RegisterUser,
	LoginUser,
	GoogleSignInHandler,
	LogoutUser,
	GetUsers,
	GetUser,
	UpdateUser,
	DeleteUser,
	getMe,
};
