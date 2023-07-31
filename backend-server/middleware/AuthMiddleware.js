const asyncHandler = require("express-async-handler");
const {
	verifyCookieExists,
	extractCredentialsFromCookie,
	findUserById,
	verifyJwtToken,
	checkIfAlreadyLoggedIn,
	validateRequestBody,
	checkUserByEmail,
	verifyPassword,
	obtainGoogleAccessToken,
	fetchGoogleUserProfile,
} = require("../services/middlewareService.js");

const protect = asyncHandler(async (req, res, next) => {
	const cookie = verifyCookieExists(req);
	const { _id, token } = extractCredentialsFromCookie(cookie);
	await findUserById(_id);
	verifyJwtToken(token, process.env.JWT_SECRET);

	req.user = {
		_id: _id.toString(),
		token: token,
	};
	next();
});

const registerValidation = asyncHandler(async (req, res, next) => {
	checkIfAlreadyLoggedIn(req);
	validateRequestBody(req, ["username", "email", "password"]);
	await checkUserByEmail(req.body.email, false);
	next();
});

const loginValidation = asyncHandler(async (req, res, next) => {
	checkIfAlreadyLoggedIn(req);
	validateRequestBody(req, ["email", "password"]);
	const user = await checkUserByEmail(req.body.email, true);
	await verifyPassword(req.body.password, user.password);

	req.user = {
		_id: user._id.toString(),
	};

	next();
});

const googleAuthCodeValidation = asyncHandler(async (req, res, next) => {
	const { code } = req.query;
	const { id_token, access_token } = await obtainGoogleAccessToken(code);
	const googleUser = await fetchGoogleUserProfile(id_token, access_token);
	req.googleUser = googleUser;
	next();
});

module.exports = {
	protect,
	registerValidation,
	loginValidation,
	googleAuthCodeValidation,
};
