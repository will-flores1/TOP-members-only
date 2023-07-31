const asyncHandler = require("express-async-handler");
const {
	obtainGoogleAccessToken,
	fetchGoogleUserProfile,
} = require("../services/googleAuthService");

const validateGoogleAuthCode = asyncHandler(async (req, res, next) => {
	const { code } = req.query;

	// Exchange authorization code for an access token & ID token
	const { id_token, access_token } = await obtainGoogleAccessToken(code);

	if (!id_token || !access_token) {
		return res.status(401).json({ error: "Invalid code" });
	}

	// Get user's info with ID token & access token
	const googleUser = await fetchGoogleUserProfile(id_token, access_token);

	if (!googleUser.email_verified) {
		return res.status(401).json({ error: "Email not verified" });
	}

	// Attach the obtained data to the request object for the next middleware
	req.googleUser = googleUser;

	next();
});

module.exports = validateGoogleAuthCode;
