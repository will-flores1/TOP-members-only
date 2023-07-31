const bcrypt = require("bcryptjs");
const User = require("../models/UserSchema.js");
const jwt = require("jsonwebtoken");

async function registerNewUser(username, email, password) {
	try {
		const hashedPassword = await createHashPassword(password);
		const user = await User.create({
			username: username,
			email: email,
			password: hashedPassword,
		});

		return user;
	} catch (error) {
		console.error("An error occurred while registering the user:", error);
		throw error; // You may choose to throw a specific error or handle it differently
	}
}

async function findUserOrInsert(name, email) {
	const user = await User.findOneAndUpdate(
		{ email },
		{
			username: name,
			email: email,
			password: "google",
		},
		{ upsert: true, new: true }
	);

	return user;
}

async function createHashPassword(password) {
	try {
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		return hashedPassword;
	} catch (error) {
		console.error("An error occurred while hashing the password:", error);
		throw error;
	}
}

function createUserAccessToken(id) {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
}

function sendUserCredentials(res, userId) {
	const userCredentials = {
		_id: userId,
		token: createUserAccessToken(userId),
	};
	res.cookie("user", JSON.stringify(userCredentials), { httpOnly: true });
	return userCredentials;
}

module.exports = {
	registerNewUser,
	findUserOrInsert,
	createUserAccessToken,
	sendUserCredentials,
};
