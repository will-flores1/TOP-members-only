const User = require("../models/UserSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const querystring = require("querystring");
const axios = require("axios");

/*
 * protect middleware
 */
function verifyCookieExists(req) {
	if (!req.cookies["user"]) {
		throw new Error("Not authorized, not signed in");
	}
	return JSON.parse(req.cookies["user"]);
}

function extractCredentialsFromCookie(userCookie) {
	const { _id, token } = userCookie;
	if (!_id || !token) {
		throw new Error("Not authorized, no token");
	}
	return { _id, token };
}

async function findUserById(_id) {
	const user = await User.findOne({ _id }).select("-password");
	if (!user) {
		throw new Error("User not found");
	}
	return user;
}

function verifyJwtToken(token, secret) {
	const jwtToken = jwt.verify(token, secret);
	if (!jwtToken) {
		throw new Error("Not authorized, no token");
	}
	return jwtToken;
}

/*
 * Register validation
 */
function checkIfAlreadyLoggedIn(req) {
	if (req.cookies["user"]) {
		throw new Error("Not authorized, already signed in");
	}
}
function validateRequestBody(req, requiredFields = ["email", "password"]) {
	if (req.body.constructor === Object && Object.keys(req.body).length === 0) {
		throw new Error("Please fill in all fields");
	}
	for (const field of requiredFields) {
		if (!req.body[field]) {
			throw new Error(`Please fill in all fields. Missing: ${field}`);
		}
	}
}
async function checkUserByEmail(email, shouldExist) {
	const user = await User.findOne({ email });
	if (shouldExist && !user) {
		throw new Error("User not found. Please register.");
	}
	if (!shouldExist && user) {
		throw new Error("User already exists");
	}
	return user;
}
async function verifyPassword(inputPassword, userPassword) {
	const passwordIsValid = await bcrypt.compare(inputPassword, userPassword);
	if (!passwordIsValid) {
		throw new Error("Invalid password");
	}
}

/*
 * Google sign in validation
 */
async function obtainGoogleAccessToken(code) {
	const url = "https://oauth2.googleapis.com/token";
	const accessTokenRequestCredentials = querystring.stringify({
		code: code, // code string from google
		client_id: process.env.GOOGLE_CLIENT_ID,
		client_secret: process.env.GOOGLE_CLIENT_SECRET,
		redirect_uri: process.env.REDIRECT_URL,
		grant_type: "authorization_code",
	});

	try {
		const res = await axios.post(`${url}?${accessTokenRequestCredentials}`, {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
		});
		const data = await res.data;

		return data;
	} catch (error) {
		console.error(error);
		throw new Error("Error: " + error);
	}
}

async function fetchGoogleUserProfile(id_token, access_token) {
	const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`; // returns user info from google

	// Get the user's information with the ID token
	const res = await axios.get(url, {
		headers: {
			Authorization: `Bearer ${id_token}`,
		},
	});

	if (!res) {
		throw new Error("Error: " + res.status);
	}
	const data = await res.data;

	if (!data.email_verified) {
		throw new Error("Email not verified");
	}

	return res.data;
}

module.exports = {
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
};
