const axios = require("axios");
const querystring = require("querystring");
const jwt = require("jsonwebtoken");
const User = require("../models/UserSchema");

// Private function not exported
async function obtainGoogleAccessToken(code) {
	// Exchange the authorization code for an access token
	const url = "https://oauth2.googleapis.com/token"; // returns access token from google

	// Exchange the authorization code for an access token
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
		return res.data;
	} catch (error) {
		console.error(error);
		res.send("Error: " + error);
	}
}

// Private function not exported
async function fetchGoogleUserProfile(id_token, access_token) {
	const url = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${access_token}`; // returns user info from google

	try {
		// Get the user's information with the ID token
		const res = await axios.get(url, {
			headers: {
				Authorization: `Bearer ${id_token}`,
			},
		});
		return res.data;
	} catch (error) {
		console.error(error);
		res.send("Error: " + error);
	}
}

// Generate JWT token for browser
function createUserAccessToken(id) {
	return jwt.sign({ id }, process.env.JWT_SECRET, {
		expiresIn: "30d",
	});
}

// Check if user exists, if not, create new user in database
async function findUserOrInsert(name, email) {
	const userExists = await User.findOne({ email });

	// if (userExists) {
	// 	return "User already exists";
	// }

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

module.exports = {
	obtainGoogleAccessToken,
	fetchGoogleUserProfile,
	createUserAccessToken,
	findUserOrInsert,
};
