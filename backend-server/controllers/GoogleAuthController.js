const asyncHandler = require("express-async-handler");
const {
	findUserOrInsert,
	createUserAccessToken,
} = require("../services/googleAuthService");

// Got URL in the client side
// const GetGoogleAuthAppURL = (req, res) => {
// 	const authUrl =
// 		"https://accounts.google.com/o/oauth2/v2/auth?" +
// 		querystring.stringify({
// 			client_id: process.env.GOOGLE_CLIENT_ID,
// 			redirect_uri: process.env.REDIRECT_URL,
// 			response_type: "code",
// 			scope: "https://www.googleapis.com/auth/userinfo.profile",
// 		});
// 	console.log("auth url", authUrl);
// 	res.redirect(authUrl);
// };

// Handle authorization code from callback
// const GoogleAuthHandler = asyncHandler(async (req, res) => {
// 	const { code } = req.query;

// 	// Exchange authorization code for an access token & ID token
// 	const { id_token, access_token } = await obtainAccessToken(code);

// 	if (!id_token || !access_token) {
// 		res.status(401);
// 		throw new Error("Invalid code");
// 	}

// 	// Get user's info with ID token & access token
// 	const googleUser = await fetchGoogleUserProfile(id_token, access_token);

// 	// Check if user email is verified
// 	if (!googleUser.email_verified) {
// 		res.status(401);
// 		throw new Error("Email not verified");
// 	}

// 	const { email, name, picture } = req.googleUser;

// 	// // Check if user exists, if not, create new user in database
// 	const user = await findUserOrInsert(name, email);

// 	// Generate JWT token for browser
// 	const token = createAccessToken(user._id);

// 	// Send token to browser and store in local storage for future requests
// 	const userCredentials = {
// 		_id: user._id,
// 		token: token,
// 	};

// 	res.status(201).json(userCredentials);
// });

const GoogleAuthHandler = asyncHandler(async (req, res) => {
	const { email, name } = req.googleUser;

	// Check if user exists, if not, create new user in database
	const user = await findUserOrInsert(name, email);

	// Generate JWT token for browser
	const token = createUserAccessToken(user._id);

	// Send token to browser and store in local storage for future requests
	const userCredentials = {
		_id: user._id,
		token: token,
	};

	// res.status(201).json(userCredentials);

	// Set user information in an HTTP-only cookie
	res.cookie("user", JSON.stringify(userCredentials), { httpOnly: true });

	// Redirect to the client's home page (replace with your client's URL)
	res.redirect("http://localhost:4001/home");
});

module.exports = { GoogleAuthHandler };
