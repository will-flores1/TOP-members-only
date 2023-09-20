const asyncHandler = require("express-async-handler");
const {
	registerNewUser,
	findUserOrInsert,
	sendUserCredentials,
} = require("../services/userService.js");

const AuthCtlr = (() => {
	const register = asyncHandler(async (req, res) => {
		const { username, email, password } = req.body;
		const user = await registerNewUser(username, email, password);
		const userCredentials = sendUserCredentials(res, user._id);
		res.status(201).json(userCredentials);
		// res.redirect(`${process.env.CLIENT_URL}/home`);
	});

	const login = asyncHandler(async (req, res) => {
		const userCredentials = sendUserCredentials(res, req.user._id);
		res.status(200).json(userCredentials);
		// res.redirect(`${process.env.CLIENT_URL}/home`);
	});

	const googleSignInHandler = asyncHandler(async (req, res) => {
		const user = await findUserOrInsert(
			req.googleUser.name,
			req.googleUser.email
		);
		const userCredentials = sendUserCredentials(res, user._id);
		// res.status(201).json(userCredentials);
		res.redirect(`${process.env.CLIENT_URL}/home`);
	});

	const logout = asyncHandler(async (req, res) => {
		console.log("Logged out");
		res.clearCookie("user");
		res.redirect(`${process.env.CLIENT_URL}/login`);
		// res.json({ message: "Logged out successfully" });
	});

	return {
		register,
		login,
		googleSignInHandler,
		logout,
	};
})();

module.exports = AuthCtlr;
